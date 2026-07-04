"use client"
import { createContext, useEffect, useState, useContext } from "react"
import { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}
interface AppUser {
  user: User | undefined;
  profile: Profile | null;
}

interface AuthContextType {
  user: AppUser | null,
  loading: boolean,
  signOut: () => Promise<void>
}

const AuthContext = createContext< AuthContextType | undefined>(undefined);

export function AuthProvider({children}:{children:React.ReactNode}) {

  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  
  useEffect(()=> {
    async function loadUser(session: Session | null) {
      if (!session?.user) {
        setUser(null);
        return;
      }
      console.log(session.user);
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", session.user.id)
        .maybeSingle();
      if (error) console.error("error getting profile", error);

      setUser({
        user: session.user,
        profile: profile ?? null,
      });
    }
    
    async function checkUserSession() {
      const {data:{session}} = await supabase.auth.getSession();
      loadUser(session);
      console.log("normal run");
      setLoading(false);
    } 
    checkUserSession()

    const {data:{subscription}} = supabase.auth.onAuthStateChange( (event, session) => {
      setTimeout(() => {
        void loadUser(session);
        console.log("stateChange run");
        
      }, 0);
    });
    
    return () => {
      subscription.unsubscribe();
    };

  },[supabase]) 

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth?tab=login");
  }


  return <AuthContext.Provider value={{user, loading, signOut}}>
    {children}
  </AuthContext.Provider>

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
"use client"
import { createContext, useEffect, useState, useContext } from "react"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User |null,
  loading: boolean,
  signOut: () => Promise<void>
}

const AuthContext = createContext< AuthContextType | undefined>(undefined);

export function AuthProvider({children}:{children:React.ReactNode}) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  useEffect(()=> {
    async function checkUserSession() {
      try {
        const {data:{session}} = await supabase.auth.getSession();
        console.log("session", session?.user);
        setUser(session?.user || null);

        const {data:{subscription}} = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user || null);
        });
        
        return () => {
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setLoading(false);
      }
        
    } 
    checkUserSession()
  },[supabase.auth]) 


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
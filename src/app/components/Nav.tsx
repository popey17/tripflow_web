"use client"
import { useAuth } from "../context/auth-context"
import {  createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useEffect, useState } from "react"


type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const Nav = () => {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      if (!user?.id) {
        setProfile(null)
        return
      }
      

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      console.log("data", data);

      if (error) {
        console.error("Error getting profile:", error)
      } else {
        setProfile(data)
      }
    }

    getProfile()
  }, [user?.id, supabase])
  
  return (
    <>
    {loading ? (
      <div>Loading...</div>
    ) : (
      <>
        {user ? (
          <div>
            <button onClick={signOut}>Sign Out</button>
            <p>{user?.id}</p>
            <p>{profile?.full_name}</p>
          </div>
        ) : (
          <div>
            <Link href="/auth?tab=login">Sign In</Link>
          </div>
        )}
      </>
    )}  
    </>
  )
}

export default Nav
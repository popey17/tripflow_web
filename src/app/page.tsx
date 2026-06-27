import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <p className="mt-4">
        Supabase status: <span className="text-green-500 font-bold">✅ Connected</span>
      </p>
      <h1 className="text-2xl font-bold">{user?.user_metadata.name}</h1>
    </div>
  );
}

import AuthShell from "@/app/components/auth/AuthShell";

type AuthPageProps = {
  searchParams: Promise<{
    tab?: string | string[];
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const tab = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const mode = tab === "register" ? "register" : "login";

  return <AuthShell mode={mode} />;
}

import SideMenu from "./SideMenu";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <SideMenu />
      <main className="pl-24 pr-6 py-8 sm:pl-28 sm:pr-10 lg:pr-16">
        {children}
      </main>
    </div>
  );
}

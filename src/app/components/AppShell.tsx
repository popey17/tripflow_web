import SideMenu from "./SideMenu";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh md:flex">
      <div className="md:flex md:shrink-0 md:items-center md:px-5 md:py-8 z-2">
        <SideMenu />
      </div>
      <main className="flex-1 px-4 py-8 pb-24 md:px-8 md:pb-8 lg:pr-16">
        {children}
      </main>
    </div>
  );
}

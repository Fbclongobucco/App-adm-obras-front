import { Suspense } from "react";
import { Brand } from "@/components/shell/brand";
import { MobileBar } from "@/components/shell/mobile-bar";
import { LogoutButton, UserMenu } from "@/components/shell/user-menu";
import { NavMenu, Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col sm:flex-row">
      <MobileBar
        brand={<Brand compact />}
        drawerBrand={<Brand />}
        logout={<LogoutButton className="rounded border border-line/60 px-3 py-1.5 text-sm font-medium text-title hover:border-title" />}
        user={(
          <Suspense fallback={<div className="h-16 border-t border-white/15" />}>
            <UserMenu variant="drawer" />
          </Suspense>
        )}
      />

      {/* Fixo na viewport: com sticky, um dropdown que passa do fim da pagina deixava o menu subir com o conteiner */}
      <aside className="hidden bg-title sm:fixed sm:inset-y-0 sm:left-0 sm:z-30 sm:block sm:w-56 sm:overflow-y-auto lg:w-60">
        <Brand />
        <Suspense fallback={<NavMenu pathname={null} />}>
          <Sidebar />
        </Suspense>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col sm:pl-56 lg:pl-60">
        <header className="hidden items-center justify-end border-b border-line/60 bg-white px-6 py-3 sm:flex">
          <Suspense fallback={<div className="h-9 w-40 rounded bg-surface" />}>
            <UserMenu variant="header" />
          </Suspense>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

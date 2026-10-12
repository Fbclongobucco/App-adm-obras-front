import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Sidebar, SidebarNav } from "@/components/sidebar";
import { getSession } from "@/lib/session";
import { USER_ROLES } from "@/lib/types";
import { logout } from "./actions";

async function UserMenu() {
  const session = await getSession();
  const roles = session?.user.roles ?? [];
  return (
    <div className="flex items-center gap-4">
      <div className="text-right leading-tight">
        <p className="text-sm font-medium text-title">{session?.user.name ?? session?.user.email}</p>
        <p className="text-xs text-body">
          {roles.map((role) => USER_ROLES[role as keyof typeof USER_ROLES] ?? role).join(", ")}
        </p>
      </div>
      <form action={logout}>
        <button className="rounded border border-line/60 px-3 py-1.5 text-sm font-medium text-title hover:border-title">
          Sair
        </button>
      </form>
    </div>
  );
}

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col sm:flex-row">
      {/* Fixo na viewport: com sticky, um dropdown que passa do fim da pagina deixava o menu subir com o conteiner */}
      <aside className="bg-title sm:fixed sm:inset-y-0 sm:left-0 sm:z-30 sm:w-56 sm:overflow-y-auto lg:w-60">
        {/* A logo e grafite e nao pode ser recolorida: fica num bloco claro compacto sobre o menu escuro */}
        <Link href="/" aria-label="SOLER · Dashboard" className="flex flex-col items-start gap-2 px-5 pt-5 pb-2">
          <span className="rounded-md bg-white px-3 py-2">
            <Image src="/soler-logo.png" alt="SOLER" width={168} height={65} loading="eager" className="h-9 w-auto" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-white/70">Administração de obras</span>
        </Link>
        <Suspense fallback={<SidebarNav pathname={null} />}>
          <Sidebar />
        </Suspense>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col sm:pl-56 lg:pl-60">
        <header className="flex items-center justify-end border-b border-line/60 bg-white px-6 py-3">
          <Suspense fallback={<div className="h-9 w-40 rounded bg-surface" />}>
            <UserMenu />
          </Suspense>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

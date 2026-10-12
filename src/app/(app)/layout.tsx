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
      <aside className="border-b border-line/30 bg-white sm:sticky sm:top-0 sm:h-screen sm:w-56 sm:shrink-0 sm:overflow-y-auto sm:border-r sm:border-b-0 lg:w-60">
        <Link href="/" className="block border-b border-line/30 px-5 py-5">
          <span className="block font-heading text-base font-semibold text-title">Administração de Obras</span>
          <span className="mt-0.5 block text-xs text-body">Gestão de obras e equipes</span>
        </Link>
        <Suspense fallback={<SidebarNav pathname={null} />}>
          <Sidebar />
        </Suspense>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-line/30 bg-white px-6 py-3">
          <Suspense fallback={<div className="h-9 w-40 rounded bg-surface" />}>
            <UserMenu />
          </Suspense>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

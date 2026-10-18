import { logout } from "@/app/(app)/actions";
import { getSession } from "@/lib/session";
import { USER_ROLES } from "@/lib/types";

export function LogoutButton({ className }: { className: string }) {
  return (
    <form action={logout}>
      <button className={className}>Sair</button>
    </form>
  );
}

/**
 * Nome, perfil e "Sair" do usuario logado. {@code header}: cabecalho claro do desktop; {@code drawer}: rodape
 * do painel grafite do celular. Le a sessao: fica dentro de <Suspense>.
 */
export async function UserMenu({ variant }: { variant: "header" | "drawer" }) {
  const session = await getSession();
  const roles = (session?.user.roles ?? [])
    .map((role) => USER_ROLES[role as keyof typeof USER_ROLES] ?? role).join(", ");
  const name = session?.user.name ?? session?.user.email;
  if (variant === "drawer") {
    return (
      <div className="flex items-center justify-between gap-3 border-t border-white/15 px-5 py-4">
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-white/70">{roles}</p>
        </div>
        <LogoutButton className="rounded border border-white/40 px-3 py-1.5 text-sm font-medium text-white hover:border-white" />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4">
      <div className="text-right leading-tight">
        <p className="text-sm font-medium text-title">{name}</p>
        <p className="text-xs text-body">{roles}</p>
      </div>
      <LogoutButton className="rounded border border-line/60 px-3 py-1.5 text-sm font-medium text-title hover:border-title" />
    </div>
  );
}

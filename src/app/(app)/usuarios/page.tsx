import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam } from "@/components/pagination";
import { StatusBadge } from "@/components/status-badge";
import { getPage, isAdmin } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { USER_ROLES, type User } from "@/lib/types";

export default async function UsersPage({ searchParams }: PageProps<"/usuarios">) {
  const page = pageParam((await searchParams).page);
  const [result, admin] = await Promise.all([getPage<User>("/api/users", page), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Acesso ao sistema."
        action={admin ? { href: "/usuarios/novo", label: "Novo usuário" } : undefined}
      />
      <DataTable
        rows={result.content}
        empty="Nenhum usuário cadastrado."
        rowHref={(row) => `/usuarios/${row.id}`}
        columns={[
          { header: "Nome", cell: (u) => u.name },
          { header: "E-mail", cell: (u) => u.email },
          { header: "Perfis", cell: (u) => u.roles.map((role) => USER_ROLES[role] ?? role).join(", ") },
          { header: "Situação", cell: (u) => <StatusBadge done={!u.isActive} doneLabel="Inativo" openLabel="Ativo" /> },
          { header: "Atualizado em", cell: (u) => <span className="font-mono text-xs">{formatDateTime(u.updatedAt)}</span>, className: "whitespace-nowrap" },
        ]}
      />
      <Pagination href="/usuarios" page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

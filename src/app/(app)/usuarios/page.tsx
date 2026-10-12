import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam, queryParam } from "@/components/pagination";
import { SearchEmpty, SearchField } from "@/components/search-field";
import { StatusBadge } from "@/components/status-badge";
import { getPage, isAdmin } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { USER_ROLES, type User } from "@/lib/types";

export default async function UsersPage({ searchParams }: PageProps<"/usuarios">) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const q = queryParam(params.q);
  const [result, admin] = await Promise.all([getPage<User>("/api/users", page, 20, undefined, q), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Acesso ao sistema."
        action={admin ? { href: "/usuarios/novo", label: "Novo usuário" } : undefined}
      />
      <SearchField href="/usuarios" initial={q} placeholder="Buscar por nome ou e-mail" />
      {q && result.totalElements === 0 ? (
        <SearchEmpty href="/usuarios" query={q} />
      ) : (
        <>
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
        </>
      )}
      <Pagination href="/usuarios" query={q} page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

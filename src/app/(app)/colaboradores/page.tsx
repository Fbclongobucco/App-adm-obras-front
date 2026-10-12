import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam, queryParam } from "@/components/pagination";
import { SearchEmpty, SearchField } from "@/components/search-field";
import { getPage, isAdmin } from "@/lib/api";
import { formatCpf, formatDateTime } from "@/lib/format";
import { EMPLOYEE_ROLES, type EmployeeSummary } from "@/lib/types";

export default async function EmployeesPage({ searchParams }: PageProps<"/colaboradores">) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const q = queryParam(params.q);
  const [result, admin] = await Promise.all([getPage<EmployeeSummary>("/api/employees", page, 20, undefined, q), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Colaboradores"
        description="Equipe alocada nas obras. Exige centro de custo."
        action={admin ? { href: "/colaboradores/novo", label: "Novo colaborador" } : undefined}
      />
      <SearchField href="/colaboradores" initial={q} placeholder="Buscar por nome, CPF ou e-mail" />
      {q && result.totalElements === 0 ? (
        <SearchEmpty href="/colaboradores" query={q} />
      ) : (
        <>
          <DataTable
            rows={result.content}
            empty="Nenhum colaborador cadastrado."
            rowHref={(row) => `/colaboradores/${row.id}`}
            columns={[
              { header: "Nome", cell: (row) => row.name },
              { header: "CPF", cell: (row) => <span className="font-mono font-medium">{formatCpf(row.cpf)}</span>, className: "whitespace-nowrap" },
              { header: "Função", cell: (row) => EMPLOYEE_ROLES[row.role] ?? row.role },
              { header: "Centro de custo", cell: (row) => row.costCenter.name },
              { header: "Atualizado em", cell: (row) => <span className="font-mono text-xs">{formatDateTime(row.updatedAt)}</span>, className: "whitespace-nowrap" },
            ]}
          />
        </>
      )}
      <Pagination href="/colaboradores" query={q} page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

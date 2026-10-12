import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam } from "@/components/pagination";
import { getPage, isAdmin } from "@/lib/api";
import { formatCpf, formatDateTime } from "@/lib/format";
import { EMPLOYEE_ROLES, type EmployeeSummary } from "@/lib/types";

export default async function EmployeesPage({ searchParams }: PageProps<"/colaboradores">) {
  const page = pageParam((await searchParams).page);
  const [result, admin] = await Promise.all([getPage<EmployeeSummary>("/api/employees", page), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Colaboradores"
        description="Equipe alocada nas obras. Exige centro de custo."
        action={admin ? { href: "/colaboradores/novo", label: "Novo colaborador" } : undefined}
      />
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
      <Pagination href="/colaboradores" page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

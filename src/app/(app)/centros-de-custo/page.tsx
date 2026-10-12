import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam } from "@/components/pagination";
import { getPage, isAdmin } from "@/lib/api";
import { formatCnpj, formatDateTime } from "@/lib/format";
import type { CostCenter } from "@/lib/types";

export default async function CostCentersPage({ searchParams }: PageProps<"/centros-de-custo">) {
  const page = pageParam((await searchParams).page);
  const [result, admin] = await Promise.all([getPage<CostCenter>("/api/cost-centers", page), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Centros de custo"
        description="Base para colaboradores e obras."
        action={admin ? { href: "/centros-de-custo/novo", label: "Novo centro de custo" } : undefined}
      />
      <DataTable
        rows={result.content}
        empty="Nenhum centro de custo cadastrado."
        rowHref={(row) => `/centros-de-custo/${row.id}`}
        columns={[
          { header: "Nome", cell: (row) => row.name },
          { header: "CNPJ", cell: (row) => <span className="font-mono font-medium">{formatCnpj(row.cnpj)}</span> },
          { header: "Atualizado em", cell: (row) => <span className="font-mono text-xs">{formatDateTime(row.updatedAt)}</span>, className: "whitespace-nowrap" },
        ]}
      />
      <Pagination href="/centros-de-custo" page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

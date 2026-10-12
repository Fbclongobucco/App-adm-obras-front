import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam, queryParam } from "@/components/pagination";
import { SearchEmpty, SearchField } from "@/components/search-field";
import { getPage, isAdmin } from "@/lib/api";
import { formatCnpj, formatDateTime } from "@/lib/format";
import type { CostCenter } from "@/lib/types";

export default async function CostCentersPage({ searchParams }: PageProps<"/centros-de-custo">) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const q = queryParam(params.q);
  const [result, admin] = await Promise.all([getPage<CostCenter>("/api/cost-centers", page, 20, undefined, q), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Centros de custo"
        description="Base para colaboradores e obras."
        action={admin ? { href: "/centros-de-custo/novo", label: "Novo centro de custo" } : undefined}
      />
      <SearchField href="/centros-de-custo" initial={q} placeholder="Buscar por nome ou CNPJ" />
      {q && result.totalElements === 0 ? (
        <SearchEmpty href="/centros-de-custo" query={q} />
      ) : (
        <>
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
        </>
      )}
      <Pagination href="/centros-de-custo" query={q} page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

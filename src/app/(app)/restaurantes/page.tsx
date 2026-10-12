import { DataTable } from "@/components/data-table";
import { ProjectRef } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam } from "@/components/pagination";
import { getPage, isAdmin } from "@/lib/api";
import { formatDateTime, formatPhone } from "@/lib/format";
import type { Restaurant } from "@/lib/types";

export default async function RestaurantsPage({ searchParams }: PageProps<"/restaurantes">) {
  const page = pageParam((await searchParams).page);
  const [result, admin] = await Promise.all([getPage<Restaurant>("/api/restaurants", page), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Restaurantes"
        description="Cada restaurante atende uma obra. Exige obra cadastrada."
        action={admin ? { href: "/restaurantes/novo", label: "Novo restaurante" } : undefined}
      />
      <DataTable
        rows={result.content}
        empty="Nenhum restaurante cadastrado."
        rowHref={(row) => `/restaurantes/${row.id}`}
        columns={[
          { header: "Nome", cell: (row) => row.name },
          { header: "Obra", cell: (row) => <ProjectRef project={row.project} /> },
          { header: "Telefone", cell: (row) => <span className="font-mono font-medium">{formatPhone(row.phone)}</span>, className: "whitespace-nowrap" },
          { header: "Cidade", cell: (row) => (row.address ? `${row.address.city}/${row.address.state}` : "—") },
          { header: "Atualizado em", cell: (row) => <span className="font-mono text-xs">{formatDateTime(row.updatedAt)}</span>, className: "whitespace-nowrap" },
        ]}
      />
      <Pagination href="/restaurantes" page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

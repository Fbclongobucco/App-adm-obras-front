import { DataTable } from "@/components/data-table";
import { ProjectRef } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam } from "@/components/pagination";
import { getPage, isAdmin } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Accommodation } from "@/lib/types";

export default async function AccommodationsPage({ searchParams }: PageProps<"/hospedagens">) {
  const page = pageParam((await searchParams).page);
  const [result, admin] = await Promise.all([getPage<Accommodation>("/api/accommodations", page), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Hospedagens"
        description="Alojamento das equipes. A obra é opcional."
        action={admin ? { href: "/hospedagens/novo", label: "Nova hospedagem" } : undefined}
      />
      <DataTable
        rows={result.content}
        empty="Nenhuma hospedagem cadastrada."
        rowHref={(row) => `/hospedagens/${row.id}`}
        columns={[
          { header: "Anfitrião", cell: (a) => a.hostName },
          { header: "Obra", cell: (a) => (a.project ? <ProjectRef project={a.project} /> : "Sem obra") },
          { header: "Cidade", cell: (a) => `${a.address.city}/${a.address.state}` },
          { header: "Hóspedes", cell: (a) => <span className="font-mono font-medium">{a.employees.length}/{a.capacity}</span>, className: "text-right" },
          { header: "Diárias", cell: (a) => <span className="font-mono font-medium">{a.days}</span>, className: "text-right" },
          { header: "Total", cell: (a) => <span className="font-mono font-medium">{formatCurrency(a.totalPrice)}</span>, className: "whitespace-nowrap text-right" },
          { header: "Atualizada em", cell: (a) => <span className="font-mono text-xs">{formatDateTime(a.updatedAt)}</span>, className: "whitespace-nowrap" },
        ]}
      />
      <Pagination href="/hospedagens" page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

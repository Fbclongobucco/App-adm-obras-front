import { DataTable } from "@/components/data-table";
import { LeaseProgress } from "@/components/lease-progress";
import { ProjectRef } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam, queryParam } from "@/components/pagination";
import { SearchEmpty, SearchField } from "@/components/search-field";
import { getPage, isAdmin } from "@/lib/api";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { today } from "@/lib/today";
import type { Accommodation } from "@/lib/types";

export default async function AccommodationsPage({ searchParams }: PageProps<"/hospedagens">) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const q = queryParam(params.q);
  const [result, admin, now] = await Promise.all([
    getPage<Accommodation>("/api/accommodations", page, 20, undefined, q),
    isAdmin(),
    today(),
  ]);

  return (
    <>
      <PageHeader
        title="Hospedagens"
        description="Alojamento das equipes, locado por mês e renovado conforme a necessidade. A obra é opcional."
        action={admin ? { href: "/hospedagens/novo", label: "Nova hospedagem" } : undefined}
      />
      <SearchField href="/hospedagens" initial={q} placeholder="Buscar por anfitrião, cidade ou OS da obra" />
      {q && result.totalElements === 0 ? (
        <SearchEmpty href="/hospedagens" query={q} />
      ) : (
        <>
          <DataTable
            rows={result.content}
            empty="Nenhuma hospedagem cadastrada."
            rowHref={(row) => `/hospedagens/${row.id}`}
            columns={[
              { header: "Anfitrião", cell: (a) => a.hostName },
              { header: "Obra", cell: (a) => (a.project ? <ProjectRef project={a.project} /> : "Sem obra") },
              { header: "Cidade", cell: (a) => `${a.address.city}/${a.address.state}` },
              { header: "Hóspedes", cell: (a) => <span className="font-mono font-medium">{a.employees.length}/{a.capacity}</span>, className: "text-right" },
              { header: "Locação", cell: (a) => <LeaseProgress periods={a.periods} today={now} compact className="min-w-40" /> },
              { header: "Término", cell: (a) => <span className="font-mono text-sm">{formatDate(a.endDate)}</span>, className: "whitespace-nowrap" },
              { header: "Total", cell: (a) => <span className="font-mono font-medium">{formatCurrency(a.totalPrice)}</span>, className: "whitespace-nowrap text-right" },
              { header: "Atualizada em", cell: (a) => <span className="font-mono text-xs">{formatDateTime(a.updatedAt)}</span>, className: "whitespace-nowrap" },
            ]}
          />
        </>
      )}
      <Pagination href="/hospedagens" query={q} page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

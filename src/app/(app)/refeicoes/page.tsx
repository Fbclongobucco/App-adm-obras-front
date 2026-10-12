import { DataTable } from "@/components/data-table";
import { ProjectRef } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam, queryParam } from "@/components/pagination";
import { SearchEmpty, SearchField } from "@/components/search-field";
import { getPage, isAdmin } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { MEAL_TYPES, type Meal } from "@/lib/types";

export default async function MealsPage({ searchParams }: PageProps<"/refeicoes">) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const q = queryParam(params.q);
  const [result, admin] = await Promise.all([getPage<Meal>("/api/meals", page, 20, undefined, q), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Refeições"
        description="Alimentação contratada por obra: custo por dia e total estimado em dias úteis até o término. Exige restaurante cadastrado."
        action={admin ? { href: "/refeicoes/novo", label: "Nova refeição" } : undefined}
      />
      <SearchField href="/refeicoes" initial={q} placeholder="Buscar por restaurante ou OS da obra" />
      {q && result.totalElements === 0 ? (
        <SearchEmpty href="/refeicoes" query={q} />
      ) : (
        <>
          <DataTable
            rows={result.content}
            empty="Nenhuma refeição lançada."
            rowHref={(row) => `/refeicoes/${row.id}`}
            columns={[
              { header: "Tipo", cell: (m) => MEAL_TYPES[m.mealType], className: "whitespace-nowrap" },
              { header: "Obra", cell: (m) => <ProjectRef project={m.project} /> },
              { header: "Restaurante", cell: (m) => m.restaurant.name },
              { header: "Custo/dia", cell: (m) => <span className="font-mono font-medium">{formatCurrency(m.dailyPrice)}</span>, className: "whitespace-nowrap text-right" },
              { header: "Dias úteis", cell: (m) => <span className="font-mono font-medium">{m.workingDays ?? "—"}</span>, className: "text-right" },
              { header: "Total estimado", cell: (m) => <span className="font-mono font-medium">{formatCurrency(m.totalPrice)}</span>, className: "whitespace-nowrap text-right" },
              { header: "Faturada", cell: (m) => (m.isBilled ? "Sim" : "Não") },
            ]}
          />
        </>
      )}
      <Pagination href="/refeicoes" query={q} page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

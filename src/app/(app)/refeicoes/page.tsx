import { DataTable } from "@/components/data-table";
import { ProjectRef } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam } from "@/components/pagination";
import { getPage, isAdmin } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { MEAL_TYPES, type Meal } from "@/lib/types";

export default async function MealsPage({ searchParams }: PageProps<"/refeicoes">) {
  const page = pageParam((await searchParams).page);
  const [result, admin] = await Promise.all([getPage<Meal>("/api/meals", page), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Refeições"
        description="Almoço e jantar por obra. Exigem restaurante cadastrado."
        action={admin ? { href: "/refeicoes/novo", label: "Nova refeição" } : undefined}
      />
      <DataTable
        rows={result.content}
        empty="Nenhuma refeição lançada."
        rowHref={(row) => `/refeicoes/${row.id}`}
        columns={[
          { header: "Tipo", cell: (m) => MEAL_TYPES[m.mealType] },
          { header: "Obra", cell: (m) => <ProjectRef project={m.project} /> },
          { header: "Restaurante", cell: (m) => m.restaurant.name },
          { header: "Data", cell: (m) => formatDate(m.date), className: "whitespace-nowrap" },
          { header: "Qtd.", cell: (m) => <span className="font-mono font-medium">{m.quantity}</span>, className: "text-right" },
          { header: "Preço unit.", cell: (m) => <span className="font-mono font-medium">{formatCurrency(m.price)}</span>, className: "whitespace-nowrap text-right" },
          { header: "Total", cell: (m) => <span className="font-mono font-medium">{formatCurrency(m.totalPrice)}</span>, className: "whitespace-nowrap text-right" },
          { header: "Faturada", cell: (m) => (m.isBilled ? "Sim" : "Não") },
        ]}
      />
      <Pagination href="/refeicoes" page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

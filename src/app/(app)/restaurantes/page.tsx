import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam, queryParam } from "@/components/pagination";
import { SearchEmpty, SearchField } from "@/components/search-field";
import { RestaurantCard } from "@/components/restaurant-card";
import { getPage, isAdmin } from "@/lib/api";
import type { Restaurant } from "@/lib/types";

export default async function RestaurantsPage({ searchParams }: PageProps<"/restaurantes">) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const q = queryParam(params.q);
  const [result, admin] = await Promise.all([getPage<Restaurant>("/api/restaurants", page, 20, undefined, q), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Restaurantes"
        description="Cada restaurante atende uma obra. Quantidades e valores por dia, semana, 15 dias e mês para o fechamento."
        action={admin ? { href: "/restaurantes/novo", label: "Novo restaurante" } : undefined}
      />
      <SearchField href="/restaurantes" initial={q} placeholder="Buscar por nome, OS da obra ou cidade" />
      {q && result.totalElements === 0 ? (
        <SearchEmpty href="/restaurantes" query={q} />
      ) : (
        <>
          {result.content.length === 0 ? (
            <p className="panel px-4 py-6 text-center text-sm text-body">Nenhum restaurante cadastrado.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(36rem,100%),1fr))] gap-4">
              {result.content.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
            </div>
          )}
        </>
      )}
      <Pagination href="/restaurantes" query={q} page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}

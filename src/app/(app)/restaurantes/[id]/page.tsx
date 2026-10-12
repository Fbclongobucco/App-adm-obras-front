import { DeleteButton } from "@/components/delete-button";
import { ProjectBanner } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { PeriodTable } from "@/components/period-table";
import { DeliveryFee, SodaPrice } from "@/components/restaurant-card";
import { WeeklyClosingSection } from "@/components/weekly-closing";
import { api, apiOrNotFound, isAdmin } from "@/lib/api";
import { MEAL_SERVES, MEAL_TYPES, type Restaurant, type WeeklyClosing } from "@/lib/types";
import { weekParam } from "@/lib/week";
import { deleteRestaurant } from "../actions";

/** Detalhe do restaurante: fechamentos. A edicao fica em /restaurantes/[id]/editar. */
export default async function RestaurantPage({ params, searchParams }: PageProps<"/restaurantes/[id]">) {
  const { id } = await params;
  const week = weekParam((await searchParams).semana);
  const [restaurant, admin, closing] = await Promise.all([
    apiOrNotFound<Restaurant>(`/api/restaurants/${id}`),
    isAdmin(),
    api<WeeklyClosing>(`/api/restaurants/${id}/weekly-closing${week ? `?week=${week}` : ""}`),
  ]);

  return (
    <>
      <PageHeader title={restaurant.name}
        description={<>Restaurante · Entrega: <DeliveryFee value={restaurant.deliveryFee} /> · <SodaPrice value={restaurant.sodaPrice} /></>}
        action={admin ? { href: `/restaurantes/${id}/editar`, label: "Editar" } : undefined}>
        {admin && <DeleteButton action={deleteRestaurant.bind(null, id)} label="este restaurante" />}
      </PageHeader>
      <ProjectBanner project={restaurant.project} label="Atende a obra" />
      <section aria-label="Fechamento por período" className="panel mb-6 max-w-3xl space-y-3 px-5 py-4">
        <h2 className="font-heading text-base font-semibold text-title">Fechamento por período</h2>
        {restaurant.meals.length === 0 ? (
          <p className="text-sm text-body">Nenhuma refeição cadastrada.</p>
        ) : (
          <PeriodTable projections={restaurant.meals.flatMap((meal) => meal.projections)} />
        )}
      </section>
      {restaurant.meals.length > 0 && (
        <WeeklyClosingSection closing={closing} href={`/restaurantes/${id}`} readOnly={!admin} scope={{
          kind: "restaurant",
          restaurantId: id,
          meals: restaurant.meals.map((meal) => ({
            id: meal.id, label: MEAL_TYPES[meal.mealType], ...MEAL_SERVES[meal.mealType],
            lunchQuantity: meal.lunchQuantity, dinnerQuantity: meal.dinnerQuantity,
          })),
        }} />
      )}
    </>
  );
}

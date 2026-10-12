import { DeleteButton } from "@/components/delete-button";
import { ProjectBanner } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { PeriodTable } from "@/components/period-table";
import { WeeklyClosingSection } from "@/components/weekly-closing";
import { api, apiOrNotFound, isAdmin } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { MEAL_SERVES, MEAL_TYPES, type Meal, type WeeklyClosing } from "@/lib/types";
import { weekParam } from "@/lib/week";
import { deleteMeal } from "../actions";
import { MealCost } from "../form";
import { MealAdjustments } from "./adjustments";

/** Detalhe da refeicao: custos, fechamentos e ajustes. A edicao fica em /refeicoes/[id]/editar. */
export default async function MealPage({ params, searchParams }: PageProps<"/refeicoes/[id]">) {
  const { id } = await params;
  const week = weekParam((await searchParams).semana);
  const [meal, admin, closing] = await Promise.all([
    apiOrNotFound<Meal>(`/api/meals/${id}`),
    isAdmin(),
    api<WeeklyClosing>(`/api/meals/${id}/weekly-closing${week ? `?week=${week}` : ""}`),
  ]);

  return (
    <>
      <PageHeader title={`${MEAL_TYPES[meal.mealType]} · OS ${meal.project.os}`} description={meal.restaurant.name}
        action={admin ? { href: `/refeicoes/${id}/editar`, label: "Editar" } : undefined}>
        <span className="font-mono text-sm text-title">{formatCurrency(meal.dailyPrice)}/dia</span>
        {admin && <DeleteButton action={deleteMeal.bind(null, id)} label="esta refeição" />}
      </PageHeader>
      <ProjectBanner project={meal.project} />
      <MealCost meal={meal} />
      <section aria-label="Fechamento por período" className="panel mb-6 max-w-3xl space-y-3 px-5 py-4">
        <h2 className="font-heading text-base font-semibold text-title">Fechamento por período</h2>
        <PeriodTable projections={meal.projections} />
      </section>
      <WeeklyClosingSection closing={closing} href={`/refeicoes/${id}`} readOnly={!admin} scope={{
        kind: "meal",
        meal: {
          id, label: MEAL_TYPES[meal.mealType], ...MEAL_SERVES[meal.mealType],
          lunchQuantity: meal.lunchQuantity, dinnerQuantity: meal.dinnerQuantity,
        },
      }} />
      <MealAdjustments meal={meal} readOnly={!admin} />
    </>
  );
}

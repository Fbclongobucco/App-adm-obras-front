import { DeleteButton } from "@/components/delete-button";
import { ProjectBanner } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { restaurantOptions } from "@/lib/options";
import { MEAL_TYPES, type Meal } from "@/lib/types";
import { deleteMeal, saveMeal } from "../actions";
import { MealForm } from "../form";

export default async function MealPage({ params }: PageProps<"/refeicoes/[id]">) {
  const { id } = await params;
  const [meal, admin, restaurants] = await Promise.all([
    apiOrNotFound<Meal>(`/api/meals/${id}`),
    isAdmin(),
    restaurantOptions(),
  ]);

  return (
    <>
      <PageHeader title={`${MEAL_TYPES[meal.mealType]} · OS ${meal.project.os}`} description={meal.restaurant.name}>
        <span className="font-mono text-sm text-title">{formatCurrency(meal.totalPrice)}</span>
        {admin && <DeleteButton action={deleteMeal.bind(null, id)} label="esta refeição" />}
      </PageHeader>
      <ProjectBanner project={meal.project} />
      <MealForm action={saveMeal.bind(null, id)} restaurants={restaurants} value={meal} readOnly={!admin} />
    </>
  );
}

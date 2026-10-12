import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { restaurantOptions } from "@/lib/options";
import { MEAL_TYPES, type Meal } from "@/lib/types";
import { saveMeal } from "../../actions";
import { MealForm } from "../../form";

/** Edicao da refeicao, so para administrador; operador volta para o detalhe. */
export default async function EditMealPage({ params }: PageProps<"/refeicoes/[id]/editar">) {
  const { id } = await params;
  const [meal, admin, restaurants] = await Promise.all([
    apiOrNotFound<Meal>(`/api/meals/${id}`),
    isAdmin(),
    restaurantOptions(),
  ]);
  if (!admin) redirect(`/refeicoes/${id}`);

  return (
    <>
      <PageHeader title={`Editar ${MEAL_TYPES[meal.mealType]} · OS ${meal.project.os}`} description={meal.restaurant.name} />
      <MealForm action={saveMeal.bind(null, id)} restaurants={restaurants} value={meal} />
    </>
  );
}

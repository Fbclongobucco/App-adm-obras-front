import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { restaurantOptions } from "@/lib/options";
import { saveMeal } from "../actions";
import { MealForm } from "../form";

export default async function NewMealPage() {
  const restaurants = await restaurantOptions();

  return (
    <>
      <PageHeader title="Nova refeição" />
      {restaurants.length === 0 ? (
        <Notice message="Toda refeição é servida por um restaurante vinculado a uma obra, e nenhum foi cadastrado."
          link={{ href: "/restaurantes/novo", label: "Cadastrar restaurante" }} />
      ) : (
        <MealForm action={saveMeal.bind(null, null)} restaurants={restaurants} />
      )}
    </>
  );
}

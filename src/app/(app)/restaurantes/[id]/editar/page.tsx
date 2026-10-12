import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { projectOptions } from "@/lib/options";
import type { Restaurant } from "@/lib/types";
import { saveRestaurant } from "../../actions";
import { RestaurantForm } from "../../form";

/** Edicao do restaurante, so para administrador; operador volta para o detalhe. */
export default async function EditRestaurantPage({ params }: PageProps<"/restaurantes/[id]/editar">) {
  const { id } = await params;
  const [restaurant, admin, projects] = await Promise.all([
    apiOrNotFound<Restaurant>(`/api/restaurants/${id}`),
    isAdmin(),
    projectOptions(),
  ]);
  if (!admin) redirect(`/restaurantes/${id}`);

  return (
    <>
      <PageHeader title={`Editar ${restaurant.name}`} description="Restaurante" />
      <RestaurantForm action={saveRestaurant.bind(null, id)} projects={projects} value={restaurant} />
    </>
  );
}

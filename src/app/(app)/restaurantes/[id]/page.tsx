import { DeleteButton } from "@/components/delete-button";
import { ProjectBanner } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { projectOptions } from "@/lib/options";
import type { Restaurant } from "@/lib/types";
import { deleteRestaurant, saveRestaurant } from "../actions";
import { RestaurantForm } from "../form";

export default async function RestaurantPage({ params }: PageProps<"/restaurantes/[id]">) {
  const { id } = await params;
  const [restaurant, admin, projects] = await Promise.all([
    apiOrNotFound<Restaurant>(`/api/restaurants/${id}`),
    isAdmin(),
    projectOptions(),
  ]);

  return (
    <>
      <PageHeader title={restaurant.name} description="Restaurante">
        {admin && <DeleteButton action={deleteRestaurant.bind(null, id)} label="este restaurante" />}
      </PageHeader>
      <ProjectBanner project={restaurant.project} label="Atende a obra" />
      <RestaurantForm action={saveRestaurant.bind(null, id)} projects={projects} value={restaurant}
        readOnly={!admin} />
    </>
  );
}

import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { projectOptions } from "@/lib/options";
import { saveRestaurant } from "../actions";
import { RestaurantForm } from "../form";

export default async function NewRestaurantPage({ searchParams }: PageProps<"/restaurantes/novo">) {
  const [{ obra }, projects] = await Promise.all([searchParams, projectOptions()]);

  return (
    <>
      <PageHeader title="Novo restaurante" />
      {projects.length === 0 ? (
        <Notice message="Todo restaurante pertence a uma obra, e nenhuma foi cadastrada."
          link={{ href: "/obras/novo", label: "Cadastrar obra" }} />
      ) : (
        <RestaurantForm action={saveRestaurant.bind(null, null)} projects={projects}
          projectId={typeof obra === "string" ? obra : undefined} />
      )}
    </>
  );
}

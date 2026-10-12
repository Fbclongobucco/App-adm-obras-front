import { PageHeader } from "@/components/page-header";
import { employeeOptions, projectOptions } from "@/lib/options";
import { saveAccommodation } from "../actions";
import { AccommodationForm } from "../form";

export default async function NewAccommodationPage({ searchParams }: PageProps<"/hospedagens/novo">) {
  const [{ obra }, projects, employees] = await Promise.all([searchParams, projectOptions(), employeeOptions()]);

  return (
    <>
      <PageHeader title="Nova hospedagem" />
      <AccommodationForm action={saveAccommodation.bind(null, null)} projects={projects} employees={employees}
        projectId={typeof obra === "string" ? obra : undefined} />
    </>
  );
}

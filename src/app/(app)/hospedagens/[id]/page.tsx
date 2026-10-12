import { DeleteButton } from "@/components/delete-button";
import { ProjectBanner } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { employeeOptions, projectOptions } from "@/lib/options";
import type { Accommodation } from "@/lib/types";
import { deleteAccommodation, saveAccommodation } from "../actions";
import { AccommodationForm } from "../form";

export default async function AccommodationPage({ params }: PageProps<"/hospedagens/[id]">) {
  const { id } = await params;
  const [accommodation, admin, projects, employees] = await Promise.all([
    apiOrNotFound<Accommodation>(`/api/accommodations/${id}`),
    isAdmin(),
    projectOptions(),
    employeeOptions(),
  ]);

  return (
    <>
      <PageHeader title={accommodation.hostName}
        description={accommodation.project ? `Hospedagem · OS ${accommodation.project.os}` : "Hospedagem sem obra"}>
        <span className="font-mono text-sm text-title">{formatCurrency(accommodation.totalPrice)}</span>
        {admin && <DeleteButton action={deleteAccommodation.bind(null, id)} label="esta hospedagem" />}
      </PageHeader>
      {accommodation.project && <ProjectBanner project={accommodation.project} />}
      <AccommodationForm action={saveAccommodation.bind(null, id)} projects={projects} employees={employees}
        value={accommodation} readOnly={!admin} />
    </>
  );
}

import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { employeeOptions, projectOptions } from "@/lib/options";
import type { Accommodation } from "@/lib/types";
import { saveAccommodation } from "../../actions";
import { AccommodationForm } from "../../form";

/** Edicao da hospedagem, so para administrador; operador volta para o detalhe. */
export default async function EditAccommodationPage({ params }: PageProps<"/hospedagens/[id]/editar">) {
  const { id } = await params;
  const [accommodation, admin, projects, employees] = await Promise.all([
    apiOrNotFound<Accommodation>(`/api/accommodations/${id}`),
    isAdmin(),
    projectOptions(),
    employeeOptions(),
  ]);
  if (!admin) redirect(`/hospedagens/${id}`);

  return (
    <>
      <PageHeader title={`Editar ${accommodation.hostName}`} description="Hospedagem" />
      <AccommodationForm action={saveAccommodation.bind(null, id)} projects={projects} employees={employees}
        value={accommodation} />
    </>
  );
}

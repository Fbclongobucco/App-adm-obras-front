import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { ProjectsTable } from "@/components/projects-table";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import type { Client } from "@/lib/types";
import { deleteClient, saveClient } from "../actions";
import { ClientForm } from "../form";

export default async function ClientPage({ params }: PageProps<"/clientes/[id]">) {
  const { id } = await params;
  const [client, admin] = await Promise.all([apiOrNotFound<Client>(`/api/clients/${id}`), isAdmin()]);

  return (
    <>
      <PageHeader title={client.name} description="Cliente">
        {admin && <DeleteButton action={deleteClient.bind(null, id)} label="este cliente" />}
      </PageHeader>
      <ClientForm action={saveClient.bind(null, id)} value={client} readOnly={!admin} />
      <ProjectsTable title="Obras do cliente" projects={client.projects} showClient={false} />
    </>
  );
}

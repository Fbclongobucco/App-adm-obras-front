import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { clientOptions, costCenterOptions, employeeOptions } from "@/lib/options";
import { saveProject } from "../actions";
import { ProjectForm } from "../form";

export default async function NewProjectPage() {
  const [clients, costCenters, employees] = await Promise.all([
    clientOptions(),
    costCenterOptions(),
    employeeOptions(),
  ]);

  return (
    <>
      <PageHeader title="Nova obra" />
      {clients.length === 0 ? (
        <Notice message="Toda obra pertence a um cliente, e nenhum foi cadastrado."
          link={{ href: "/clientes/novo", label: "Cadastrar cliente" }} />
      ) : costCenters.length === 0 ? (
        <Notice message="Toda obra pertence a um centro de custo, e nenhum foi cadastrado."
          link={{ href: "/centros-de-custo/novo", label: "Cadastrar centro de custo" }} />
      ) : (
        <ProjectForm action={saveProject.bind(null, null)} clients={clients} costCenters={costCenters}
          employees={employees} />
      )}
    </>
  );
}

import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { ProjectsTable } from "@/components/projects-table";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { costCenterOptions } from "@/lib/options";
import type { Employee } from "@/lib/types";
import { deleteEmployee, saveEmployee } from "../actions";
import { EmployeeForm } from "../form";

export default async function EmployeePage({ params }: PageProps<"/colaboradores/[id]">) {
  const { id } = await params;
  const [employee, admin, costCenters] = await Promise.all([
    apiOrNotFound<Employee>(`/api/employees/${id}`),
    isAdmin(),
    costCenterOptions(),
  ]);

  return (
    <>
      <PageHeader title={employee.name} description="Colaborador">
        {admin && <DeleteButton action={deleteEmployee.bind(null, id)} label="este colaborador" />}
      </PageHeader>
      <EmployeeForm action={saveEmployee.bind(null, id)} costCenters={costCenters} value={employee}
        readOnly={!admin} />
      <ProjectsTable title="Obras do colaborador" projects={employee.projects} />
    </>
  );
}

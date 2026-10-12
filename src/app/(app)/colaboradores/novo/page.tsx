import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { costCenterOptions } from "@/lib/options";
import { saveEmployee } from "../actions";
import { EmployeeForm } from "../form";

export default async function NewEmployeePage() {
  const costCenters = await costCenterOptions();

  return (
    <>
      <PageHeader title="Novo colaborador" />
      {costCenters.length === 0 ? (
        <Notice message="Todo colaborador pertence a um centro de custo, e nenhum foi cadastrado."
          link={{ href: "/centros-de-custo/novo", label: "Cadastrar centro de custo" }} />
      ) : (
        <EmployeeForm action={saveEmployee.bind(null, null)} costCenters={costCenters} />
      )}
    </>
  );
}

import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import type { CostCenter } from "@/lib/types";
import { deleteCostCenter, saveCostCenter } from "../actions";
import { CostCenterForm } from "../form";

export default async function CostCenterPage({ params }: PageProps<"/centros-de-custo/[id]">) {
  const { id } = await params;
  const [costCenter, admin] = await Promise.all([apiOrNotFound<CostCenter>(`/api/cost-centers/${id}`), isAdmin()]);

  return (
    <>
      <PageHeader title={costCenter.name} description="Centro de custo">
        {admin && <DeleteButton action={deleteCostCenter.bind(null, id)} label="este centro de custo" />}
      </PageHeader>
      <CostCenterForm action={saveCostCenter.bind(null, id)} value={costCenter} readOnly={!admin} />
    </>
  );
}

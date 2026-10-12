import { PageHeader } from "@/components/page-header";
import { saveCostCenter } from "../actions";
import { CostCenterForm } from "../form";

export default function NewCostCenterPage() {
  return (
    <>
      <PageHeader title="Novo centro de custo" />
      <CostCenterForm action={saveCostCenter.bind(null, null)} />
    </>
  );
}

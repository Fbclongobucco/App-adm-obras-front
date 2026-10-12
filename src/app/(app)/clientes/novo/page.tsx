import { PageHeader } from "@/components/page-header";
import { saveClient } from "../actions";
import { ClientForm } from "../form";

export default function NewClientPage() {
  return (
    <>
      <PageHeader title="Novo cliente" />
      <ClientForm action={saveClient.bind(null, null)} />
    </>
  );
}

import { PageHeader } from "@/components/page-header";
import { saveUser } from "../actions";
import { UserForm } from "../form";

export default function NewUserPage() {
  return (
    <>
      <PageHeader title="Novo usuário" />
      <UserForm action={saveUser.bind(null, null)} />
    </>
  );
}

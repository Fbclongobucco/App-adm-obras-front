import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import type { User } from "@/lib/types";
import { deleteUser, saveUser } from "../actions";
import { UserForm } from "../form";

export default async function UserPage({ params }: PageProps<"/usuarios/[id]">) {
  const { id } = await params;
  const [user, admin] = await Promise.all([apiOrNotFound<User>(`/api/users/${id}`), isAdmin()]);

  return (
    <>
      <PageHeader title={user.name} description="Usuário">
        {admin && <DeleteButton action={deleteUser.bind(null, id)} label="este usuário" />}
      </PageHeader>
      <UserForm action={saveUser.bind(null, id)} value={user} readOnly={!admin} />
    </>
  );
}

"use client";

import { CheckboxField, FieldGroup, TextField } from "@/components/form/fields";
import { MultiSelect } from "@/components/form/multi-select";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import { USER_ROLES, type User } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  value?: User;
  readOnly?: boolean;
};

const roles = Object.entries(USER_ROLES).map(([value, label]) => ({ value, label }));

export function UserForm({ action, value, readOnly }: Props) {
  return (
    <ResourceForm action={action} cancelHref="/usuarios" readOnly={readOnly}>
      <FieldGroup title="Dados do usuário">
        <TextField label="Nome" name="name" defaultValue={value?.name} required minLength={3} maxLength={100}
          className="sm:col-span-2" />
        <TextField label="E-mail" name="email" type="email" defaultValue={value?.email} required />
        <TextField label="Senha" name="password" type="password" autoComplete="new-password" minLength={6}
          required={!value} hint={value ? "Deixe em branco para manter a senha atual." : "Mínimo de 6 caracteres."} />
        <CheckboxField label="Ativo" name="isActive" defaultChecked={value?.isActive ?? true} />
      </FieldGroup>
      <FieldGroup title="Acesso">
        <MultiSelect label="Perfis" name="roles" options={roles} defaultValues={value?.roles ?? ["OPERADOR"]}
          searchable={false} emptyText="" noneSelectedText="Nenhum perfil atribuído." />
        <p className="text-xs text-body sm:col-span-2">
          Administrador cria, altera e exclui registros. Operador apenas consulta.
        </p>
      </FieldGroup>
    </ResourceForm>
  );
}

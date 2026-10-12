"use client";

import { AddressFields, FieldGroup, TextField } from "@/components/form/fields";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import { formatPhone } from "@/lib/format";
import type { Client } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  value?: Client;
  readOnly?: boolean;
};

export function ClientForm({ action, value, readOnly }: Props) {
  return (
    <ResourceForm action={action} cancelHref="/clientes" readOnly={readOnly}>
      <FieldGroup title="Dados do cliente">
        <TextField label="Nome" name="name" defaultValue={value?.name} required minLength={3} maxLength={100}
          className="sm:col-span-2" />
        <TextField label="E-mail" name="email" type="email" defaultValue={value?.email} required />
        <TextField label="Telefone" name="phone" defaultValue={value ? formatPhone(value.phone) : undefined}
          required inputMode="tel" placeholder="(00) 00000-0000" />
      </FieldGroup>
      <FieldGroup title="Endereço">
        <AddressFields value={value?.address} required />
      </FieldGroup>
    </ResourceForm>
  );
}

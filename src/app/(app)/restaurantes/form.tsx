"use client";

import { AddressFields, FieldGroup, SelectField, TextField, type Option } from "@/components/form/fields";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import { formatPhone } from "@/lib/format";
import type { Restaurant } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  projects: Option[];
  value?: Restaurant;
  projectId?: string;
  readOnly?: boolean;
};

export function RestaurantForm({ action, projects, value, projectId, readOnly }: Props) {
  return (
    <ResourceForm action={action} cancelHref="/restaurantes" readOnly={readOnly}>
      <FieldGroup title="Dados do restaurante">
        <SelectField label="Obra" name="projectId" options={projects} defaultValue={value?.project.id ?? projectId}
          required className="sm:col-span-2" hint="Com refeições lançadas, o restaurante não pode mudar de obra." />
        <TextField label="Nome" name="name" defaultValue={value?.name} required minLength={2} maxLength={100} />
        <TextField label="Telefone" name="phone" defaultValue={value?.phone ? formatPhone(value.phone) : undefined}
          inputMode="tel" placeholder="(00) 00000-0000" />
      </FieldGroup>
      <FieldGroup title="Endereço (opcional)">
        <AddressFields value={value?.address} />
      </FieldGroup>
    </ResourceForm>
  );
}

"use client";

import { AddressFields, FieldGroup, SelectField, TextField, type Option } from "@/components/form/fields";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import { formatCpf, formatPhone } from "@/lib/format";
import { EMPLOYEE_ROLES, type Employee } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  costCenters: Option[];
  value?: Employee;
  readOnly?: boolean;
};

const roles = Object.entries(EMPLOYEE_ROLES).map(([value, label]) => ({ value, label }));

export function EmployeeForm({ action, costCenters, value, readOnly }: Props) {
  return (
    <ResourceForm action={action} cancelHref="/colaboradores" readOnly={readOnly}>
      <FieldGroup title="Dados do colaborador">
        <TextField label="Nome" name="name" defaultValue={value?.name} required minLength={3} maxLength={100}
          className="sm:col-span-2" />
        <TextField label="CPF" name="cpf" defaultValue={value ? formatCpf(value.cpf) : undefined} required
          inputMode="numeric" placeholder="000.000.000-00" />
        <TextField label="Data de nascimento" name="birthDate" type="date" defaultValue={value?.birthDate} required />
        <TextField label="E-mail" name="email" type="email" defaultValue={value?.email ?? undefined} />
        <TextField label="Telefone" name="phone" defaultValue={value?.phone ? formatPhone(value.phone) : undefined}
          inputMode="tel" placeholder="(00) 00000-0000" />
        <SelectField label="Função" name="role" options={roles} defaultValue={value?.role} required />
        <SelectField label="Centro de custo" name="costCenterId" options={costCenters}
          defaultValue={value?.costCenter.id} required />
      </FieldGroup>
      <FieldGroup title="Endereço (opcional)">
        <AddressFields value={value?.address} />
      </FieldGroup>
    </ResourceForm>
  );
}

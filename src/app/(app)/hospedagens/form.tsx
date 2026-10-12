"use client";

import { AddressFields, CheckboxField, FieldGroup, SelectField, TextField, type Option } from "@/components/form/fields";
import { MultiCheck } from "@/components/form/multi-check";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import { formatPhone } from "@/lib/format";
import type { Accommodation } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  projects: Option[];
  employees: Option[];
  value?: Accommodation;
  projectId?: string;
  readOnly?: boolean;
};

export function AccommodationForm({ action, projects, employees, value, projectId, readOnly }: Props) {
  return (
    <ResourceForm action={action} cancelHref="/hospedagens" readOnly={readOnly}>
      <FieldGroup title="Dados da hospedagem">
        <SelectField label="Obra" name="projectId" options={projects} placeholder="Sem obra"
          defaultValue={value?.project?.id ?? projectId} className="sm:col-span-2"
          hint="O valor total da hospedagem entra no total da obra." />
        <TextField label="Anfitrião" name="hostName" defaultValue={value?.hostName} required minLength={3}
          maxLength={100} />
        <TextField label="Telefone do anfitrião" name="hostPhone" required inputMode="tel"
          defaultValue={value ? formatPhone(value.hostPhone) : undefined} placeholder="(00) 00000-0000" />
        <TextField label="Capacidade (pessoas)" name="capacity" type="number" min={1} max={1000} step={1}
          defaultValue={value?.capacity} required />
        <TextField label="Diárias" name="days" type="number" min={1} max={365} step={1}
          defaultValue={value?.days} required />
        <TextField label="Valor total (R$)" name="totalPrice" inputMode="decimal" placeholder="0,00" required
          defaultValue={value ? value.totalPrice.toFixed(2).replace(".", ",") : undefined} />
        <CheckboxField label="Com contrato" name="isContract" defaultChecked={value?.isContract} />
      </FieldGroup>
      <FieldGroup title="Endereço">
        <AddressFields value={value?.address} required />
      </FieldGroup>
      <FieldGroup title="Hóspedes">
        <MultiCheck label="Colaboradores" name="employeeIds" options={employees}
          defaultValues={value?.employees.map((e) => e.id)} emptyText="Nenhum colaborador cadastrado."
          noneSelectedText="Nenhum hóspede vinculado." />
      </FieldGroup>
    </ResourceForm>
  );
}

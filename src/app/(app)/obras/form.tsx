"use client";

import { CheckboxField, FieldGroup, SelectField, TextField, type Option } from "@/components/form/fields";
import { MultiCheck } from "@/components/form/multi-check";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import type { Project } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  clients: Option[];
  costCenters: Option[];
  employees: Option[];
  value?: Project;
  readOnly?: boolean;
};

export function ProjectForm({ action, clients, costCenters, employees, value, readOnly }: Props) {
  return (
    <ResourceForm action={action} cancelHref="/obras" readOnly={readOnly}>
      <FieldGroup title="Dados da obra">
        <TextField label="OS" name="os" defaultValue={value?.os} required minLength={3} maxLength={30}
          pattern="[A-Za-z0-9._/\-]+" hint="Letras, números e . _ / -" />
        <div />
        <TextField label="Descrição" name="description" defaultValue={value?.description ?? undefined}
          minLength={3} maxLength={500} className="sm:col-span-2" />
        <SelectField label="Cliente" name="clientId" options={clients} defaultValue={value?.client.id} required />
        <SelectField label="Centro de custo" name="costCenterId" options={costCenters}
          defaultValue={value?.costCenter.id} required />
        <TextField label="Início" name="startDate" type="date" defaultValue={value?.startDate} required />
        <TextField label="Término" name="endDate" type="date" defaultValue={value?.endDate ?? undefined} />
        <CheckboxField label="Obra concluída" name="isCompleted" defaultChecked={value?.isCompleted} />
      </FieldGroup>
      <FieldGroup title="Equipe">
        <MultiCheck label="Colaboradores" name="employeeIds" options={employees}
          defaultValues={value?.employees.map((e) => e.id)} emptyText="Nenhum colaborador cadastrado."
          noneSelectedText="Nenhum colaborador na equipe desta obra." />
      </FieldGroup>
    </ResourceForm>
  );
}

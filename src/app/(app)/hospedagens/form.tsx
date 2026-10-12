"use client";

import { AddressFields, CheckboxField, FieldGroup, SelectField, TextField, type Option } from "@/components/form/fields";
import { MultiSelect } from "@/components/form/multi-select";
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
  const renewed = (value?.periods.length ?? 0) > 1;
  return (
    <ResourceForm action={action} cancelHref="/hospedagens" readOnly={readOnly}>
      <FieldGroup title="Dados da hospedagem">
        <SelectField label="Obra" name="projectId" options={projects} placeholder="Sem obra"
          defaultValue={value?.project?.id ?? projectId} className="sm:col-span-2"
          hint="O total da locação (soma dos períodos) entra no total da obra." />
        <TextField label="Anfitrião" name="hostName" defaultValue={value?.hostName} required minLength={3}
          maxLength={100} />
        <TextField label="Telefone do anfitrião" name="hostPhone" required inputMode="tel"
          defaultValue={value ? formatPhone(value.hostPhone) : undefined} placeholder="(00) 00000-0000" />
        <TextField label="Capacidade (pessoas)" name="capacity" type="number" min={1} max={1000} step={1}
          defaultValue={value?.capacity} required />
        {renewed ? (
          <>
            {/* Campo desabilitado nao e enviado: a entrada atual vai oculta e a API a mantem */}
            <input type="hidden" name="startDate" value={value?.startDate} />
            <TextField label="Data de entrada" name="startDateLocked" type="date" defaultValue={value?.startDate}
              disabled hint="Desfaça as renovações para alterar a entrada." />
          </>
        ) : (
          <TextField label="Data de entrada" name="startDate" type="date" defaultValue={value?.startDate} required
            hint="O 1º período vai até a véspera do mesmo dia no mês seguinte." />
        )}
        <TextField label="Valor por mês (R$)" name="monthlyPrice" inputMode="decimal" placeholder="0,00" required
          defaultValue={value ? value.monthlyPrice.toFixed(2).replace(".", ",") : undefined}
          hint={renewed ? "Vale como sugestão das próximas renovações." : undefined} />
        <CheckboxField label="Com contrato" name="isContract" defaultChecked={value?.isContract} />
      </FieldGroup>
      <FieldGroup title="Endereço">
        <AddressFields value={value?.address} required />
      </FieldGroup>
      <FieldGroup title="Hóspedes">
        <MultiSelect label="Colaboradores" name="employeeIds" options={employees}
          defaultValues={value?.employees.map((e) => e.id)} emptyText="Nenhum colaborador cadastrado."
          noResultsText="Nenhum colaborador encontrado."
          noneSelectedText="Nenhum hóspede vinculado." />
      </FieldGroup>
    </ResourceForm>
  );
}

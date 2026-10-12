"use client";

import { FieldGroup, TextField } from "@/components/form/fields";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import { formatCnpj } from "@/lib/format";
import type { CostCenter } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  value?: CostCenter;
  readOnly?: boolean;
};

export function CostCenterForm({ action, value, readOnly }: Props) {
  return (
    <ResourceForm action={action} cancelHref="/centros-de-custo" readOnly={readOnly}>
      <FieldGroup title="Dados do centro de custo">
        <TextField label="Nome" name="name" defaultValue={value?.name} required minLength={3} maxLength={100}
          className="sm:col-span-2" />
        <TextField label="CNPJ" name="cnpj" defaultValue={value ? formatCnpj(value.cnpj) : undefined} required
          inputMode="numeric" placeholder="00.000.000/0000-00" />
      </FieldGroup>
    </ResourceForm>
  );
}

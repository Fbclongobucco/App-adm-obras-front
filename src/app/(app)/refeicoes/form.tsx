"use client";

import { CheckboxField, FieldGroup, SelectField, TextField, type Option } from "@/components/form/fields";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import { MEAL_TYPES, type Meal } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  restaurants: Option[];
  value?: Meal;
  readOnly?: boolean;
};

const mealTypes = Object.entries(MEAL_TYPES).map(([value, label]) => ({ value, label }));

export function MealForm({ action, restaurants, value, readOnly }: Props) {
  return (
    <ResourceForm action={action} cancelHref="/refeicoes" readOnly={readOnly}>
      <FieldGroup title="Dados da refeição">
        <SelectField label="Restaurante" name="restaurantId" options={restaurants}
          defaultValue={value?.restaurant.id} required className="sm:col-span-2"
          hint="A refeição pertence à obra do restaurante. Cada obra tem no máximo um almoço e um jantar." />
        <SelectField label="Tipo" name="mealType" options={mealTypes} defaultValue={value?.mealType} required />
        <TextField label="Data" name="date" type="date" defaultValue={value?.date} required />
        <TextField label="Quantidade" name="quantity" type="number" min={1} max={10000} step={1}
          defaultValue={value?.quantity} required />
        <TextField label="Preço unitário (R$)" name="price" inputMode="decimal" placeholder="0,00" required
          defaultValue={value ? value.price.toFixed(2).replace(".", ",") : undefined} />
        <CheckboxField label="Faturada" name="isBilled" defaultChecked={value?.isBilled} />
      </FieldGroup>
    </ResourceForm>
  );
}

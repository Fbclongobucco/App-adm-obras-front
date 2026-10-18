"use client";

import { useState } from "react";
import { CheckboxField, FieldGroup, SelectField, TextField, type Option } from "@/components/form/fields";
import { ResourceForm } from "@/components/form/resource-form";
import type { FormState } from "@/lib/form";
import { formatCurrency } from "@/lib/format";
import { MEAL_SERVES, MEAL_TYPES, type Meal, type MealType } from "@/lib/types";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  restaurants: Option[];
  value?: Meal;
  readOnly?: boolean;
};

const mealTypes = Object.entries(MEAL_TYPES).map(([value, label]) => ({ value, label }));

function price(value: number | null | undefined) {
  return value == null ? undefined : value.toFixed(2).replace(".", ",");
}

/** Quantidade e preco por dia de uma refeicao servida (prefixo "lunch" ou "dinner"). */
function ServedMeal({ prefix, title, quantity, unitPrice }: {
  prefix: "lunch" | "dinner";
  title: string;
  quantity?: number | null;
  unitPrice?: number | null;
}) {
  return (
    <FieldGroup title={title}>
      <TextField label="Quantidade por dia" name={`${prefix}Quantity`} type="number" min={1} max={10000} step={1}
        defaultValue={quantity ?? undefined} required />
      <TextField label="Preço unitário (R$)" name={`${prefix}Price`} inputMode="decimal" placeholder="0,00"
        defaultValue={price(unitPrice)} required />
    </FieldGroup>
  );
}

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

/** Custo calculado pela API: marmitas + entrega + refrigerante, e o total ate o termino da obra. */
export function MealCost({ meal }: { meal: Meal }) {
  const serves = MEAL_SERVES[meal.mealType];
  const charged = (serves.lunch && meal.restaurant.lunchDeliveryFee != null)
    || (serves.dinner && meal.restaurant.dinnerDeliveryFee != null);
  const parts = [
    { label: "Marmitas", value: formatCurrency(meal.mealsDailyPrice) },
    {
      label: `Entrega (${plural(meal.deliveriesPerDay, "entrega", "entregas")})`,
      value: charged ? formatCurrency(meal.deliveryDailyPrice) : "Sem taxa",
    },
    {
      label: meal.sodaPrice == null
        ? "Refrigerante"
        : `Refrigerante (${plural(meal.deliveriesPerDay, "unidade", "unidades")}, do restaurante)`,
      value: meal.sodaPrice == null ? "Restaurante não fornece" : formatCurrency(meal.sodaDailyPrice),
    },
    { label: "Custo por dia", value: formatCurrency(meal.dailyPrice), strong: true },
  ];
  const totals = [
    { label: "Dias úteis (seg–sex)", value: meal.workingDays ?? "—" },
    { label: "Sem fornecimento", value: meal.noServiceDays },
    { label: "Dias de fornecimento", value: meal.serviceDays ?? "—" },
    { label: "Dias alterados", value: meal.changedDays },
    {
      label: `Dias extras (${meal.extraDays})`,
      value: meal.extraDays === 0 ? "—" : formatCurrency(meal.extraDaysPrice),
    },
    { label: "Total estimado", value: meal.totalPrice == null ? "—" : formatCurrency(meal.totalPrice) },
  ];
  return (
    <section aria-label="Custo da refeição" className="panel mb-6 max-w-3xl space-y-4 px-5 py-4">
      <dl className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-4">
        {parts.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-body">{item.label}</dt>
            <dd className={`mt-1 font-mono text-lg text-title ${item.strong ? "font-semibold" : "font-medium"}`}>{item.value}</dd>
          </div>
        ))}
      </dl>
      <dl className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-4 border-t border-line/30 pt-4">
        {totals.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-body">{item.label}</dt>
            <dd className="mt-1 font-mono text-xl font-medium text-title">{item.value}</dd>
          </div>
        ))}
      </dl>
      {meal.totalPrice == null && (
        <p className="text-sm text-body">O total depende da data de término da obra.</p>
      )}
    </section>
  );
}

export function MealForm({ action, restaurants, value, readOnly }: Props) {
  const [mealType, setMealType] = useState<MealType | "">(value?.mealType ?? "");
  const serves = mealType ? MEAL_SERVES[mealType] : { lunch: false, dinner: false };

  return (
    <ResourceForm action={action} cancelHref="/refeicoes" readOnly={readOnly}>
      <FieldGroup title="Dados da refeição">
        <SelectField label="Restaurante" name="restaurantId" options={restaurants}
          defaultValue={value?.restaurant.id} required className="sm:col-span-2"
          hint="A refeição pertence à obra do restaurante. Cada obra tem no máximo um almoço e um jantar." />
        <SelectField label="Tipo" name="mealType" options={mealTypes} value={mealType} required
          onChange={(event) => setMealType(event.target.value as MealType | "")} />
        <div className="flex items-end pb-2">
          <CheckboxField label="Faturada" name="isBilled" defaultChecked={value?.isBilled} />
        </div>
      </FieldGroup>
      {serves.lunch && (
        <ServedMeal prefix="lunch" title="Almoço" quantity={value?.lunchQuantity} unitPrice={value?.lunchPrice} />
      )}
      {serves.dinner && (
        <ServedMeal prefix="dinner" title="Jantar" quantity={value?.dinnerQuantity} unitPrice={value?.dinnerPrice} />
      )}
    </ResourceForm>
  );
}

"use client";

import { startTransition, useActionState, useState, useTransition, type FormEvent } from "react";
import { TextField } from "@/components/form/fields";
import { formatCurrency, formatDate } from "@/lib/format";
import { ADJUSTMENT_TYPES, MEAL_SERVES, type AdjustmentType, type Meal } from "@/lib/types";
import { addAdjustment, removeAdjustment, type AdjustmentState } from "./adjustment-actions";

function RemoveButton({ mealId, adjustmentId, label }: { mealId: string; adjustmentId: string; label: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  return (
    <>
      <button
        type="button"
        disabled={pending}
        aria-label={`Remover ajuste de ${label}`}
        onClick={() =>
          start(async () => {
            const result = await removeAdjustment(mealId, adjustmentId);
            setError(result?.error);
          })
        }
        className="rounded px-2 py-1 text-sm font-medium text-accent hover:bg-accent/5 disabled:opacity-60"
      >
        {pending ? "Removendo..." : "Remover"}
      </button>
      {error && <span role="alert" className="block text-xs text-accent">{error}</span>}
    </>
  );
}

/** Dia alterado e editado no fechamento semanal, com os numeros do dia. */
const INCLUDED_TYPES: AdjustmentType[] = ["EXTRA_DAY", "NO_SERVICE"];

function AdjustmentForm({ meal }: { meal: Meal }) {
  const [state, formAction, pending] = useActionState<AdjustmentState, FormData>(
    addAdjustment.bind(null, meal.id),
    undefined,
  );
  const [type, setType] = useState<AdjustmentType>("EXTRA_DAY");
  const serves = MEAL_SERVES[meal.mealType];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form key={state?.done ?? 0} onSubmit={onSubmit} className="space-y-4 border-t border-line/40 pt-4">
      <fieldset disabled={pending} className="space-y-4">
        <legend className="font-heading text-sm font-semibold uppercase tracking-wide text-highlight">
          Incluir ajuste
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2" role="radiogroup" aria-label="Tipo de ajuste">
          {INCLUDED_TYPES.map((value) => (
            <label key={value} className="flex items-center gap-2 text-sm text-title">
              <input type="radio" name="type" value={value} checked={type === value}
                onChange={() => setType(value)} className="size-4 accent-highlight" />
              {ADJUSTMENT_TYPES[value]}
              <span className="text-xs text-body">
                {value === "EXTRA_DAY" ? "(sábado ou domingo)" : "(dia útil)"}
              </span>
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Data" name="date" type="date" required
            hint={`Período da obra: ${formatDate(meal.project.startDate)} a ${formatDate(meal.project.endDate)}`} />
          <TextField label="Observação" name="note" maxLength={100} placeholder="Ex.: Feriado de N. Sra. Aparecida" />
          {type === "EXTRA_DAY" && serves.lunch && (
            <TextField label="Almoços no dia" name="lunchQuantity" type="number" min={0} max={10000} step={1}
              defaultValue={meal.lunchQuantity ?? undefined} />
          )}
          {type === "EXTRA_DAY" && serves.dinner && (
            <TextField label="Jantares no dia" name="dinnerQuantity" type="number" min={0} max={10000} step={1}
              defaultValue={meal.dinnerQuantity ?? undefined} />
          )}
        </div>
        <p className="text-xs text-body">
          Feriado em dia útil já entra no cálculo. Marque “Sem fornecimento” quando o restaurante não fornecer.
        </p>
      </fieldset>
      {state?.error && (
        <p role="alert" className="rounded border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}
        className="rounded bg-highlight px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
        {pending ? "Incluindo..." : "Incluir ajuste"}
      </button>
    </form>
  );
}

/**
 * Dias extras, dias alterados e dias sem fornecimento da refeicao. So administrador inclui e remove; o dia
 * alterado e gravado pelo fechamento semanal.
 */
export function MealAdjustments({ meal, readOnly }: { meal: Meal; readOnly?: boolean }) {
  const serves = MEAL_SERVES[meal.mealType];
  return (
    <section aria-label="Ajustes por data" className="panel mb-6 max-w-3xl space-y-4 px-5 py-4">
      <h2 className="font-heading text-base font-semibold text-title">Ajustes por data</h2>
      {meal.adjustments.length === 0 ? (
        <p className="text-sm text-body">Nenhum ajuste. Todos os dias úteis do período contam como fornecimento.</p>
      ) : (
        <div className="relative overflow-x-auto rounded border border-line/50">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-line/60 bg-surface text-xs uppercase tracking-wide text-title">
              <tr>
                <th className="px-3 py-2 font-semibold">Data</th>
                <th className="px-3 py-2 font-semibold">Tipo</th>
                {serves.lunch && <th className="px-3 py-2 text-right font-semibold">Almoços</th>}
                {serves.dinner && <th className="px-3 py-2 text-right font-semibold">Jantares</th>}
                <th className="px-3 py-2 text-right font-semibold">Entregas</th>
                <th className="px-3 py-2 text-right font-semibold">Refrig.</th>
                <th className="px-3 py-2 text-right font-semibold">Valor</th>
                <th className="px-3 py-2 font-semibold">Observação</th>
                {!readOnly && <th className="w-px px-3 py-2"><span className="sr-only">Ações</span></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/30">
              {meal.adjustments.map((adjustment) => {
                const numbers = adjustment.type !== "NO_SERVICE";
                const deliveries = serves.lunch && serves.dinner
                  ? `${adjustment.lunchDeliveries} + ${adjustment.dinnerDeliveries}`
                  : String(adjustment.deliveries);
                return (
                  <tr key={adjustment.id} className={adjustment.inPeriod ? "" : "text-body opacity-60"}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="font-mono">{formatDate(adjustment.date)}</span>
                      <span className="block text-xs text-body">{adjustment.weekday}</span>
                      {!adjustment.inPeriod && <span className="block text-xs text-accent">fora do período</span>}
                    </td>
                    <td className="px-3 py-2">{ADJUSTMENT_TYPES[adjustment.type]}</td>
                    {serves.lunch && <td className="px-3 py-2 text-right font-mono">{numbers ? adjustment.lunchQuantity ?? 0 : "—"}</td>}
                    {serves.dinner && <td className="px-3 py-2 text-right font-mono">{numbers ? adjustment.dinnerQuantity ?? 0 : "—"}</td>}
                    <td className="px-3 py-2 text-right font-mono whitespace-nowrap"
                      title={serves.lunch && serves.dinner ? "Almoço + jantar" : undefined}>
                      {numbers ? deliveries : "—"}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">{numbers ? adjustment.sodas : "—"}</td>
                    <td className="px-3 py-2 text-right font-mono whitespace-nowrap">
                      {adjustment.type === "EXTRA_DAY" ? `+ ${formatCurrency(adjustment.price)}`
                        : adjustment.type === "CHANGED" ? formatCurrency(adjustment.price) : "− 1 dia"}
                    </td>
                    <td className="px-3 py-2 text-body">{adjustment.note ?? "—"}</td>
                    {!readOnly && (
                      <td className="px-3 py-2 text-right">
                        <RemoveButton mealId={meal.id} adjustmentId={adjustment.id} label={formatDate(adjustment.date)} />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!readOnly && <AdjustmentForm meal={meal} />}
    </section>
  );
}

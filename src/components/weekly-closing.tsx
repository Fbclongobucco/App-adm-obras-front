"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { addAdjustment, removeAdjustment } from "@/app/(app)/refeicoes/[id]/adjustment-actions";
import { addRestaurantAdjustment, removeRestaurantAdjustments } from "@/app/(app)/restaurantes/[id]/closing-actions";
import { TextField } from "@/components/form/fields";
import { formatCurrency, formatDate } from "@/lib/format";
import { DAY_STATUS, WEEKDAYS, type ClosingWeek, type DayClosing, type WeeklyClosing } from "@/lib/types";

/** Refeicao editavel no fechamento: rotulo e refeicoes servidas para o formulario de dia extra. */
export type ClosingMeal = {
  id: string;
  label: string;
  lunch: boolean;
  dinner: boolean;
  lunchQuantity: number | null;
  dinnerQuantity: number | null;
};

/** Na refeicao, a edicao vale so para ela; no restaurante, para todas as refeicoes dele. */
export type ClosingScope = { kind: "meal"; meal: ClosingMeal } | { kind: "restaurant"; restaurantId: string; meals: ClosingMeal[] };

const quantity = new Intl.NumberFormat("pt-BR");

function weekLabel(week: ClosingWeek): string {
  const marks = [week.partial && "parcial", week.current && "atual"].filter(Boolean).join(", ");
  return `${formatDate(week.start).slice(0, 5)} a ${formatDate(week.end)}${marks ? ` (${marks})` : ""}`;
}

function WeekSelect({ weeks, selected, href }: { weeks: ClosingWeek[]; selected: string; href: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <label className="flex min-w-0 max-w-full items-center gap-2 text-sm font-medium text-title">
      Semana
      <select
        value={selected}
        disabled={pending}
        onChange={(event) => start(() => router.replace(`${href}?semana=${event.target.value}`, { scroll: false }))}
        className="min-w-0 flex-1 rounded border border-line/60 bg-white px-3 py-1.5 font-mono text-sm text-title outline-none focus:border-highlight focus:ring-1 focus:ring-highlight/30 disabled:opacity-60"
      >
        {weeks.map((week) => (
          <option key={week.start} value={week.start}>{weekLabel(week)}</option>
        ))}
      </select>
      {pending && <span className="text-xs font-normal text-body">Carregando...</span>}
    </label>
  );
}

const isWeekend = (day: DayClosing) => day.weekday === "SATURDAY" || day.weekday === "SUNDAY";

function statusLabel(day: DayClosing): string {
  return day.partialNoService ? "Sem fornecimento (parcial)" : DAY_STATUS[day.status];
}

function statusClass(day: DayClosing): string {
  if (day.status === "NO_SERVICE" || day.partialNoService) return "text-accent";
  if (day.status === "EXTRA_DAY") return "font-semibold text-highlight";
  return "text-body";
}

type Editing = { date: string; kind: "holiday" | "extra" } | null;

/** Formulario inline do feriado (observacao) ou do dia extra (quantidades por refeicao e observacao). */
function DayForm({ day, kind, scope, onDone }: {
  day: DayClosing; kind: "holiday" | "extra"; scope: ClosingScope; onDone: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  const meals = scope.kind === "meal" ? [scope.meal] : scope.meals;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const note = (form.get("note") as string | null)?.trim() || null;
    const type = kind === "holiday" ? "NO_SERVICE" : "EXTRA_DAY";
    const value = (name: string) => (form.has(name) ? Number(form.get(name) || 0) : null);
    start(async () => {
      let result: { error?: string } | undefined;
      if (scope.kind === "meal") {
        const data = new FormData();
        data.set("date", day.date);
        data.set("type", type);
        if (note) data.set("note", note);
        if (kind === "extra") {
          if (scope.meal.lunch) data.set("lunchQuantity", String(value(`lunch-${scope.meal.id}`) ?? 0));
          if (scope.meal.dinner) data.set("dinnerQuantity", String(value(`dinner-${scope.meal.id}`) ?? 0));
        }
        result = await addAdjustment(scope.meal.id, undefined, data);
      } else {
        result = await addRestaurantAdjustment(scope.restaurantId, {
          date: day.date, type, note,
          quantities: kind === "extra"
            ? meals.map((meal) => ({
              mealId: meal.id, lunchQuantity: value(`lunch-${meal.id}`), dinnerQuantity: value(`dinner-${meal.id}`),
            }))
            : [],
        });
      }
      if (result?.error) setError(result.error);
      else onDone();
    });
  }

  const title = kind === "holiday"
    ? `Feriado em ${formatDate(day.date)}: sem fornecimento${scope.kind === "restaurant" ? " em todas as refeições" : ""}`
    : `Dia extra em ${formatDate(day.date)}`;
  return (
    <form onSubmit={submit} className="space-y-3 bg-surface/60 px-3 py-3 text-left">
      <fieldset disabled={pending} className="space-y-3">
        <legend className="text-sm font-semibold text-title">{title}</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kind === "extra" && meals.flatMap((meal) => [
            meal.lunch && (
              <TextField key={`lunch-${meal.id}`} label={meals.length > 1 ? `Almoços · ${meal.label}` : "Almoços no dia"}
                name={`lunch-${meal.id}`} type="number" min={0} max={10000} step={1}
                defaultValue={meal.lunchQuantity ?? 0} />
            ),
            meal.dinner && (
              <TextField key={`dinner-${meal.id}`} label={meals.length > 1 ? `Jantares · ${meal.label}` : "Jantares no dia"}
                name={`dinner-${meal.id}`} type="number" min={0} max={10000} step={1}
                defaultValue={meal.dinnerQuantity ?? 0} />
            ),
          ])}
          <TextField label="Observação" name="note" maxLength={100}
            placeholder={kind === "holiday" ? "Ex.: Feriado de N. Sra. Aparecida" : "Ex.: Sábado trabalhado"} />
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="rounded border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent">{error}</p>
      )}
      <div className="flex gap-2">
        <button type="submit" disabled={pending}
          className="rounded bg-highlight px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
          {pending ? "Salvando..." : "Confirmar"}
        </button>
        <button type="button" onClick={onDone} disabled={pending}
          className="rounded border border-line/60 px-4 py-1.5 text-sm font-medium text-title hover:bg-white">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function DayActions({ day, scope, onEdit }: { day: DayClosing; scope: ClosingScope; onEdit: (editing: Editing) => void }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  if (day.status === "OUT_OF_PERIOD") return null;

  function remove() {
    start(async () => {
      const result = scope.kind === "meal"
        ? await removeAdjustment(scope.meal.id, day.adjustmentIds[0])
        : await removeRestaurantAdjustments(scope.restaurantId, day.date);
      setError(result?.error);
    });
  }

  const button = "rounded px-2 py-1 text-sm font-medium text-accent hover:bg-accent/5 disabled:opacity-60 whitespace-nowrap";
  const removable = day.status === "NO_SERVICE" || day.status === "EXTRA_DAY" || day.partialNoService;
  return (
    <>
      {removable ? (
        <button type="button" disabled={pending} onClick={remove} className={button}
          aria-label={`${day.status === "EXTRA_DAY" ? "Remover dia extra" : "Desmarcar feriado"} de ${formatDate(day.date)}`}>
          {pending ? "Removendo..." : day.status === "EXTRA_DAY" ? "Remover" : "Desmarcar"}
        </button>
      ) : isWeekend(day) ? (
        <button type="button" className={button} onClick={() => onEdit({ date: day.date, kind: "extra" })}
          aria-label={`Incluir dia extra em ${formatDate(day.date)}`}>
          Dia extra
        </button>
      ) : (
        <button type="button" className={button} onClick={() => onEdit({ date: day.date, kind: "holiday" })}
          aria-label={`Marcar feriado em ${formatDate(day.date)}`}>
          Feriado
        </button>
      )}
      {error && <span role="alert" className="block text-xs text-accent">{error}</span>}
    </>
  );
}

const counts = (day: { lunchMeals: number; dinnerMeals: number; deliveries: number; sodas: number }) =>
  [
    [day.lunchMeals, "almoço", "almoços"],
    [day.dinnerMeals, "jantar", "jantares"],
    [day.deliveries, "entrega", "entregas"],
    [day.sodas, "refrigerante", "refrigerantes"],
  ]
    .map(([value, one, many]) => `${quantity.format(value as number)} ${value === 1 ? one : many}`)
    .join(" · ");

function dayLabel(day: DayClosing) {
  return (
    <>
      <span className="font-medium text-title">{WEEKDAYS[day.weekday] ?? day.weekday}</span>{" "}
      <span className="font-mono text-body">{formatDate(day.date).slice(0, 5)}</span>
    </>
  );
}

/**
 * Fechamento semanal (segunda a domingo) calculado pela API: dropdown das semanas da obra, dia a dia, totais
 * e exportacao da semana em planilha. Administrador marca feriado em dia util e dia extra no fim de semana
 * na propria linha do dia. Tabela em telas largas e lista em telas estreitas, sem rolagem horizontal.
 */
export function WeeklyClosingSection({ closing, scope, href, readOnly }: {
  closing: WeeklyClosing; scope: ClosingScope; href: string; readOnly?: boolean;
}) {
  const [editing, setEditing] = useState<Editing>(null);
  const columns = readOnly ? 7 : 8;
  const { totals } = closing;
  const form = (day: DayClosing) =>
    !readOnly && editing?.date === day.date
      ? <DayForm day={day} kind={editing.kind} scope={scope} onDone={() => setEditing(null)} />
      : null;
  const muted = (day: DayClosing) => day.status === "OFF" || day.status === "OUT_OF_PERIOD";
  const serviceDays = `${totals.serviceDays} ${totals.serviceDays === 1 ? "dia de fornecimento" : "dias de fornecimento"}`;

  return (
    <section aria-label="Fechamento semanal" className="panel mb-6 space-y-3 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-base font-semibold text-title">Fechamento semanal</h2>
        {closing.selected && (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">
            <WeekSelect weeks={closing.weeks} selected={closing.selected} href={href} />
            <a href={`${href}/fechamento?semana=${closing.selected}`} download
              className="rounded border border-highlight/40 px-3 py-1.5 text-sm font-semibold text-highlight hover:bg-highlight/5">
              Exportar planilha
            </a>
          </div>
        )}
      </div>
      {!closing.selected ? (
        <p className="text-sm text-body">A obra não tem semanas de fechamento.</p>
      ) : (
        <>
          <table className="hidden w-full text-right text-sm lg:table">
            <thead className="border-b border-line/60 bg-surface text-xs uppercase tracking-wide text-title">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Dia</th>
                <th className="px-3 py-2 text-left font-semibold">Situação</th>
                <th className="px-3 py-2 font-semibold">Almoços</th>
                <th className="px-3 py-2 font-semibold">Jantares</th>
                <th className="px-3 py-2 font-semibold">Entregas</th>
                <th className="px-3 py-2 font-semibold">Refrigerantes</th>
                <th className="px-3 py-2 font-semibold">Valor</th>
                {!readOnly && <th className="px-3 py-2 font-semibold">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/30">
              {closing.days.flatMap((day) => {
                const rows = [
                  <tr key={day.date} className={muted(day) ? "text-body opacity-60" : ""}>
                    <td className="px-3 py-1.5 text-left whitespace-nowrap">{dayLabel(day)}</td>
                    <td className={`px-3 py-1.5 text-left ${statusClass(day)}`}>{statusLabel(day)}</td>
                    <td className="px-3 py-1.5 font-mono text-title">{quantity.format(day.lunchMeals)}</td>
                    <td className="px-3 py-1.5 font-mono text-title">{quantity.format(day.dinnerMeals)}</td>
                    <td className="px-3 py-1.5 font-mono text-title">{quantity.format(day.deliveries)}</td>
                    <td className="px-3 py-1.5 font-mono text-title">{quantity.format(day.sodas)}</td>
                    <td className="px-3 py-1.5 font-mono whitespace-nowrap text-title">{formatCurrency(day.price)}</td>
                    {!readOnly && (
                      <td className="px-3 py-1.5 text-right">
                        <DayActions day={day} scope={scope} onEdit={setEditing} />
                      </td>
                    )}
                  </tr>,
                ];
                const inline = form(day);
                if (inline) {
                  rows.push(<tr key={`${day.date}-form`}><td colSpan={columns} className="p-0">{inline}</td></tr>);
                }
                return rows;
              })}
              <tr className="bg-surface/60 font-semibold text-title">
                <th scope="row" className="px-3 py-2 text-left">Semana</th>
                <td className="px-3 py-2 text-left font-normal text-body">{serviceDays}</td>
                <td className="px-3 py-2 font-mono">{quantity.format(totals.lunchMeals)}</td>
                <td className="px-3 py-2 font-mono">{quantity.format(totals.dinnerMeals)}</td>
                <td className="px-3 py-2 font-mono">{quantity.format(totals.deliveries)}</td>
                <td className="px-3 py-2 font-mono">{quantity.format(totals.sodas)}</td>
                <td className="px-3 py-2 font-mono whitespace-nowrap">{formatCurrency(totals.price)}</td>
                {!readOnly && <td />}
              </tr>
            </tbody>
          </table>
          <ul className="divide-y divide-line/30 border-y border-line/50 lg:hidden">
            {closing.days.map((day) => (
              <li key={day.date} className={`space-y-1 py-2 ${muted(day) ? "text-body opacity-60" : ""}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span>{dayLabel(day)}</span>
                  <span className="font-mono font-semibold text-title">{formatCurrency(day.price)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 text-sm">
                  <span className={statusClass(day)}>{statusLabel(day)}</span>
                  {!readOnly && <span><DayActions day={day} scope={scope} onEdit={setEditing} /></span>}
                </div>
                {!muted(day) && <p className="font-mono text-xs text-body">{counts(day)}</p>}
                {form(day)}
              </li>
            ))}
            <li className="space-y-1 bg-surface/60 px-2 py-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 font-semibold text-title">
                <span>Semana · <span className="font-normal text-body">{serviceDays}</span></span>
                <span className="font-mono">{formatCurrency(totals.price)}</span>
              </div>
              <p className="font-mono text-xs text-body">{counts(totals)}</p>
            </li>
          </ul>
        </>
      )}
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { addAdjustment, putDay, removeAdjustment } from "@/app/(app)/refeicoes/[id]/adjustment-actions";
import {
  addRestaurantAdjustment, putRestaurantDay, removeRestaurantAdjustments,
} from "@/app/(app)/restaurantes/[id]/closing-actions";
import { TextField } from "@/components/form/fields";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  DAY_STATUS, WEEKDAYS, type ClosingWeek, type DayClosing, type MealDay, type WeeklyClosing,
} from "@/lib/types";

/** Refeicao editavel no fechamento: rotulo, refeicoes servidas, padrao e se o restaurante fornece refrigerante. */
export type ClosingMeal = {
  id: string;
  label: string;
  lunch: boolean;
  dinner: boolean;
  lunchQuantity: number | null;
  dinnerQuantity: number | null;
  soda: boolean;
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
  if (day.status === "EXTRA_DAY" || day.status === "CHANGED") return "font-semibold text-highlight";
  return "text-body";
}

type Editing = { date: string; kind: "holiday" | "day" } | null;

/** Dia ajustado (dia extra ou alterado): entregas e refrigerantes abrem com os numeros efetivos. */
const isAdjusted = (status: string) => status === "EXTRA_DAY" || status === "CHANGED";

/** Numeros iniciais de uma refeicao no formulario: os do dia, ou o padrao quando o dia nao fornece. */
function initialNumbers(meal: ClosingMeal, day: DayClosing, scope: ClosingScope) {
  const numbers: Pick<MealDay, "status" | "lunchMeals" | "dinnerMeals" | "lunchDeliveries" | "dinnerDeliveries" | "sodas">
    | undefined = scope.kind === "meal" ? day : day.meals.find((item) => item.mealId === meal.id);
  const serving = numbers && (numbers.status === "SERVICE" || isAdjusted(numbers.status));
  const lunch = serving ? numbers.lunchMeals : meal.lunchQuantity ?? 0;
  const dinner = serving ? numbers.dinnerMeals : meal.dinnerQuantity ?? 0;
  if (!numbers || !isAdjusted(numbers.status)) {
    return { lunch, dinner, lunchDeliveries: undefined, dinnerDeliveries: undefined, sodas: undefined };
  }
  // Entregas e refrigerantes so vem preenchidos quando diferem do padrao: vazio continua seguindo as
  // quantidades (1 entrega por refeicao com marmitas; 1 refrigerante por entrega)
  const lunchDeliveries = lunch > 0 ? 1 : 0;
  const dinnerDeliveries = dinner > 0 ? 1 : 0;
  const differs = (value: number, standard: number) => (value === standard ? undefined : value);
  return {
    lunch,
    dinner,
    lunchDeliveries: differs(numbers.lunchDeliveries, lunchDeliveries),
    dinnerDeliveries: differs(numbers.dinnerDeliveries, dinnerDeliveries),
    sodas: meal.soda ? differs(numbers.sodas, numbers.lunchDeliveries + numbers.dinnerDeliveries) : undefined,
  };
}

function MealDayFields({ meal, day, scope, labelled }: {
  meal: ClosingMeal; day: DayClosing; scope: ClosingScope; labelled: boolean;
}) {
  const initial = initialNumbers(meal, day, scope);
  const field = (label: string) => (labelled ? `${label} · ${meal.label}` : label);
  const count = { type: "number", min: 0, step: 1 } as const;
  return (
    <>
      {meal.lunch && (
        <TextField key={`lunch-${meal.id}`} label={field("Almoços")} name={`lunch-${meal.id}`} {...count}
          max={10000} defaultValue={initial.lunch} required />
      )}
      {meal.dinner && (
        <TextField key={`dinner-${meal.id}`} label={field("Jantares")} name={`dinner-${meal.id}`} {...count}
          max={10000} defaultValue={initial.dinner} required />
      )}
      {meal.lunch && (
        <TextField key={`lunchDeliveries-${meal.id}`} label={field("Entregas do almoço")}
          name={`lunchDeliveries-${meal.id}`} {...count} max={100} placeholder="Padrão: 1"
          defaultValue={initial.lunchDeliveries} />
      )}
      {meal.dinner && (
        <TextField key={`dinnerDeliveries-${meal.id}`} label={field("Entregas do jantar")}
          name={`dinnerDeliveries-${meal.id}`} {...count} max={100} placeholder="Padrão: 1"
          defaultValue={initial.dinnerDeliveries} />
      )}
      {meal.soda && (
        <TextField key={`sodas-${meal.id}`} label={field("Refrigerantes")} name={`sodas-${meal.id}`} {...count}
          max={10000} placeholder="Padrão: 1 por entrega" defaultValue={initial.sodas} />
      )}
    </>
  );
}

/**
 * Formulario inline do feriado (observacao) ou do dia: almocos, jantares, entregas do almoco e do jantar e
 * refrigerantes de cada refeicao, mais a observacao. Em dia util grava o dia alterado; no fim de semana, o dia
 * extra. Entregas e refrigerantes vazios usam o padrao.
 */
function DayForm({ day, kind, scope, onDone }: {
  day: DayClosing; kind: "holiday" | "day"; scope: ClosingScope; onDone: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  const meals = scope.kind === "meal" ? [scope.meal] : scope.meals;
  const weekend = isWeekend(day);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const note = (form.get("note") as string | null)?.trim() || null;
    const value = (name: string) => {
      const raw = (form.get(name) as string | null)?.trim();
      return raw ? Number(raw) : null;
    };
    const numbers = (meal: ClosingMeal) => ({
      lunchQuantity: meal.lunch ? value(`lunch-${meal.id}`) ?? 0 : null,
      dinnerQuantity: meal.dinner ? value(`dinner-${meal.id}`) ?? 0 : null,
      lunchDeliveries: meal.lunch ? value(`lunchDeliveries-${meal.id}`) : null,
      dinnerDeliveries: meal.dinner ? value(`dinnerDeliveries-${meal.id}`) : null,
      sodas: meal.soda ? value(`sodas-${meal.id}`) : null,
    });
    const type = weekend ? "EXTRA_DAY" : "CHANGED";
    start(async () => {
      let result: { error?: string } | undefined;
      if (kind === "holiday") {
        if (scope.kind === "meal") {
          const data = new FormData();
          data.set("date", day.date);
          data.set("type", "NO_SERVICE");
          if (note) data.set("note", note);
          result = await addAdjustment(scope.meal.id, undefined, data);
        } else {
          result = await addRestaurantAdjustment(scope.restaurantId, {
            date: day.date, type: "NO_SERVICE", note, quantities: [],
          });
        }
      } else if (scope.kind === "meal") {
        result = await putDay(scope.meal.id, day.date, { type, note, ...numbers(scope.meal) });
      } else {
        result = await putRestaurantDay(scope.restaurantId, day.date, {
          type, note, meals: meals.map((meal) => ({ mealId: meal.id, ...numbers(meal) })),
        });
      }
      if (result?.error) setError(result.error);
      else onDone();
    });
  }

  const title = kind === "holiday"
    ? `Feriado em ${formatDate(day.date)}: sem fornecimento${scope.kind === "restaurant" ? " em todas as refeições" : ""}`
    : `${weekend ? "Dia extra" : "Fornecimento"} em ${formatDate(day.date)}`;
  return (
    <form onSubmit={submit} className="space-y-3 bg-surface/60 px-3 py-3 text-left">
      <fieldset disabled={pending} className="space-y-3">
        <legend className="text-sm font-semibold text-title">{title}</legend>
        {kind === "day" && (
          <p className="text-xs text-body">
            Entregas e refrigerantes vazios usam o padrão: 1 entrega por refeição com marmitas e 1 refrigerante
            por entrega.{scope.kind === "restaurant" && !weekend && " Refeição zerada fica sem fornecimento no dia."}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kind === "day" && meals.map((meal) => (
            <MealDayFields key={meal.id} meal={meal} day={day} scope={scope} labelled={meals.length > 1} />
          ))}
          <TextField label="Observação" name="note" maxLength={100} defaultValue={day.note ?? undefined}
            placeholder={kind === "holiday" ? "Ex.: Feriado de N. Sra. Aparecida"
              : weekend ? "Ex.: Sábado trabalhado" : "Ex.: Uma equipe a menos no jantar"} />
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

/**
 * Acoes da linha do dia (administrador): fornecimento -> Editar e Feriado; dia alterado -> Editar e Restaurar
 * padrao; dia extra -> Editar e Remover; fim de semana sem ajuste -> Dia extra; sem fornecimento -> Desmarcar.
 */
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
  const date = formatDate(day.date);
  const edit = (kind: "holiday" | "day", label: string, aria: string) => (
    <button type="button" className={button} onClick={() => onEdit({ date: day.date, kind })} aria-label={`${aria} ${date}`}>
      {label}
    </button>
  );
  const removeButton = (label: string, aria: string) => (
    <button type="button" disabled={pending} onClick={remove} className={button} aria-label={`${aria} ${date}`}
      title={scope.kind === "restaurant" ? "Remove os ajustes da data em todas as refeições do restaurante" : undefined}>
      {pending ? "Removendo..." : label}
    </button>
  );
  const restorable = day.status === "CHANGED" || day.partialNoService;
  return (
    <>
      <span className="inline-flex flex-wrap justify-end gap-1">
        {day.status === "NO_SERVICE" && removeButton("Desmarcar", "Desmarcar feriado de")}
        {day.status === "OFF" && edit("day", "Dia extra", "Incluir dia extra em")}
        {day.status === "EXTRA_DAY" && edit("day", "Editar", "Editar dia extra de")}
        {day.status === "EXTRA_DAY" && removeButton("Remover", "Remover dia extra de")}
        {(day.status === "SERVICE" || day.status === "CHANGED") && edit("day", "Editar", "Editar fornecimento de")}
        {day.status === "SERVICE" && !day.partialNoService && edit("holiday", "Feriado", "Marcar feriado em")}
        {restorable && removeButton("Restaurar padrão", "Restaurar padrão de")}
      </span>
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

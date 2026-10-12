"use client";

import { useActionState, useState, useTransition } from "react";
import { TextField } from "@/components/form/fields";
import { formatDate } from "@/lib/format";
import type { FormState } from "@/lib/form";
import type { Accommodation } from "@/lib/types";
import { renewAccommodation, undoRenewal } from "../actions";

const money = (value: number) => value.toFixed(2).replace(".", ",");

/** Renovacao com data final e valor sugeridos (+1 mes, valor mensal), editaveis. */
export function RenewalForm({ accommodation }: { accommodation: Accommodation }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    renewAccommodation.bind(null, accommodation.id),
    undefined,
  );
  const next = accommodation.nextRenewal;
  return (
    // key: depois de renovar, a sugestao muda e o formulario volta com os novos valores
    <form key={next.startDate} action={formAction} className="space-y-3 border-t border-line/40 pt-4">
      <fieldset disabled={pending} className="space-y-3">
        <legend className="font-heading text-sm font-semibold uppercase tracking-wide text-highlight">Renovar</legend>
        <p className="text-sm text-body">
          Novo período a partir de <span className="font-mono text-title">{formatDate(next.startDate)}</span>.
          A sugestão é de um mês pelo valor mensal; ajuste a data final e o valor se precisar.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Até" name="endDate" type="date" required defaultValue={next.endDate} min={next.startDate} />
          <TextField label="Valor (R$)" name="price" inputMode="decimal" required defaultValue={money(next.price)}
            placeholder="0,00" />
        </div>
      </fieldset>
      {state?.error && (
        <p role="alert" className="rounded border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}
        className="rounded bg-highlight px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">
        {pending ? "Renovando..." : "Renovar"}
      </button>
    </form>
  );
}

export function UndoRenewalButton({ id, period }: { id: string; period: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  return (
    <span>
      <button type="button" disabled={pending}
        onClick={() => {
          if (!window.confirm(`Desfazer a renovação de ${period}?`)) return;
          start(async () => setError((await undoRenewal(id))?.error));
        }}
        className="rounded px-2 py-1 text-sm font-medium text-accent hover:bg-accent/5 disabled:opacity-60">
        {pending ? "Desfazendo..." : "Desfazer última renovação"}
      </button>
      {error && <span role="alert" className="block text-xs text-accent">{error}</span>}
    </span>
  );
}

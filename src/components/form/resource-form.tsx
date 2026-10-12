"use client";

import Link from "next/link";
import { startTransition, useActionState, type FormEvent, type ReactNode } from "react";
import type { FormState } from "@/lib/form";

type ResourceFormProps = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  cancelHref: string;
  submitLabel?: string;
  readOnly?: boolean;
  children: ReactNode;
};

/**
 * Formulario de cadastro. O envio passa por startTransition em vez de <form action>,
 * para o React nao limpar os campos quando a API recusa os dados.
 */
export function ResourceForm({ action, cancelHref, submitLabel = "Salvar", readOnly, children }: ResourceFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6 rounded border border-line/30 bg-white p-5 sm:p-6">
      <fieldset disabled={readOnly || pending} className="space-y-6">
        {children}
      </fieldset>

      {state?.error && (
        <p role="alert" className="rounded border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-line/50 pt-5">
        {!readOnly && (
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-highlight px-5 py-2 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60"
          >
            {pending ? "Salvando..." : submitLabel}
          </button>
        )}
        <Link href={cancelHref} className="text-sm font-medium text-body hover:text-title">
          {readOnly ? "Voltar" : "Cancelar"}
        </Link>
      </div>
    </form>
  );
}

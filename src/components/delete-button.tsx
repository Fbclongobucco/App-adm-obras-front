"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/form";

type DeleteButtonProps = {
  action: (state: FormState) => Promise<FormState>;
  label: string;
};

export function DeleteButton({ action, label }: DeleteButtonProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="space-y-2">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (!window.confirm(`Excluir ${label}? Esta ação não pode ser desfeita.`)) event.preventDefault();
        }}
      >
        <button
          type="submit"
          disabled={pending}
          className="rounded border border-accent/40 px-3 py-1.5 text-sm text-accent hover:bg-accent/5 disabled:opacity-60"
        >
          {pending ? "Excluindo..." : "Excluir"}
        </button>
      </form>
      {state?.error && (
        <p role="alert" className="max-w-md text-sm text-accent">
          {state.error}
        </p>
      )}
    </div>
  );
}

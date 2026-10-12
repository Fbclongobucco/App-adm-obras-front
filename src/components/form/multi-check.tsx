"use client";

import { useState } from "react";
import type { Option } from "@/components/form/fields";

type MultiCheckProps = {
  label: string;
  name: string;
  options: Option[];
  defaultValues?: string[];
  /** Mensagem quando nao ha opcoes cadastradas. */
  emptyText: string;
  /** Mensagem quando nada esta selecionado. */
  noneSelectedText?: string;
};

/** Rotulo "Nome · detalhe" exibido em duas partes. */
function OptionLabel({ label }: { label: string }) {
  const [main, ...rest] = label.split(" · ");
  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span className="font-medium text-title">{main}</span>
      {rest.length > 0 && <span className="text-sm text-body">{rest.join(" · ")}</span>}
    </span>
  );
}

/**
 * Mostra os itens vinculados; o botao "Editar" abre a lista com caixas de selecao.
 * Os valores vao no formulario como varios campos com o mesmo nome.
 */
export function MultiCheck({
  label,
  name,
  options,
  defaultValues = [],
  emptyText,
  noneSelectedText = "Nenhum item vinculado.",
}: MultiCheckProps) {
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(() => new Set(defaultValues));
  const chosen = options.filter((option) => selected.has(option.value));
  const visible = options.filter((option) => option.label.toLowerCase().includes(filter.toLowerCase()));

  function toggle(value: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-title">
          {label} <span className="font-mono text-xs font-normal text-body">({selected.size})</span>
        </span>
        {options.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setEditing((value) => !value);
              setFilter("");
            }}
            className="rounded border border-line/60 px-3 py-1 text-sm font-medium text-title hover:border-title disabled:hidden"
          >
            {editing ? "Concluir" : "Editar"}
          </button>
        )}
      </div>

      {options.length === 0 ? (
        <p className="text-sm text-body">{emptyText}</p>
      ) : editing ? (
        <>
          {options.length > 8 && (
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Filtrar"
              className="w-full rounded border border-line/60 bg-white px-3 py-1.5 text-sm outline-none focus:border-title"
            />
          )}
          <ul className="max-h-72 divide-y divide-line/20 overflow-y-auto rounded border border-line/60 bg-white">
            {visible.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-surface">
                  <input
                    type="checkbox"
                    checked={selected.has(option.value)}
                    onChange={() => toggle(option.value)}
                    className="size-4 accent-highlight"
                  />
                  <OptionLabel label={option.label} />
                </label>
              </li>
            ))}
          </ul>
        </>
      ) : chosen.length === 0 ? (
        <p className="rounded border border-dashed border-line/60 px-3 py-3 text-sm text-body">{noneSelectedText}</p>
      ) : (
        <ul className="divide-y divide-line/20 rounded border border-line/30 bg-white">
          {chosen.map((option) => (
            <li key={option.value} className="px-3 py-2">
              <OptionLabel label={option.label} />
            </li>
          ))}
        </ul>
      )}

      {[...selected].map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
    </div>
  );
}

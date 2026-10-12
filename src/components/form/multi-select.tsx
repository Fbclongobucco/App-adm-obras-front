"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { Option } from "@/components/form/fields";

type MultiSelectProps = {
  label: string;
  name: string;
  options: Option[];
  defaultValues?: string[];
  /** Mensagem quando nao ha opcoes cadastradas. */
  emptyText: string;
  /** Mensagem quando nada esta selecionado. */
  noneSelectedText?: string;
  /** Campo de busca no topo da lista. */
  searchable?: boolean;
  noResultsText?: string;
};

/** Parte principal do rotulo "Nome · detalhe". */
function mainLabel(label: string) {
  return label.split(" · ")[0];
}

/** Minusculas e sem acentos, para a busca encontrar "José" ao digitar "jose". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/** Rotulo "Nome · detalhe" exibido em duas partes. */
function OptionLabel({ label }: { label: string }) {
  const [main, ...rest] = label.split(" · ");
  return (
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
      <span className="font-medium text-title">{main}</span>
      {rest.length > 0 && <span className="text-sm text-body">{rest.join(" · ")}</span>}
    </span>
  );
}

/**
 * Lista suspensa de selecao multipla com busca por nome. Os escolhidos aparecem abaixo, removiveis.
 * Os valores vao no formulario como varios campos com o mesmo nome.
 * Em formulario somente leitura o <fieldset disabled> desabilita o gatilho e a remocao.
 */
export function MultiSelect({
  label,
  name,
  options,
  defaultValues = [],
  emptyText,
  noneSelectedText = "Nenhum item selecionado.",
  searchable = true,
  noResultsText = "Nenhum item encontrado.",
}: MultiSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const [selected, setSelected] = useState(() => new Set(defaultValues));
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const listbox = useRef<HTMLUListElement>(null);

  const chosen = options.filter((option) => selected.has(option.value));
  const visible = options.filter((option) => normalize(mainLabel(option.label)).includes(normalize(query)));

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (searchable) search.current?.focus();
    else listbox.current?.focus();
  }, [open, searchable]);

  useEffect(() => {
    if (active >= 0) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, id]);

  function openList() {
    setQuery("");
    setActive(-1);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function toggle(value: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function onPanelKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && visible.length > 0) {
      event.preventDefault();
      setActive(0);
      listbox.current?.focus();
    } else if (event.key === "Enter") {
      // Enter na busca nao envia o formulario
      event.preventDefault();
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, visible.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (active <= 0 && searchable) {
        setActive(-1);
        search.current?.focus();
      } else {
        setActive((index) => Math.max(index - 1, 0));
      }
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (visible[active]) toggle(visible[active].value);
    }
  }

  return (
    <div
      ref={container}
      className="space-y-2 sm:col-span-2"
      onBlur={(event) => {
        if (open && !container.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <span id={`${id}-label`} className="block text-sm font-medium text-title">
        {label} <span className="font-mono text-xs font-normal text-body">({selected.size})</span>
      </span>

      {options.length === 0 ? (
        <p className="text-sm text-body">{emptyText}</p>
      ) : (
        <div className="relative">
          <button
            ref={trigger}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${id}-listbox`}
            aria-labelledby={`${id}-label ${id}-summary`}
            onClick={() => (open ? setOpen(false) : openList())}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" && !open) {
                event.preventDefault();
                openList();
              }
            }}
            className="flex w-full items-center justify-between gap-3 rounded border border-line/60 bg-white px-3 py-2 text-left text-[0.9375rem] text-title outline-none hover:border-title focus-visible:border-highlight focus-visible:ring-1 focus-visible:ring-highlight/30 disabled:cursor-default disabled:bg-surface disabled:hover:border-line/60"
          >
            <span id={`${id}-summary`} className={selected.size > 0 ? "" : "text-body"}>
              {selected.size > 0 ? `${selected.size} selecionado(s)` : "Selecione"}
            </span>
            <svg viewBox="0 0 24 24" className={`size-4 shrink-0 text-body transition-transform ${open ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div tabIndex={-1} className="panel absolute inset-x-0 top-full z-20 mt-1 overflow-hidden shadow-md outline-none"
              onKeyDown={onPanelKeyDown}>
              {searchable && (
                <div className="border-b border-line/40 p-2">
                  <input
                    ref={search}
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setActive(-1);
                    }}
                    onKeyDown={onSearchKeyDown}
                    placeholder="Buscar por nome"
                    aria-label={`Buscar ${label.toLowerCase()} por nome`}
                    aria-controls={`${id}-listbox`}
                    className="w-full rounded border border-line/60 bg-white px-3 py-1.5 text-sm outline-none focus:border-highlight focus:ring-1 focus:ring-highlight/30"
                  />
                </div>
              )}
              {visible.length === 0 ? (
                <p className="px-3 py-3 text-sm text-body">{noResultsText}</p>
              ) : (
                <ul
                  ref={listbox}
                  id={`${id}-listbox`}
                  role="listbox"
                  aria-multiselectable="true"
                  aria-labelledby={`${id}-label`}
                  aria-activedescendant={active >= 0 ? `${id}-option-${active}` : undefined}
                  tabIndex={0}
                  onKeyDown={onListKeyDown}
                  className="max-h-72 divide-y divide-line/20 overflow-y-auto outline-none"
                >
                  {visible.map((option, index) => {
                    const checked = selected.has(option.value);
                    return (
                      <li
                        key={option.value}
                        id={`${id}-option-${index}`}
                        role="option"
                        aria-selected={checked}
                        onClick={() => {
                          setActive(index);
                          toggle(option.value);
                        }}
                        onMouseEnter={() => setActive(index)}
                        className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${index === active ? "bg-surface" : ""}`}
                      >
                        <span
                          aria-hidden
                          className={`flex size-4 shrink-0 items-center justify-center rounded-sm border ${
                            checked ? "border-highlight bg-highlight text-white" : "border-line bg-white"
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3}
                              strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12l5 5 9-10" />
                            </svg>
                          )}
                        </span>
                        <OptionLabel label={option.label} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {options.length > 0 &&
        (chosen.length === 0 ? (
          <p className="rounded border border-dashed border-line/60 px-3 py-3 text-sm text-body">{noneSelectedText}</p>
        ) : (
          <ul className="divide-y divide-line/30 rounded border border-line/50 bg-white">
            {chosen.map((option) => (
              <li key={option.value} className="flex items-center justify-between gap-3 px-3 py-2">
                <OptionLabel label={option.label} />
                <button
                  type="button"
                  onClick={() => toggle(option.value)}
                  aria-label={`Remover ${mainLabel(option.label)}`}
                  className="rounded p-1 text-body hover:bg-surface hover:text-accent disabled:hidden"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}
                    strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ))}

      {[...selected].map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const DELAY_MS = 300;

/**
 * Busca da listagem: aplica o termo na URL (?q=) apos uma pausa na digitacao e volta para a
 * primeira pagina. O termo inicial vem da pagina (searchParams), sem useSearchParams.
 */
export function SearchField({ href, initial, placeholder }: { href: string; initial: string; placeholder: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  // Ultimo termo enviado para a URL e ultimo termo recebido dela
  const [applied, setApplied] = useState(initial);
  const [synced, setSynced] = useState(initial);
  const [pending, startTransition] = useTransition();

  // Mudanca externa da URL (link "Limpar busca", voltar do navegador): o campo acompanha.
  // Se a URL so confirmou o que foi digitado, o texto em edicao e preservado.
  if (initial !== synced) {
    setSynced(initial);
    if (initial !== applied) {
      setApplied(initial);
      setValue(initial);
    }
  }

  useEffect(() => {
    const term = value.trim();
    if (term === applied) return;
    const timer = setTimeout(() => {
      setApplied(term);
      startTransition(() => router.replace(term ? `${href}?q=${encodeURIComponent(term)}` : href));
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [value, applied, href, router]);

  return (
    <div role="search" className="relative mb-4 max-w-md">
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-body"
        fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={100}
        className="w-full rounded border border-line/60 bg-white py-2 pr-24 pl-9 text-[0.9375rem] text-title outline-none focus:border-highlight focus:ring-1 focus:ring-highlight/30 [&::-webkit-search-cancel-button]:hidden"
      />
      <span className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2">
        {pending && <span className="text-xs text-body" aria-live="polite">Buscando…</span>}
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Limpar busca"
            className="rounded p-1 text-body hover:bg-surface hover:text-title"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </span>
    </div>
  );
}

/** Resultado vazio de uma busca, com link para limpar. */
export function SearchEmpty({ href, query }: { href: string; query: string }) {
  return (
    <p className="panel px-4 py-6 text-center text-sm text-body">
      Nenhum resultado para “{query}”.{" "}
      <Link href={href} className="font-medium text-highlight underline underline-offset-2">Limpar busca</Link>
    </p>
  );
}

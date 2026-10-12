import Link from "next/link";

export function Pagination({ href, page, totalPages, totalElements, query }: {
  href: string;
  page: number;
  totalPages: number;
  totalElements: number;
  /** Termo de busca atual, mantido nos links de pagina. */
  query?: string;
}) {
  if (totalPages <= 1) {
    return <p className="mt-3 font-mono text-xs text-body">{totalElements} registro(s)</p>;
  }
  const link = (target: number) => {
    const params = new URLSearchParams({ page: String(target) });
    if (query) params.set("q", query);
    return `${href}?${params}`;
  };
  return (
    <div className="mt-3 flex items-center justify-between text-sm text-body">
      <span className="font-mono text-xs">
        {totalElements} registro(s) · página {page + 1} de {totalPages}
      </span>
      <div className="flex gap-2">
        {page > 0 && <Link href={link(page - 1)} className="rounded border border-line/60 bg-white px-3 py-1 font-medium text-title hover:border-title">Anterior</Link>}
        {page + 1 < totalPages && <Link href={link(page + 1)} className="rounded border border-line/60 bg-white px-3 py-1 font-medium text-title hover:border-title">Próxima</Link>}
      </div>
    </div>
  );
}

/** Le ?q= da URL (termo de busca), sem espacos nas pontas. */
export function queryParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

/** Le ?page= com seguranca (valor invalido vira 0). */
export function pageParam(value: string | string[] | undefined): number {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

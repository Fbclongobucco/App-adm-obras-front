/** Semana do fechamento vinda da URL (?semana=aaaa-mm-dd); outro formato e ignorado e a API usa a semana padrao. */
export function weekParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

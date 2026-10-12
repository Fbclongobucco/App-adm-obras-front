const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function formatCurrency(value: number | null | undefined): string {
  return value == null ? "—" : currency.format(value);
}

/** "aaaa-mm-dd" -> "dd/mm/aaaa", sem conversao de fuso. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateTime(value: string | null | undefined): string {
  return value ? dateTime.format(new Date(value)) : "—";
}

export function formatCpf(value: string): string {
  return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export function formatCnpj(value: string): string {
  return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) return "—";
  if (value.length === 11) return value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  return value.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
}

export function formatZipCode(value: string): string {
  return value.replace(/^(\d{5})(\d{3})$/, "$1-$2");
}

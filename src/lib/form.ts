import type { AddressInput } from "@/lib/types";

/** Estado devolvido pelas Server Actions aos formularios. */
export type FormState = { error?: string } | undefined;

export function text(data: FormData, name: string): string | null {
  const value = data.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function number(data: FormData, name: string): number | null {
  const value = text(data, name);
  if (value == null) return null;
  const parsed = Number(value.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Valor decimal digitado com virgula ou ponto (ex.: "32,50" ou "32.50"). */
export function decimal(data: FormData, name: string): number | null {
  const value = text(data, name);
  if (value == null) return null;
  const normalized = value.includes(",") ? value.replace(/\./g, "").replace(",", ".") : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function checkbox(data: FormData, name: string): boolean {
  return data.get(name) === "on";
}

export function list(data: FormData, name: string): string[] {
  return data.getAll(name).filter((value): value is string => typeof value === "string" && value !== "");
}

/**
 * Endereco com campos "address.<campo>". Opcional: todos vazios viram null; parcialmente
 * preenchido vai para a API, que aponta o campo faltante.
 */
export function address(data: FormData, optional = false): AddressInput | null {
  const fields = {
    street: text(data, "address.street"),
    number: text(data, "address.number"),
    neighborhood: text(data, "address.neighborhood"),
    city: text(data, "address.city"),
    state: text(data, "address.state")?.toUpperCase() ?? null,
    zipCode: text(data, "address.zipCode"),
    country: text(data, "address.country") ?? "Brasil",
  };
  const filled = Object.entries(fields).some(([key, value]) => key !== "country" && value != null);
  if (optional && !filled) return null;
  return fields;
}

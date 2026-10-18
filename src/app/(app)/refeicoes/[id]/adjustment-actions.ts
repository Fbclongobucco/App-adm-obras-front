"use server";

import { revalidatePath } from "next/cache";
import { apiCall } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import { number, text, type FormState } from "@/lib/form";

/** Resultado do formulario de ajuste; `done` troca a chave do formulario para limpa-lo. */
export type AdjustmentState = (FormState & { done?: number }) | undefined;

/** Quantidade so no dia extra e so das refeicoes servidas (campo presente); vazio vale 0. */
function quantity(type: string | null, data: FormData, name: string): number | null {
  if (type !== "EXTRA_DAY" || !data.has(name)) return null;
  return number(data, name) ?? 0;
}

/** Ajustes ficam no detalhe da refeicao: depois de gravar, so revalida a pagina. */
export async function addAdjustment(mealId: string, _state: AdjustmentState, data: FormData): Promise<AdjustmentState> {
  const type = text(data, "type");
  const result = await apiCall(`/api/meals/${mealId}/adjustments`, {
    method: "POST",
    body: JSON.stringify({
      date: text(data, "date"),
      type,
      lunchQuantity: quantity(type, data, "lunchQuantity"),
      dinnerQuantity: quantity(type, data, "dinnerQuantity"),
      note: text(data, "note"),
    }),
  });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };
  revalidatePath(`/refeicoes/${mealId}`);
  revalidatePath("/", "layout");
  return { done: Date.now() };
}

/** Numeros do dia; entregas e refrigerantes null usam o padrao. */
export type DayInput = {
  type: "EXTRA_DAY" | "CHANGED";
  lunchQuantity: number | null;
  dinnerQuantity: number | null;
  lunchDeliveries: number | null;
  dinnerDeliveries: number | null;
  sodas: number | null;
  note: string | null;
};

/** Grava o dia extra ou o dia alterado da data (cria ou substitui). */
export async function putDay(mealId: string, date: string, input: DayInput): Promise<FormState> {
  const result = await apiCall(`/api/meals/${mealId}/adjustments/${date}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };
  revalidatePath(`/refeicoes/${mealId}`);
  revalidatePath("/", "layout");
  return undefined;
}

export async function removeAdjustment(mealId: string, adjustmentId: string): Promise<FormState> {
  const result = await apiCall(`/api/meals/${mealId}/adjustments/${adjustmentId}`, { method: "DELETE" });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };
  revalidatePath(`/refeicoes/${mealId}`);
  revalidatePath("/", "layout");
  return undefined;
}

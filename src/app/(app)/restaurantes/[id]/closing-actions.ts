"use server";

import { revalidatePath } from "next/cache";
import { apiCall } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form";
import type { AdjustmentType } from "@/lib/types";

export type MealQuantity = { mealId: string; lunchQuantity: number | null; dinnerQuantity: number | null };

/**
 * Feriado (sem fornecimento) ou dia extra em todas as refeicoes do restaurante, gravado pela API de uma vez:
 * qualquer erro em uma refeicao nao grava nada.
 */
export async function addRestaurantAdjustment(
  restaurantId: string,
  input: { date: string; type: AdjustmentType; note: string | null; quantities: MealQuantity[] },
): Promise<FormState> {
  const result = await apiCall(`/api/restaurants/${restaurantId}/adjustments`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };
  revalidatePath("/", "layout");
  return undefined;
}

/** Remove os ajustes da data em todas as refeicoes do restaurante. */
export async function removeRestaurantAdjustments(restaurantId: string, date: string): Promise<FormState> {
  const result = await apiCall(`/api/restaurants/${restaurantId}/adjustments/${date}`, { method: "DELETE" });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };
  revalidatePath("/", "layout");
  return undefined;
}

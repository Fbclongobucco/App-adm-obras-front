"use server";

import { deleteResource, saveResource } from "@/lib/actions";
import { checkbox, decimal, number, text, type FormState } from "@/lib/form";

const API = "/api/meals";
const LIST = "/refeicoes";

/** Campos da refeicao nao servida pelo tipo nao sao renderizados e vao como null. */
export async function saveMeal(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, {
    restaurantId: text(data, "restaurantId"),
    mealType: text(data, "mealType"),
    isBilled: checkbox(data, "isBilled"),
    lunchQuantity: number(data, "lunchQuantity"),
    lunchPrice: decimal(data, "lunchPrice"),
    dinnerQuantity: number(data, "dinnerQuantity"),
    dinnerPrice: decimal(data, "dinnerPrice"),
  }, LIST);
}

export async function deleteMeal(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

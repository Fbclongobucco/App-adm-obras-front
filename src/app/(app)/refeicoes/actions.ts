"use server";

import { deleteResource, saveResource } from "@/lib/actions";
import { checkbox, decimal, number, text, type FormState } from "@/lib/form";

const API = "/api/meals";
const LIST = "/refeicoes";

export async function saveMeal(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, {
    restaurantId: text(data, "restaurantId"),
    mealType: text(data, "mealType"),
    date: text(data, "date"),
    quantity: number(data, "quantity"),
    price: decimal(data, "price"),
    isBilled: checkbox(data, "isBilled"),
  }, LIST);
}

export async function deleteMeal(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

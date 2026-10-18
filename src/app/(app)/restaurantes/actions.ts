"use server";

import { deleteResource, saveResource } from "@/lib/actions";
import { address, decimal, text, type FormState } from "@/lib/form";

const API = "/api/restaurants";
const LIST = "/restaurantes";

export async function saveRestaurant(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, {
    name: text(data, "name"),
    phone: text(data, "phone"),
    address: address(data, true),
    projectId: text(data, "projectId"),
    lunchDeliveryFee: decimal(data, "lunchDeliveryFee"),
    dinnerDeliveryFee: decimal(data, "dinnerDeliveryFee"),
    sodaPrice: decimal(data, "sodaPrice"),
  }, LIST);
}

export async function deleteRestaurant(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

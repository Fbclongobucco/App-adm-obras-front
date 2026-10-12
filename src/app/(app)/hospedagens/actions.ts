"use server";

import { revalidatePath } from "next/cache";
import { deleteResource, saveResource } from "@/lib/actions";
import { apiCall } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import { address, checkbox, decimal, list, number, text, type FormState } from "@/lib/form";

const API = "/api/accommodations";
const LIST = "/hospedagens";

export async function saveAccommodation(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, {
    hostName: text(data, "hostName"),
    hostPhone: text(data, "hostPhone"),
    address: address(data),
    capacity: number(data, "capacity"),
    isContract: checkbox(data, "isContract"),
    startDate: text(data, "startDate"),
    monthlyPrice: decimal(data, "monthlyPrice"),
    projectId: text(data, "projectId"),
    employeeIds: list(data, "employeeIds"),
  }, LIST);
}

export async function deleteAccommodation(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

/** Renova a locacao a partir do dia seguinte ao termino; fica no detalhe, sem redirecionar. */
export async function renewAccommodation(id: string, _state: FormState, data: FormData): Promise<FormState> {
  const result = await apiCall(`${API}/${id}/renewals`, {
    method: "POST",
    body: JSON.stringify({ endDate: text(data, "endDate"), price: decimal(data, "price") }),
  });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };
  revalidatePath("/", "layout");
  return undefined;
}

export async function undoRenewal(id: string): Promise<FormState> {
  const result = await apiCall(`${API}/${id}/renewals/last`, { method: "DELETE" });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };
  revalidatePath("/", "layout");
  return undefined;
}

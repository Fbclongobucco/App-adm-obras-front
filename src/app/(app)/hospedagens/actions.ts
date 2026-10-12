"use server";

import { deleteResource, saveResource } from "@/lib/actions";
import { address, checkbox, decimal, list, number, text, type FormState } from "@/lib/form";

const API = "/api/accommodations";
const LIST = "/hospedagens";

export async function saveAccommodation(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, {
    hostName: text(data, "hostName"),
    hostPhone: text(data, "hostPhone"),
    address: address(data),
    capacity: number(data, "capacity"),
    days: number(data, "days"),
    isContract: checkbox(data, "isContract"),
    totalPrice: decimal(data, "totalPrice"),
    projectId: text(data, "projectId"),
    employeeIds: list(data, "employeeIds"),
  }, LIST);
}

export async function deleteAccommodation(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

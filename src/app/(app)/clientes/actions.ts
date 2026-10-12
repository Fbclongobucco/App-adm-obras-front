"use server";

import { deleteResource, saveResource } from "@/lib/actions";
import { address, text, type FormState } from "@/lib/form";

const API = "/api/clients";
const LIST = "/clientes";

export async function saveClient(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, {
    name: text(data, "name"),
    email: text(data, "email"),
    phone: text(data, "phone"),
    address: address(data),
  }, LIST);
}

export async function deleteClient(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

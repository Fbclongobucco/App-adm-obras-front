"use server";

import { deleteResource, saveResource } from "@/lib/actions";
import { address, text, type FormState } from "@/lib/form";

const API = "/api/employees";
const LIST = "/colaboradores";

export async function saveEmployee(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, {
    name: text(data, "name"),
    email: text(data, "email"),
    cpf: text(data, "cpf"),
    phone: text(data, "phone"),
    address: address(data, true),
    birthDate: text(data, "birthDate"),
    costCenterId: text(data, "costCenterId"),
    role: text(data, "role"),
  }, LIST);
}

export async function deleteEmployee(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

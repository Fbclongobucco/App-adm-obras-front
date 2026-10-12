"use server";

import { deleteResource, saveResource } from "@/lib/actions";
import { text, type FormState } from "@/lib/form";

const API = "/api/cost-centers";
const LIST = "/centros-de-custo";

export async function saveCostCenter(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, { name: text(data, "name"), cnpj: text(data, "cnpj") }, LIST);
}

export async function deleteCostCenter(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

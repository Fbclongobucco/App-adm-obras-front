"use server";

import { api } from "@/lib/api";
import { deleteResource, saveResource } from "@/lib/actions";
import { checkbox, list, text, type FormState } from "@/lib/form";
import type { Project } from "@/lib/types";

const API = "/api/projects";
const LIST = "/obras";

/**
 * O PUT substitui a obra inteira. Hospedagens sao gerenciadas no proprio cadastro, entao a edicao
 * reenvia os vinculos atuais para nao desfaze-los. Refeicoes se vinculam pelo restaurante.
 */
export async function saveProject(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  const current = id ? await api<Project>(`${API}/${id}`) : null;
  return saveResource(API, id, {
    os: text(data, "os"),
    description: text(data, "description"),
    costCenterId: text(data, "costCenterId"),
    clientId: text(data, "clientId"),
    startDate: text(data, "startDate"),
    endDate: text(data, "endDate"),
    isCompleted: checkbox(data, "isCompleted"),
    employeeIds: list(data, "employeeIds"),
    accommodationIds: current?.accommodations.map((a) => a.id) ?? [],
  }, LIST);
}

export async function deleteProject(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

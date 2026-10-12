"use server";

import { deleteResource, saveResource } from "@/lib/actions";
import { checkbox, list, text, type FormState } from "@/lib/form";

const API = "/api/users";
const LIST = "/usuarios";

/** Senha em branco na edicao mantem a atual. Troca de senha ou desativacao encerra as sessoes do usuario. */
export async function saveUser(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  return saveResource(API, id, {
    name: text(data, "name"),
    email: text(data, "email"),
    isActive: checkbox(data, "isActive"),
    roles: list(data, "roles"),
    password: text(data, "password"),
  }, LIST);
}

export async function deleteUser(id: string): Promise<FormState> {
  return deleteResource(API, id, LIST);
}

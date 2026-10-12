import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiCall } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form";

/**
 * Cria (sem id) ou substitui (com id) um registro e volta para a listagem.
 * Em erro, devolve a mensagem para o formulario, sem sair da pagina.
 */
export async function saveResource(
  apiPath: string,
  id: string | null,
  body: unknown,
  listHref: string,
): Promise<FormState> {
  const result = await apiCall(id ? `${apiPath}/${id}` : apiPath, {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(body),
  });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };

  revalidatePath("/", "layout");
  redirect(listHref);
}

export async function deleteResource(apiPath: string, id: string, listHref: string): Promise<FormState> {
  const result = await apiCall(`${apiPath}/${id}`, { method: "DELETE" });
  if (!result.ok) return { error: errorMessage(result.errorCode, result.message) };

  revalidatePath("/", "layout");
  redirect(listHref);
}

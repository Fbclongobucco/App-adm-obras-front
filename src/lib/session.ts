import "server-only";
import { connection } from "next/server";
import { auth } from "@/auth";

/**
 * Sessao do usuario, sempre em tempo de requisicao. Sem o connection(), o auth() pode rodar no
 * prerender e gerar o token CSRF com crypto.getRandomValues(), que o Next rejeita nessa fase.
 */
export async function getSession() {
  await connection();
  return auth();
}

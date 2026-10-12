import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { Page } from "@/lib/types";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API respondeu HTTP ${status}`);
  }
}

export type ApiFailure = {
  ok: false;
  status: number;
  errorCode?: string;
  message?: string;
};

export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

/** Tamanho maximo de pagina aceito pela API. */
export const MAX_PAGE_SIZE = 100;

async function request(path: string, init: RequestInit): Promise<Response> {
  const session = await getSession();
  if (!session || session.error) redirect("/login");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${process.env.API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers,
  });
  if (res.status === 401) redirect("/login");
  return res;
}

async function readBody(res: Response): Promise<unknown> {
  return res.status === 204 ? null : res.json().catch(() => null);
}

// Leitura autenticada. Usar apenas no servidor (Server Components, Server Actions, Route Handlers).
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await request(path, init);
  const body = await readBody(res);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

/** Leitura de um registro; 404 vira a pagina de nao encontrado. */
export async function apiOrNotFound<T>(path: string): Promise<T> {
  try {
    return await api<T>(path);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

/** Escrita: devolve o erro da API em vez de lancar, para o formulario exibir. */
export async function apiCall<T>(path: string, init: RequestInit): Promise<ApiResult<T>> {
  const res = await request(path, init);
  const body = await readBody(res);
  if (res.ok) return { ok: true, data: body as T };

  const error = (body ?? {}) as { errorCode?: string; message?: string };
  return {
    ok: false,
    status: res.status,
    errorCode: res.status === 403 ? "forbidden" : error.errorCode,
    message: error.message,
  };
}

export function getPage<T>(path: string, page = 0, size = 20, sort?: string): Promise<Page<T>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (sort) params.set("sort", sort);
  return api<Page<T>>(`${path}?${params}`);
}

/** Todos os registros de uma listagem paginada, para opcoes de selecao. */
export async function listAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  for (let page = 0; ; page++) {
    const result = await getPage<T>(path, page, MAX_PAGE_SIZE);
    items.push(...result.content);
    if (result.last || result.content.length === 0) return items;
  }
}

/** Perfil ADMIN pode criar, alterar e excluir; OPERADOR so le. */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user.roles.includes("ADMIN") ?? false;
}

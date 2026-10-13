import { NextResponse, type NextFetchEvent, type NextMiddleware, type NextRequest } from "next/server";
import { auth } from "@/auth";

const authProxy = auth as unknown as NextMiddleware;

// O auth() do proxy renova o access token e grava o novo cookie de sessão só na resposta.
// Sem repassar esse cookie à requisição, a página ainda lê a sessão antiga e pede outro refresh
// com o refresh token já trocado. O backend trata isso como reuso e revoga a sessão, o que
// derruba o login a cada expiração do access token (15 min) quando proxy e página rodam em
// instâncias diferentes, como no Vercel.
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const authResponse = await authProxy(request, event);
  if (!authResponse || authResponse.headers.has("Location")) return authResponse;

  const setCookies = authResponse.headers.getSetCookie();
  if (setCookies.length === 0) return authResponse;

  const updated = new NextResponse(null, { headers: authResponse.headers }).cookies.getAll();
  for (const cookie of updated) {
    const removed = !cookie.value || cookie.maxAge === 0 ||
      (cookie.expires !== undefined && new Date(cookie.expires).getTime() <= Date.now());
    if (removed) request.cookies.delete(cookie.name);
    else request.cookies.set(cookie.name, cookie.value);
  }

  const response = NextResponse.next({ request: { headers: request.headers } });
  for (const cookie of setCookies) response.headers.append("set-cookie", cookie);
  return response;
}

export const config = {
  matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)"],
};

import NextAuth, { CredentialsSignin } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.API_URL;
const REFRESH_COOKIE = "refresh_token";
// Renova um pouco antes de expirar para não enviar token vencido ao backend
const EXPIRY_MARGIN_MS = 30_000;
// Janela em que o resultado de um refresh é reaproveitado por requisições concorrentes
const REFRESH_REUSE_MS = 60_000;

type AuthTokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: { id: string; name: string; email: string; roles: string[] };
};

type RefreshedTokens = {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
};

class InvalidCredentials extends CredentialsSignin {
  code = "credenciais";
}

function readRefreshCookie(res: Response): string | undefined {
  for (const cookie of res.headers.getSetCookie()) {
    const [pair] = cookie.split(";");
    const [name, ...value] = pair.split("=");
    if (name.trim() === REFRESH_COOKIE) return value.join("=");
  }
}

function expiresAt(expiresIn: number) {
  return Date.now() + expiresIn * 1000;
}

// O backend troca o refresh token a cada uso e revoga a família inteira se um
// token já trocado for reapresentado. Proxy e Server Components podem pedir
// refresh com o mesmo token na mesma requisição; por isso o refresh é único
// por token e o resultado fica disponível por alguns segundos.
// Limitação: vale por processo. Com mais de uma instância do Next, usar cache
// compartilhado (ex.: Redis).
const refreshes: Map<string, Promise<RefreshedTokens>> = ((
  globalThis as { __authRefreshes?: Map<string, Promise<RefreshedTokens>> }
).__authRefreshes ??= new Map());

function refreshTokens(refreshToken: string): Promise<RefreshedTokens> {
  let pending = refreshes.get(refreshToken);
  if (!pending) {
    pending = (async () => {
      // Sem Origin: a chamada sai do servidor, e o backend so recusa Origin de site fora da lista.
      // Assim o front funciona em qualquer endereço sem configurar a URL dele no backend.
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          Cookie: `${REFRESH_COOKIE}=${refreshToken}`,
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Refresh falhou: HTTP ${res.status}`);

      const data: AuthTokenResponse = await res.json();
      const next = readRefreshCookie(res);
      if (!next) throw new Error("Refresh sem cookie refresh_token");

      return {
        accessToken: data.accessToken,
        accessTokenExpiresAt: expiresAt(data.expiresIn),
        refreshToken: next,
      };
    })();
    refreshes.set(refreshToken, pending);
    setTimeout(() => refreshes.delete(refreshToken), REFRESH_REUSE_MS);
  }
  return pending;
}

async function ensureFreshToken(token: JWT): Promise<JWT> {
  if (token.error) return token;
  if (Date.now() < token.accessTokenExpiresAt - EXPIRY_MARGIN_MS) return token;

  try {
    return { ...token, ...(await refreshTokens(token.refreshToken)) };
  } catch (e) {
    console.error("[auth] refresh token:", e);
    return { ...token, error: "RefreshTokenError" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  // Mesma validade do refresh token no backend (app.security.jwt.refresh-token-ttl)
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          cache: "no-store",
        });

        if (res.status === 401) throw new InvalidCredentials();
        if (!res.ok) throw new Error(`Login falhou: HTTP ${res.status}`);

        const data: AuthTokenResponse = await res.json();
        const refreshToken = readRefreshCookie(res);
        if (!refreshToken) throw new Error("Login sem cookie refresh_token");

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          roles: data.user.roles ?? [],
          accessToken: data.accessToken,
          accessTokenExpiresAt: expiresAt(data.expiresIn),
          refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user && !auth.error;
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id!,
          roles: user.roles,
          accessToken: user.accessToken,
          accessTokenExpiresAt: user.accessTokenExpiresAt,
          refreshToken: user.refreshToken,
        };
      }
      return ensureFreshToken(token);
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.roles = token.roles ?? [];
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  events: {
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      if (!token?.refreshToken) return;
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Cookie: `${REFRESH_COOKIE}=${token.refreshToken}`,
        },
        cache: "no-store",
      }).catch((e) => console.error("[auth] logout no backend:", e));
    },
  },
});

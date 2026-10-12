import { Suspense } from "react";
import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface px-4">
      <Suspense>
        <LoginForm searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function LoginForm({
  searchParams,
}: Pick<PageProps<"/login">, "searchParams">) {
  const { error, callbackUrl } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: typeof callbackUrl === "string" ? callbackUrl : "/",
      });
    } catch (e) {
      if (e instanceof CredentialsSignin) redirect("/login?error=credenciais");
      if (e instanceof AuthError) redirect("/login?error=servidor");
      throw e;
    }
  }

  return (
    <form
      action={login}
      className="w-full max-w-sm space-y-5 rounded-md border border-line bg-white p-8"
    >
      <div>
        <h1 className="font-heading text-2xl font-semibold text-title">
          Administração de Obras
        </h1>
        <p className="mt-1 text-sm text-body">Acesse com sua conta.</p>
      </div>

      {error && (
        <p className="rounded border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent">
          {error === "credenciais"
            ? "E-mail ou senha inválidos."
            : "Não foi possível conectar ao servidor. Tente novamente."}
        </p>
      )}

      <label className="block space-y-1">
        <span className="text-sm text-title">E-mail</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded border border-line px-3 py-2 text-sm outline-none focus:border-title"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-title">Senha</span>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded border border-line px-3 py-2 text-sm outline-none focus:border-title"
        />
      </label>

      <button
        type="submit"
        className="w-full rounded bg-title py-2 text-sm font-medium text-white hover:bg-highlight"
      >
        Entrar
      </button>
    </form>
  );
}

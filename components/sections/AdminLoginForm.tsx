"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/Button";
import { initialAdminLoginState } from "@/lib/validation/adminLogin";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialAdminLoginState);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClasses}
          aria-invalid={Boolean(state.errors.email)}
        />
        {state.errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClasses}
          aria-invalid={Boolean(state.errors.password)}
        />
        {state.errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.password}</p>
        )}
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
}

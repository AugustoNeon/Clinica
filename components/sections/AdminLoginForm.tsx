"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";
import { Notice } from "@/components/admin/Notice";
import { Field, describedBy, inputClasses } from "@/components/admin/form";
import { Button } from "@/components/ui/Button";
import { initialAdminLoginState } from "@/lib/validation/adminLogin";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialAdminLoginState);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <Field id="email" label="E-mail" error={state.errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          className={inputClasses}
          aria-invalid={Boolean(state.errors.email)}
          aria-describedby={describedBy("email", Boolean(state.errors.email), false)}
        />
      </Field>

      <Field id="password" label="Senha" error={state.errors.password}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClasses}
          aria-invalid={Boolean(state.errors.password)}
          aria-describedby={describedBy("password", Boolean(state.errors.password), false)}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}

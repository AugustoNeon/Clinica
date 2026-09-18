"use client";

import { useActionState } from "react";
import { disableTotpAction } from "@/app/admin/(protected)/seguranca/actions";
import { Notice } from "@/components/admin/Notice";
import { Field, codeInputClasses, describedBy } from "@/components/admin/form";
import { Button } from "@/components/ui/Button";
import { initialAdminTotpCodeState } from "@/lib/validation/adminTotp";

export function TotpDisableForm() {
  const [state, formAction, isPending] = useActionState(
    disableTotpAction,
    initialAdminTotpCodeState,
  );

  return (
    <form action={formAction} noValidate className="grid gap-4">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <Field
        id="code"
        label="Código atual do aplicativo"
        hint="Para desativar, confirme com o código de agora — assim ninguém desliga a proteção só com a senha."
        error={state.errors.code}
      >
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={6}
          className={codeInputClasses}
          aria-invalid={Boolean(state.errors.code)}
          aria-describedby={describedBy("code", Boolean(state.errors.code), true)}
        />
      </Field>

      <div>
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Desativando…" : "Desativar verificação em duas etapas"}
        </Button>
      </div>
    </form>
  );
}

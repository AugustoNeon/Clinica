"use client";

import { useActionState } from "react";
import { confirmTotpEnrollmentAction } from "@/app/admin/(protected)/seguranca/actions";
import { Notice } from "@/components/admin/Notice";
import { Field, codeInputClasses, describedBy } from "@/components/admin/form";
import { Button } from "@/components/ui/Button";
import { initialAdminTotpCodeState } from "@/lib/validation/adminTotp";

export function TotpEnrollForm({ secret, email }: { secret: string; email: string }) {
  const [state, formAction, isPending] = useActionState(
    confirmTotpEnrollmentAction,
    initialAdminTotpCodeState,
  );

  return (
    <form action={formAction} noValidate className="grid gap-4">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <input type="hidden" name="secret" value={secret} />
      <input type="hidden" name="email" value={email} />

      <Field id="code" label="Código que o aplicativo mostra agora" error={state.errors.code}>
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
          aria-describedby={describedBy("code", Boolean(state.errors.code), false)}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Confirmando…" : "Ativar verificação em duas etapas"}
      </Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { verifyMfaAction } from "@/app/admin/mfa/actions";
import { Notice } from "@/components/admin/Notice";
import { Field, codeInputClasses, describedBy } from "@/components/admin/form";
import { Button } from "@/components/ui/Button";
import { initialAdminTotpCodeState } from "@/lib/validation/adminTotp";

export function MfaChallengeForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(
    verifyMfaAction,
    initialAdminTotpCodeState,
  );

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <input type="hidden" name="next" value={next} />

      <Field id="code" label="Código de 6 dígitos" error={state.errors.code}>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          className={codeInputClasses}
          aria-invalid={Boolean(state.errors.code)}
          aria-describedby={describedBy("code", Boolean(state.errors.code), false)}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Verificando…" : "Verificar e entrar"}
      </Button>
    </form>
  );
}

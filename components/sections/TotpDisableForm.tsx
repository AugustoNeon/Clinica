"use client";

import { useActionState } from "react";
import { disableTotpAction } from "@/app/admin/(protected)/seguranca/actions";
import { Button } from "@/components/ui/Button";
import { initialAdminTotpCodeState } from "@/lib/validation/adminTotp";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-center text-lg tracking-[0.3em] outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

export function TotpDisableForm() {
  const [state, formAction, isPending] = useActionState(
    disableTotpAction,
    initialAdminTotpCodeState,
  );

  return (
    <form action={formAction} noValidate className="grid gap-4">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="code" className="mb-1.5 block text-sm font-medium">
          Digite o código atual do aplicativo pra desativar
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.code)}
        />
        {state.errors.code && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.code}</p>
        )}
      </div>

      <div>
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Desativando..." : "Desativar verificação em duas etapas"}
        </Button>
      </div>
    </form>
  );
}

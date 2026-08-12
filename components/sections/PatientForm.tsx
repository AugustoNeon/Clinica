"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { initialAdminPatientState, type AdminPatientState } from "@/lib/validation/adminPatient";
import type { Patient } from "@/types";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

interface PatientFormProps {
  patient?: Patient;
  action: (state: AdminPatientState, formData: FormData) => Promise<AdminPatientState>;
  submitLabel: string;
}

export function PatientForm({ patient, action, submitLabel }: PatientFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminPatientState);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

      <Field label="Nome" error={state.errors.name}>
        <input
          name="name"
          type="text"
          defaultValue={patient?.name}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.name)}
        />
      </Field>

      <Field label="Telefone" error={state.errors.phone}>
        <input
          name="phone"
          type="text"
          defaultValue={patient?.phone}
          placeholder="ex.: (41) 99999-0000"
          className={inputClasses}
          aria-invalid={Boolean(state.errors.phone)}
        />
      </Field>

      <Field label="E-mail (opcional)" error={state.errors.email}>
        <input
          name="email"
          type="text"
          defaultValue={patient?.email ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.email)}
        />
      </Field>

      <Field label="Observacoes (opcional)" error={state.errors.notes}>
        <textarea
          name="notes"
          rows={4}
          defaultValue={patient?.notes ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.notes)}
        />
      </Field>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

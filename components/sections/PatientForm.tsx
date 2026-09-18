"use client";

import { useActionState } from "react";
import { Notice } from "@/components/admin/Notice";
import { Field, FormActions, FormSection, describedBy, inputClasses } from "@/components/admin/form";
import { initialAdminPatientState, type AdminPatientState } from "@/lib/validation/adminPatient";
import type { Patient } from "@/types";

interface PatientFormProps {
  patient?: Patient;
  action: (state: AdminPatientState, formData: FormData) => Promise<AdminPatientState>;
  submitLabel: string;
}

export function PatientForm({ patient, action, submitLabel }: PatientFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminPatientState);
  const errors = state.errors;

  return (
    <form action={formAction} noValidate className="grid gap-6">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <FormSection title="Dados do paciente">
        <Field id="name" label="Nome completo" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="off"
            defaultValue={patient?.name}
            className={inputClasses}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="phone" label="Telefone / WhatsApp" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="off"
              defaultValue={patient?.phone}
              placeholder="(41) 99999-0000"
              className={inputClasses}
              aria-invalid={Boolean(errors.phone)}
            />
          </Field>
          <Field id="email" label="E-mail" optional error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="off"
              defaultValue={patient?.email ?? ""}
              className={inputClasses}
              aria-invalid={Boolean(errors.email)}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title="Observações"
        description="Só o necessário para o atendimento. Nada daqui vai para o site."
      >
        <Field id="notes" label="Anotações" optional hint="Ex.: alergias informadas, preferência de horário, indicação." error={errors.notes}>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={patient?.notes ?? ""}
            className={inputClasses}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={describedBy("notes", Boolean(errors.notes), true)}
          />
        </Field>
      </FormSection>

      <FormActions submitLabel={submitLabel} pending={isPending} cancelHref="/admin/pacientes" />
    </form>
  );
}

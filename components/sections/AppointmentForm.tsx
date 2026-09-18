"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Notice } from "@/components/admin/Notice";
import { Field, FormActions, FormSection, describedBy, inputClasses } from "@/components/admin/form";
import { HOURLY_SLOTS } from "@/lib/scheduling";
import {
  appointmentStatusLabels,
  appointmentStatusValues,
  initialAdminAppointmentState,
  type AdminAppointmentState,
} from "@/lib/validation/adminAppointment";
import type { Appointment, Patient, Service } from "@/types";

interface AppointmentFormProps {
  appointment?: Appointment;
  patients: Patient[];
  services: Service[];
  defaultDate?: string;
  /** Pre-seleciona o paciente (link "Marcar consulta" na lista de pacientes). */
  defaultPatientId?: string;
  /** So `true` na tela de edicao — toda consulta nasce "confirmada" (decisao do /grill), status nao aparece na criacao. */
  showStatus?: boolean;
  action: (state: AdminAppointmentState, formData: FormData) => Promise<AdminAppointmentState>;
  submitLabel: string;
}

export function AppointmentForm({
  appointment,
  patients,
  services,
  defaultDate,
  defaultPatientId,
  showStatus = false,
  action,
  submitLabel,
}: AppointmentFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminAppointmentState);
  const errors = state.errors;

  return (
    <form action={formAction} noValidate className="grid gap-6">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <FormSection title="Consulta">
        <Field id="patient_id" label="Paciente" error={errors.patient_id}>
          {patients.length === 0 ? (
            <Notice tone="info">
              Nenhum paciente cadastrado ainda.{" "}
              <Link href="/admin/pacientes/novo" className="font-medium text-blue-dark underline underline-offset-4">
                Cadastre o primeiro
              </Link>{" "}
              e volte aqui.
            </Notice>
          ) : (
            <select
              id="patient_id"
              name="patient_id"
              defaultValue={appointment?.patient_id ?? defaultPatientId ?? ""}
              className={inputClasses}
              aria-invalid={Boolean(errors.patient_id)}
            >
              <option value="" disabled>
                Selecione…
              </option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field id="service_id" label="Serviço" optional hint="Ajuda a lembrar do motivo; não aparece no site." error={errors.service_id}>
          <select
            id="service_id"
            name="service_id"
            defaultValue={appointment?.service_id ?? ""}
            className={inputClasses}
            aria-invalid={Boolean(errors.service_id)}
            aria-describedby={describedBy("service_id", Boolean(errors.service_id), true)}
          >
            <option value="">Nenhum</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="date" label="Data" error={errors.date}>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={appointment?.date ?? defaultDate ?? ""}
              className={inputClasses}
              aria-invalid={Boolean(errors.date)}
            />
          </Field>
          <Field id="time" label="Horário" hint="Consultas de 1 hora, em hora cheia." error={errors.time}>
            <select
              id="time"
              name="time"
              defaultValue={appointment?.time ?? ""}
              className={inputClasses}
              aria-invalid={Boolean(errors.time)}
              aria-describedby={describedBy("time", Boolean(errors.time), true)}
            >
              <option value="" disabled>
                Selecione…
              </option>
              {HOURLY_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {showStatus && (
          <Field id="status" label="Status">
            <select
              id="status"
              name="status"
              defaultValue={appointment?.status ?? "confirmada"}
              className={inputClasses}
            >
              {appointmentStatusValues.map((value) => (
                <option key={value} value={value}>
                  {appointmentStatusLabels[value]}
                </option>
              ))}
            </select>
          </Field>
        )}
      </FormSection>

      <FormSection title="Observações" description="Só para você. Nada daqui vai para o site.">
        <Field id="notes" label="Anotações" optional error={errors.notes}>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={appointment?.notes ?? ""}
            className={inputClasses}
            aria-invalid={Boolean(errors.notes)}
          />
        </Field>
      </FormSection>

      <FormActions
        submitLabel={submitLabel}
        pending={isPending}
        disabled={patients.length === 0}
        cancelHref="/admin/agenda"
      />
    </form>
  );
}

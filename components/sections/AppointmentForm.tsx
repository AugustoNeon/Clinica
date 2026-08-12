"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  appointmentStatusValues,
  appointmentStatusLabels,
  initialAdminAppointmentState,
  type AdminAppointmentState,
} from "@/lib/validation/adminAppointment";
import { HOURLY_SLOTS } from "@/lib/scheduling";
import type { Appointment, Patient, Service } from "@/types";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

interface AppointmentFormProps {
  appointment?: Appointment;
  patients: Patient[];
  services: Service[];
  defaultDate?: string;
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
  showStatus = false,
  action,
  submitLabel,
}: AppointmentFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminAppointmentState);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

      <Field label="Paciente" error={state.errors.patient_id}>
        {patients.length === 0 ? (
          <p className="text-sm opacity-70">
            Nenhum paciente cadastrado ainda —{" "}
            <Link href="/admin/pacientes/novo" className="underline underline-offset-2">
              cadastre um primeiro
            </Link>
            .
          </p>
        ) : (
          <select
            name="patient_id"
            defaultValue={appointment?.patient_id ?? ""}
            className={inputClasses}
            aria-invalid={Boolean(state.errors.patient_id)}
          >
            <option value="" disabled>
              Selecione...
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field label="Servico (opcional)" error={state.errors.service_id}>
        <select
          name="service_id"
          defaultValue={appointment?.service_id ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.service_id)}
        >
          <option value="">Nenhum</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Data" error={state.errors.date}>
        <input
          name="date"
          type="date"
          defaultValue={appointment?.date ?? defaultDate ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.date)}
        />
      </Field>

      <Field label="Horario" error={state.errors.time}>
        <select
          name="time"
          defaultValue={appointment?.time ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.time)}
        >
          <option value="" disabled>
            Selecione...
          </option>
          {HOURLY_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </Field>

      {showStatus && (
        <Field label="Status">
          <select
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

      <Field label="Observacoes (opcional)" error={state.errors.notes}>
        <textarea
          name="notes"
          rows={4}
          defaultValue={appointment?.notes ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.notes)}
        />
      </Field>

      <div>
        <Button type="submit" disabled={isPending || patients.length === 0}>
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

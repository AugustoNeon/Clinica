import { z } from "zod";
import type { AppointmentStatus } from "@/types";

/**
 * Schema do formulario de consulta no painel admin (issue #37 revisada).
 *
 * `status` NAO faz parte deste schema base: so aparece no formulario de
 * EDICAO (toda consulta nasce "confirmada", decisao do /grill). Ver
 * `adminAppointmentStatusSchema` abaixo, usado so na edicao.
 */

export const appointmentStatusValues = [
  "confirmada",
  "cancelada",
  "concluida",
] as const satisfies readonly AppointmentStatus[];

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  concluida: "Concluida",
};

export const adminAppointmentStatusSchema = z.enum(appointmentStatusValues);

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

export const adminAppointmentSchema = z.object({
  patient_id: z.string().trim().min(1, "Selecione um paciente."),
  service_id: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value)),
  date: z.string().trim().regex(datePattern, "Data invalida."),
  time: z.string().trim().regex(timePattern, "Horario invalido."),
  notes: z
    .string()
    .trim()
    .max(2000, "Observacoes muito extensas.")
    .transform((value) => (value === "" ? null : value)),
});

export type AdminAppointmentValues = z.infer<typeof adminAppointmentSchema>;

export type AdminAppointmentInput = {
  patient_id: string;
  service_id: string;
  date: string;
  time: string;
  notes: string;
};

export type AdminAppointmentFieldErrors = Partial<Record<keyof AdminAppointmentInput, string>>;

export interface AdminAppointmentState {
  status: "idle" | "error";
  message: string;
  errors: AdminAppointmentFieldErrors;
}

export const initialAdminAppointmentState: AdminAppointmentState = {
  status: "idle",
  message: "",
  errors: {},
};

export function validateAdminAppointment(
  input: AdminAppointmentInput,
):
  | { success: true; data: AdminAppointmentValues }
  | { success: false; errors: AdminAppointmentFieldErrors } {
  const parsed = adminAppointmentSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: AdminAppointmentFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof AdminAppointmentInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

export function adminAppointmentInputFromFormData(formData: FormData): AdminAppointmentInput {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    patient_id: read("patient_id"),
    service_id: read("service_id"),
    date: read("date"),
    time: read("time"),
    notes: read("notes"),
  };
}

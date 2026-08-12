import { z } from "zod";

/**
 * Schema do formulario de paciente no painel admin — mesmo padrao de
 * `lib/validation/adminTeamMember.ts` (fonte unica cliente+servidor).
 *
 * Dado pessoal: nunca logar `name`/`phone`/`email`/`notes` (mesma regra de
 * `contact_leads`, ver AGENTS.md "Regras de conteudo").
 */

export const adminPatientSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(120, "Nome muito longo."),
  phone: z.string().trim().min(1, "Informe o telefone.").max(30, "Telefone muito longo."),
  email: z
    .string()
    .trim()
    .max(190, "E-mail muito longo.")
    .refine((value) => value === "" || z.email().safeParse(value).success, "E-mail invalido.")
    .transform((value) => (value === "" ? null : value)),
  notes: z
    .string()
    .trim()
    .max(2000, "Observacoes muito extensas.")
    .transform((value) => (value === "" ? null : value)),
});

export type AdminPatientValues = z.infer<typeof adminPatientSchema>;

export type AdminPatientInput = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export type AdminPatientFieldErrors = Partial<Record<keyof AdminPatientInput, string>>;

export interface AdminPatientState {
  status: "idle" | "error";
  message: string;
  errors: AdminPatientFieldErrors;
}

export const initialAdminPatientState: AdminPatientState = {
  status: "idle",
  message: "",
  errors: {},
};

export function validateAdminPatient(
  input: AdminPatientInput,
): { success: true; data: AdminPatientValues } | { success: false; errors: AdminPatientFieldErrors } {
  const parsed = adminPatientSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: AdminPatientFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof AdminPatientInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

export function adminPatientInputFromFormData(formData: FormData): AdminPatientInput {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    name: read("name"),
    phone: read("phone"),
    email: read("email"),
    notes: read("notes"),
  };
}

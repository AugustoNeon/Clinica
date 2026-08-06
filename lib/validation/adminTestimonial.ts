import { z } from "zod";

/**
 * Schema do formulario de depoimento no painel admin — mesmo padrao de
 * `lib/validation/adminService.ts` (fonte unica cliente+servidor).
 *
 * LGPD: `consent_confirmed` e um campo explicito do formulario, nao um
 * default silencioso — a doutora precisa marcar de proposito que tem o
 * consentimento por escrito do paciente (PLANEJAMENTO.md secao 7,
 * AGENTS.md "Regras de conteudo"). Sem essa marcacao, `getTestimonials()`
 * nunca expoe o depoimento na rota publica, mesmo que `published` esteja
 * marcado.
 */

export const adminTestimonialSchema = z.object({
  patient_name: z
    .string()
    .trim()
    .min(1, "Informe o nome do paciente.")
    .max(120, "Nome muito longo."),
  content: z.string().trim().min(1, "Informe o depoimento.").max(2000, "Depoimento muito longo."),
  rating: z.coerce
    .number()
    .int("Avaliacao precisa ser um numero inteiro.")
    .min(1, "Avaliacao minima e 1.")
    .max(5, "Avaliacao maxima e 5."),
  photo_url: z
    .string()
    .trim()
    .max(500, "URL muito longa.")
    .refine((value) => value === "" || z.url().safeParse(value).success, "URL invalida.")
    .transform((value) => (value === "" ? null : value)),
  consent_confirmed: z.boolean(),
  published: z.boolean(),
});

export type AdminTestimonialValues = z.infer<typeof adminTestimonialSchema>;

export type AdminTestimonialInput = {
  patient_name: string;
  content: string;
  rating: string;
  photo_url: string;
  consent_confirmed: boolean;
  published: boolean;
};

export type AdminTestimonialFieldErrors = Partial<Record<keyof AdminTestimonialInput, string>>;

export interface AdminTestimonialState {
  status: "idle" | "error";
  message: string;
  errors: AdminTestimonialFieldErrors;
}

export const initialAdminTestimonialState: AdminTestimonialState = {
  status: "idle",
  message: "",
  errors: {},
};

export function validateAdminTestimonial(
  input: AdminTestimonialInput,
):
  | { success: true; data: AdminTestimonialValues }
  | { success: false; errors: AdminTestimonialFieldErrors } {
  const parsed = adminTestimonialSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: AdminTestimonialFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof AdminTestimonialInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

export function adminTestimonialInputFromFormData(formData: FormData): AdminTestimonialInput {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    patient_name: read("patient_name"),
    content: read("content"),
    rating: read("rating"),
    photo_url: read("photo_url"),
    consent_confirmed: formData.get("consent_confirmed") === "on",
    published: formData.get("published") === "on",
  };
}

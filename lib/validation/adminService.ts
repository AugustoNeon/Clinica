import { z } from "zod";

/**
 * Schema do formulario de servico no painel admin — mesmo padrao de
 * `lib/validation/contact.ts`/`adminLogin.ts` (fonte unica cliente+servidor).
 */

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const adminServiceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Informe o slug.")
    .max(120, "Slug muito longo.")
    .regex(slugPattern, "Use apenas letras minúsculas, números e hífen (ex.: clinico-geral)."),
  title: z.string().trim().min(1, "Informe o título.").max(120, "Título muito longo."),
  description: z
    .string()
    .trim()
    .min(1, "Informe a descrição curta.")
    .max(300, "Descrição curta muito longa (máximo 300 caracteres)."),
  long_description: z
    .string()
    .trim()
    .max(4000, "Descrição longa muito extensa.")
    .transform((value) => (value === "" ? null : value)),
  category: z
    .string()
    .trim()
    .max(120, "Categoria muito longa.")
    .transform((value) => (value === "" ? null : value)),
  image_url: z
    .string()
    .trim()
    .max(500, "URL muito longa.")
    .refine((value) => value === "" || z.url().safeParse(value).success, "URL inválida.")
    .transform((value) => (value === "" ? null : value)),
  order: z.coerce.number().int("Ordem precisa ser um número inteiro.").min(0, "Ordem não pode ser negativa."),
  published: z.boolean(),
});

export type AdminServiceValues = z.infer<typeof adminServiceSchema>;

export type AdminServiceInput = {
  slug: string;
  title: string;
  description: string;
  long_description: string;
  category: string;
  image_url: string;
  order: string;
  published: boolean;
};

export type AdminServiceFieldErrors = Partial<Record<keyof AdminServiceInput, string>>;

export interface AdminServiceState {
  status: "idle" | "error";
  message: string;
  errors: AdminServiceFieldErrors;
}

export const initialAdminServiceState: AdminServiceState = {
  status: "idle",
  message: "",
  errors: {},
};

export function validateAdminService(
  input: AdminServiceInput,
):
  | { success: true; data: AdminServiceValues }
  | { success: false; errors: AdminServiceFieldErrors } {
  const parsed = adminServiceSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: AdminServiceFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof AdminServiceInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

export function adminServiceInputFromFormData(formData: FormData): AdminServiceInput {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    slug: read("slug"),
    title: read("title"),
    description: read("description"),
    long_description: read("long_description"),
    category: read("category"),
    image_url: read("image_url"),
    order: read("order"),
    published: formData.get("published") === "on",
  };
}

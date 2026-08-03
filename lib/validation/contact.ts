import { z } from "zod";

/**
 * Schema do formulario de contato — FONTE UNICA, compartilhada entre
 * cliente e servidor.
 *
 * PLANEJAMENTO.md secao 6: "nunca confiar em validacao so no cliente".
 * O mesmo schema roda no browser (feedback imediato) e dentro da Server
 * Action (barreira de verdade). Divergencia entre os dois e impossivel
 * por construcao: e o mesmo objeto.
 */

/**
 * Telefone brasileiro em formato livre: aceita `(11) 91234-5678`,
 * `11912345678`, `+55 11 91234-5678`. A regra dura e a contagem de
 * digitos (10 = fixo com DDD, 11 = celular com DDD, ate 13 com +55).
 */
const phoneDigits = (value: string) => value.replace(/\D/g, "");

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo (minimo 3 caracteres).")
    .max(120, "Nome muito longo (maximo 120 caracteres)."),

  phone: z
    .string()
    .trim()
    .min(1, "Informe um telefone para contato.")
    .max(30, "Telefone muito longo.")
    .refine((value) => {
      const digits = phoneDigits(value).length;
      return digits >= 10 && digits <= 13;
    }, "Telefone invalido. Use DDD + numero, por exemplo (11) 91234-5678."),

  /** Opcional: nem todo paciente quer deixar e-mail. */
  email: z
    .string()
    .trim()
    .max(180, "E-mail muito longo.")
    .refine((value) => value === "" || z.email().safeParse(value).success, "E-mail invalido.")
    .transform((value) => (value === "" ? null : value)),

  message: z
    .string()
    .trim()
    .min(10, "Escreva uma mensagem com pelo menos 10 caracteres.")
    .max(2000, "Mensagem muito longa (maximo 2000 caracteres)."),

  /** Slug do servico de interesse. Opcional — o paciente pode nao saber. */
  preferred_service: z
    .string()
    .trim()
    .max(120, "Servico invalido.")
    .transform((value) => (value === "" ? null : value)),

  /**
   * LGPD (PLANEJAMENTO.md secao 7): consentimento EXPLICITO e obrigatorio.
   * Checkbox nao marcado nao envia — e o aceite tem que ser um ato do
   * usuario, nunca um default do formulario.
   */
  lgpd_consent: z
    .boolean()
    .refine((value) => value, "E preciso aceitar a politica de privacidade para enviar."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Entrada crua do formulario, antes do parse (tudo string, como vem do DOM). */
export type ContactFormInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
  preferred_service: string;
  lgpd_consent: boolean;
};

/** Erros por campo, no formato consumido pelo componente do formulario. */
export type ContactFieldErrors = Partial<Record<keyof ContactFormInput, string>>;

/**
 * Estado devolvido pela Server Action do formulario (`useActionState`).
 * Vive aqui, e nao no arquivo "use server", porque um modulo de Server
 * Action so pode exportar funcoes assincronas.
 */
export interface ContactFormState {
  status: "idle" | "success" | "error";
  /** Mensagem para o usuario. Nunca contem stack trace nem detalhe interno. */
  message: string;
  errors: ContactFieldErrors;
}

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  errors: {},
};

/**
 * Roda o schema e achata os erros para `{ campo: primeira mensagem }`.
 * Usada nos dois lados (browser e Server Action).
 */
export function validateContactForm(
  input: ContactFormInput,
):
  | { success: true; data: ContactFormValues }
  | { success: false; errors: ContactFieldErrors } {
  const parsed = contactFormSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: ContactFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof ContactFormInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

/** Le o `FormData` da Server Action no formato bruto do formulario. */
export function contactFormInputFromFormData(formData: FormData): ContactFormInput {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    name: read("name"),
    phone: read("phone"),
    email: read("email"),
    message: read("message"),
    preferred_service: read("preferred_service"),
    lgpd_consent: formData.get("lgpd_consent") === "on",
  };
}

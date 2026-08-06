import { z } from "zod";

/**
 * Schema do login do painel admin — mesmo padrao de
 * `lib/validation/contact.ts` (fonte unica cliente+servidor).
 *
 * Validacao aqui e so de FORMATO (e-mail bem formado, senha nao vazia).
 * A validacao de verdade (credencial correta) e o
 * `supabase.auth.signInWithPassword`, na Server Action.
 */

export const adminLoginSchema = z.object({
  email: z.email("E-mail invalido."),
  password: z.string().min(1, "Informe a senha."),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminLoginFieldErrors = Partial<Record<keyof AdminLoginInput, string>>;

export interface AdminLoginState {
  status: "idle" | "error";
  message: string;
  errors: AdminLoginFieldErrors;
}

export const initialAdminLoginState: AdminLoginState = {
  status: "idle",
  message: "",
  errors: {},
};

export function validateAdminLogin(
  input: AdminLoginInput,
):
  | { success: true; data: AdminLoginValues }
  | { success: false; errors: AdminLoginFieldErrors } {
  const parsed = adminLoginSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: AdminLoginFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof AdminLoginInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

export function adminLoginInputFromFormData(formData: FormData): AdminLoginInput {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    email: read("email"),
    password: read("password"),
  };
}

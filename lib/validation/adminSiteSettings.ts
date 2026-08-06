import { z } from "zod";

/**
 * Schema do formulario de configuracoes institucionais no painel admin.
 *
 * Diferente dos outros formularios admin: `site_settings` nao tem um
 * conjunto fixo de campos conhecido em tempo de compilacao (as chaves
 * moram no banco, seedadas em `supabase/migrations/0003_seed_conteudo_real.sql`).
 * Por isso o schema e um `record` generico (chave -> valor), em vez de um
 * `object` com campos nomeados.
 */

const MAX_VALUE_LENGTH = 2000;

export const adminSiteSettingsSchema = z.record(
  z.string(),
  z.string().trim().max(MAX_VALUE_LENGTH, `Valor muito longo (maximo ${MAX_VALUE_LENGTH} caracteres).`),
);

export type AdminSiteSettingsValues = z.infer<typeof adminSiteSettingsSchema>;

export type AdminSiteSettingsFieldErrors = Record<string, string>;

export interface AdminSiteSettingsState {
  status: "idle" | "success" | "error";
  message: string;
  errors: AdminSiteSettingsFieldErrors;
}

export const initialAdminSiteSettingsState: AdminSiteSettingsState = {
  status: "idle",
  message: "",
  errors: {},
};

export function validateAdminSiteSettings(
  input: Record<string, string>,
):
  | { success: true; data: AdminSiteSettingsValues }
  | { success: false; errors: AdminSiteSettingsFieldErrors } {
  const parsed = adminSiteSettingsSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: AdminSiteSettingsFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

/** Le do FormData so as chaves que a tela mostrou (evita campo injetado). */
export function adminSiteSettingsInputFromFormData(
  keys: string[],
  formData: FormData,
): Record<string, string> {
  const input: Record<string, string> = {};
  for (const key of keys) {
    const value = formData.get(key);
    input[key] = typeof value === "string" ? value : "";
  }
  return input;
}

"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerComponentClient } from "@/lib/supabase/server";
import {
  adminLoginInputFromFormData,
  validateAdminLogin,
  type AdminLoginState,
} from "@/lib/validation/adminLogin";

/**
 * Server Action de login do painel admin (Fase 5 PR2, issue #18).
 *
 * Mesmo padrao de `app/contato/actions.ts`: valida com o schema
 * compartilhado, e erro nunca vaza detalhe interno (aqui, alem disso,
 * nunca revela se o problema foi o e-mail ou a senha — mensagem generica
 * evita enumeracao de conta).
 */
export async function loginAction(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const input = adminLoginInputFromFormData(formData);
  const result = validateAdminLogin(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return {
      status: "error",
      message: "E-mail ou senha invalidos.",
      errors: {},
    };
  }

  redirect("/admin");
}

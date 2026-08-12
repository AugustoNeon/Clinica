"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTotpSecretForCurrentUser } from "@/lib/data/adminSecurity";
import { signMfaCookie } from "@/lib/adminAuth/mfaCookie";
import {
  MFA_VERIFIED_COOKIE,
  SESSION_STARTED_COOKIE,
  mfaCookieOptions,
} from "@/lib/adminAuth/constants";
import { verifyTotpCode } from "@/lib/adminAuth/totp";
import {
  adminTotpCodeInputFromFormData,
  validateAdminTotpCode,
  type AdminTotpCodeState,
} from "@/lib/validation/adminTotp";

/**
 * Desafio de MFA pos-login (issue #47). So chega aqui quem ja passou
 * e-mail+senha (checado por `lib/supabase/middleware.ts`) e tem
 * `totp_enabled` - sem log de codigo nem de e-mail em erro, mesma regra
 * de nunca vazar detalhe interno das outras Server Actions do projeto.
 */
export async function verifyMfaAction(
  _prevState: AdminTotpCodeState,
  formData: FormData,
): Promise<AdminTotpCodeState> {
  const input = adminTotpCodeInputFromFormData(formData);
  const result = validateAdminTotpCode(input);
  if (!result.success) {
    return { status: "error", message: "Codigo invalido.", errors: result.errors };
  }

  const totp = await getTotpSecretForCurrentUser();
  if (!totp) {
    // Sem TOTP habilitado (ou sessao caiu) - nada pra verificar aqui.
    redirect("/admin");
  }

  if (!verifyTotpCode(totp.secret, result.data.code, totp.email)) {
    return {
      status: "error",
      message: "Codigo incorreto ou expirado. Tente o codigo atual do aplicativo.",
      errors: {},
    };
  }

  const cookieStore = await cookies();
  const sessionStarted = cookieStore.get(SESSION_STARTED_COOKIE)?.value ?? String(Date.now());
  const signature = await signMfaCookie(totp.secret, sessionStarted);
  cookieStore.set(MFA_VERIFIED_COOKIE, signature, mfaCookieOptions());

  const nextPath = String(formData.get("next") ?? "/admin");
  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

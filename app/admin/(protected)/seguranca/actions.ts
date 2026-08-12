"use server";

import { redirect } from "next/navigation";
import {
  getTotpStatus,
  getTotpSecretForCurrentUser,
  saveTotpSecret,
  disableTotp,
} from "@/lib/data/adminSecurity";
import { verifyTotpCode } from "@/lib/adminAuth/totp";
import {
  adminTotpCodeInputFromFormData,
  validateAdminTotpCode,
  type AdminTotpCodeState,
} from "@/lib/validation/adminTotp";

/**
 * Confirma o cadastro do TOTP (issue #47): so salva o segredo depois do
 * usuario provar que configurou certo o app autenticador, digitando um
 * codigo valido. Evita o cenario de "salvei um segredo errado e me
 * tranquei fora do proprio painel".
 */
export async function confirmTotpEnrollmentAction(
  _prevState: AdminTotpCodeState,
  formData: FormData,
): Promise<AdminTotpCodeState> {
  const input = adminTotpCodeInputFromFormData(formData);
  const result = validateAdminTotpCode(input);
  if (!result.success) {
    return { status: "error", message: "Codigo invalido.", errors: result.errors };
  }

  const secretBase32 = String(formData.get("secret") ?? "");
  const email = String(formData.get("email") ?? "");
  if (!secretBase32 || !email) {
    return {
      status: "error",
      message: "Sessão de cadastro expirada. Recarregue a página e tente de novo.",
      errors: {},
    };
  }

  if (!verifyTotpCode(secretBase32, result.data.code, email)) {
    return {
      status: "error",
      message: "Codigo incorreto. Confira o app autenticador e tente de novo.",
      errors: {},
    };
  }

  await saveTotpSecret(secretBase32);
  redirect("/admin/seguranca?ativado=1");
}

/** Exige o codigo atual pra desativar - nao deixa uma sessao sequestrada desligar o MFA sem provar o segundo fator. */
export async function disableTotpAction(
  _prevState: AdminTotpCodeState,
  formData: FormData,
): Promise<AdminTotpCodeState> {
  const input = adminTotpCodeInputFromFormData(formData);
  const result = validateAdminTotpCode(input);
  if (!result.success) {
    return { status: "error", message: "Codigo invalido.", errors: result.errors };
  }

  const totp = await getTotpStatus();
  if (!totp?.enabled) redirect("/admin/seguranca");

  const stored = await getTotpSecretForCurrentUser();
  if (!stored || !verifyTotpCode(stored.secret, result.data.code, stored.email)) {
    return {
      status: "error",
      message: "Codigo incorreto. Digite o codigo atual do aplicativo pra desativar.",
      errors: {},
    };
  }

  await disableTotp();
  redirect("/admin/seguranca?desativado=1");
}

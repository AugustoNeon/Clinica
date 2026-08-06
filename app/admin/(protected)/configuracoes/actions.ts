"use server";

import { revalidatePath } from "next/cache";
import { getSiteSettings, updateSiteSettings } from "@/lib/data/siteSettings";
import {
  adminSiteSettingsInputFromFormData,
  validateAdminSiteSettings,
  type AdminSiteSettingsState,
} from "@/lib/validation/adminSiteSettings";

export async function updateSiteSettingsAction(
  _prevState: AdminSiteSettingsState,
  formData: FormData,
): Promise<AdminSiteSettingsState> {
  const current = await getSiteSettings();
  const keys = current.map((setting) => setting.key);
  const input = adminSiteSettingsInputFromFormData(keys, formData);
  const result = validateAdminSiteSettings(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  try {
    await updateSiteSettings(result.data);
  } catch {
    return {
      status: "error",
      message: "Nao foi possivel salvar as configuracoes agora. Tente novamente.",
      errors: {},
    };
  }

  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
  revalidatePath("/sobre");
  revalidatePath("/contato");

  return { status: "success", message: "Configuracoes salvas.", errors: {} };
}

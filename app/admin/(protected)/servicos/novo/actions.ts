"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createService } from "@/lib/data/services";
import {
  adminServiceInputFromFormData,
  validateAdminService,
  type AdminServiceState,
} from "@/lib/validation/adminService";

export async function createServiceAction(
  _prevState: AdminServiceState,
  formData: FormData,
): Promise<AdminServiceState> {
  const input = adminServiceInputFromFormData(formData);
  const result = validateAdminService(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  try {
    await createService(result.data);
  } catch {
    return {
      status: "error",
      message: "Nao foi possivel salvar o servico agora. Tente novamente.",
      errors: {},
    };
  }

  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
  redirect("/admin/servicos");
}

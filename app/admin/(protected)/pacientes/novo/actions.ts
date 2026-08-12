"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPatient } from "@/lib/data/patients";
import {
  adminPatientInputFromFormData,
  validateAdminPatient,
  type AdminPatientState,
} from "@/lib/validation/adminPatient";

export async function createPatientAction(
  _prevState: AdminPatientState,
  formData: FormData,
): Promise<AdminPatientState> {
  const input = adminPatientInputFromFormData(formData);
  const result = validateAdminPatient(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  try {
    await createPatient(result.data);
  } catch {
    return {
      status: "error",
      message: "Nao foi possivel salvar o paciente agora. Tente novamente.",
      errors: {},
    };
  }

  revalidatePath("/admin/pacientes");
  redirect("/admin/pacientes");
}

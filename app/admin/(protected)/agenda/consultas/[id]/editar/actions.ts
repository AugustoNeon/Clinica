"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAppointment, updateAppointment } from "@/lib/data/appointments";
import {
  adminAppointmentInputFromFormData,
  adminAppointmentStatusSchema,
  validateAdminAppointment,
  type AdminAppointmentState,
} from "@/lib/validation/adminAppointment";

export async function updateAppointmentAction(
  id: string,
  _prevState: AdminAppointmentState,
  formData: FormData,
): Promise<AdminAppointmentState> {
  const input = adminAppointmentInputFromFormData(formData);
  const result = validateAdminAppointment(input);
  const statusResult = adminAppointmentStatusSchema.safeParse(formData.get("status"));

  if (!result.success || !statusResult.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.success ? {} : result.errors,
    };
  }

  try {
    await updateAppointment(id, result.data, statusResult.data);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Ja existe uma consulta")) {
      return { status: "error", message: error.message, errors: {} };
    }
    console.error("Falha ao atualizar consulta:", error);
    return {
      status: "error",
      message: "Nao foi possivel salvar a consulta agora. Tente novamente.",
      errors: {},
    };
  }

  revalidatePath("/admin/agenda");
  redirect("/admin/agenda");
}

export async function deleteAppointmentAction(id: string): Promise<void> {
  await deleteAppointment(id);
  revalidatePath("/admin/agenda");
  redirect("/admin/agenda");
}

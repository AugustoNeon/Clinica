"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAppointment } from "@/lib/data/appointments";
import {
  adminAppointmentInputFromFormData,
  validateAdminAppointment,
  type AdminAppointmentState,
} from "@/lib/validation/adminAppointment";

export async function createAppointmentAction(
  _prevState: AdminAppointmentState,
  formData: FormData,
): Promise<AdminAppointmentState> {
  const input = adminAppointmentInputFromFormData(formData);
  const result = validateAdminAppointment(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  try {
    await createAppointment(result.data);
  } catch (error) {
    // Mensagem de conflito de horario e pensada pro usuario ver
    // (validacao de negocio, nao erro de sistema) — outros erros inesperados
    // ficam so no log do servidor, sem detalhe tecnico exposto na tela.
    if (error instanceof Error && error.message.startsWith("Ja existe uma consulta")) {
      return { status: "error", message: error.message, errors: {} };
    }
    console.error("Falha ao criar consulta:", error);
    return {
      status: "error",
      message: "Nao foi possivel salvar a consulta agora. Tente novamente.",
      errors: {},
    };
  }

  revalidatePath("/admin/agenda");
  redirect("/admin/agenda");
}

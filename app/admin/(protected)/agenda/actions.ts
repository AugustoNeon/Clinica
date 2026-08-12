"use server";

import { revalidatePath } from "next/cache";
import { toggleScheduleException } from "@/lib/data/scheduleExceptions";
import { adminScheduleExceptionDateSchema } from "@/lib/validation/adminScheduleException";
import { cancelAppointment } from "@/lib/data/appointments";

export async function toggleScheduleExceptionAction(date: string): Promise<void> {
  const parsed = adminScheduleExceptionDateSchema.safeParse(date);
  if (!parsed.success) return;

  await toggleScheduleException(parsed.data);
  revalidatePath("/admin/agenda");
}

/** Cancelamento rapido direto da lista, sem abrir a tela de edicao inteira. */
export async function cancelAppointmentAction(id: string): Promise<void> {
  await cancelAppointment(id);
  revalidatePath("/admin/agenda");
}

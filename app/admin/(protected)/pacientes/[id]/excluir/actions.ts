"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deletePatient } from "@/lib/data/patients";

export async function confirmDeletePatientAction(id: string): Promise<void> {
  await deletePatient(id);
  revalidatePath("/admin/pacientes");
  revalidatePath("/admin/agenda");
  redirect("/admin/pacientes");
}

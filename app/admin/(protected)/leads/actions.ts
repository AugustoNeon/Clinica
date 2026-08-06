"use server";

import { revalidatePath } from "next/cache";
import { updateLeadStatus } from "@/lib/data/leads";
import { adminLeadStatusSchema } from "@/lib/validation/adminLead";

export async function updateLeadStatusAction(id: string, formData: FormData): Promise<void> {
  const parsed = adminLeadStatusSchema.safeParse(formData.get("status"));
  if (!parsed.success) return;

  await updateLeadStatus(id, parsed.data);
  revalidatePath("/admin/leads");
}

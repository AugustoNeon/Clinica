"use server";

import { revalidatePath } from "next/cache";
import { toggleScheduleException } from "@/lib/data/scheduleExceptions";
import { adminScheduleExceptionDateSchema } from "@/lib/validation/adminScheduleException";

export async function toggleScheduleExceptionAction(date: string): Promise<void> {
  const parsed = adminScheduleExceptionDateSchema.safeParse(date);
  if (!parsed.success) return;

  await toggleScheduleException(parsed.data);
  revalidatePath("/admin/agenda");
}

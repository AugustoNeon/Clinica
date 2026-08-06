"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteTestimonial, updateTestimonial } from "@/lib/data/testimonials";
import {
  adminTestimonialInputFromFormData,
  validateAdminTestimonial,
  type AdminTestimonialState,
} from "@/lib/validation/adminTestimonial";

export async function updateTestimonialAction(
  id: string,
  _prevState: AdminTestimonialState,
  formData: FormData,
): Promise<AdminTestimonialState> {
  const input = adminTestimonialInputFromFormData(formData);
  const result = validateAdminTestimonial(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  try {
    await updateTestimonial(id, result.data);
  } catch {
    return {
      status: "error",
      message: "Nao foi possivel salvar o depoimento agora. Tente novamente.",
      errors: {},
    };
  }

  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
  redirect("/admin/depoimentos");
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  await deleteTestimonial(id);
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
  redirect("/admin/depoimentos");
}

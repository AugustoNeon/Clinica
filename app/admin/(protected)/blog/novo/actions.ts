"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createBlogPost } from "@/lib/data/blogPosts";
import {
  adminBlogPostInputFromFormData,
  validateAdminBlogPost,
  type AdminBlogPostState,
} from "@/lib/validation/adminBlogPost";

export async function createBlogPostAction(
  _prevState: AdminBlogPostState,
  formData: FormData,
): Promise<AdminBlogPostState> {
  const input = adminBlogPostInputFromFormData(formData);
  const result = validateAdminBlogPost(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  try {
    await createBlogPost(result.data);
  } catch {
    return {
      status: "error",
      message: "Nao foi possivel salvar o post agora. Tente novamente.",
      errors: {},
    };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

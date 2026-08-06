import { z } from "zod";

/**
 * Schema do formulario de post de blog no painel admin — mesmo padrao de
 * `lib/validation/adminService.ts` (fonte unica cliente+servidor).
 *
 * `author_id` e `published_at` NAO fazem parte deste schema: sao
 * calculados em `lib/data/blogPosts.ts` (usuario logado e status),
 * nunca vem de input do formulario.
 */

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const blogPostStatusValues = ["draft", "published", "archived"] as const;

export const adminBlogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Informe o slug.")
    .max(120, "Slug muito longo.")
    .regex(slugPattern, "Use apenas letras minusculas, numeros e hifen (ex.: dica-de-higiene)."),
  title: z.string().trim().min(1, "Informe o titulo.").max(190, "Titulo muito longo."),
  content: z.string().trim().min(1, "Informe o conteudo.").max(20000, "Conteudo muito extenso."),
  cover_image_url: z
    .string()
    .trim()
    .max(500, "URL muito longa.")
    .refine((value) => value === "" || z.url().safeParse(value).success, "URL invalida.")
    .transform((value) => (value === "" ? null : value)),
  status: z.enum(blogPostStatusValues, "Status invalido."),
});

export type AdminBlogPostValues = z.infer<typeof adminBlogPostSchema>;

export type AdminBlogPostInput = {
  slug: string;
  title: string;
  content: string;
  cover_image_url: string;
  status: string;
};

export type AdminBlogPostFieldErrors = Partial<Record<keyof AdminBlogPostInput, string>>;

export interface AdminBlogPostState {
  status: "idle" | "error";
  message: string;
  errors: AdminBlogPostFieldErrors;
}

export const initialAdminBlogPostState: AdminBlogPostState = {
  status: "idle",
  message: "",
  errors: {},
};

export function validateAdminBlogPost(
  input: AdminBlogPostInput,
):
  | { success: true; data: AdminBlogPostValues }
  | { success: false; errors: AdminBlogPostFieldErrors } {
  const parsed = adminBlogPostSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: AdminBlogPostFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof AdminBlogPostInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

export function adminBlogPostInputFromFormData(formData: FormData): AdminBlogPostInput {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    slug: read("slug"),
    title: read("title"),
    content: read("content"),
    cover_image_url: read("cover_image_url"),
    status: read("status"),
  };
}

import { z } from "zod";

/**
 * Schema do formulario de membro de equipe no painel admin — mesmo padrao
 * de `lib/validation/adminService.ts` (fonte unica cliente+servidor).
 */

export const adminTeamMemberSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(120, "Nome muito longo."),
  role: z.string().trim().min(1, "Informe o cargo.").max(120, "Cargo muito longo."),
  cro_number: z
    .string()
    .trim()
    .max(50, "Numero de CRO muito longo.")
    .transform((value) => (value === "" ? null : value)),
  bio: z.string().trim().min(1, "Informe a bio.").max(4000, "Bio muito extensa."),
  photo_url: z
    .string()
    .trim()
    .max(500, "URL muito longa.")
    .refine((value) => value === "" || z.url().safeParse(value).success, "URL invalida.")
    .transform((value) => (value === "" ? null : value)),
  order: z.coerce.number().int("Ordem precisa ser um numero inteiro.").min(0, "Ordem nao pode ser negativa."),
  published: z.boolean(),
});

export type AdminTeamMemberValues = z.infer<typeof adminTeamMemberSchema>;

export type AdminTeamMemberInput = {
  name: string;
  role: string;
  cro_number: string;
  bio: string;
  photo_url: string;
  order: string;
  published: boolean;
};

export type AdminTeamMemberFieldErrors = Partial<Record<keyof AdminTeamMemberInput, string>>;

export interface AdminTeamMemberState {
  status: "idle" | "error";
  message: string;
  errors: AdminTeamMemberFieldErrors;
}

export const initialAdminTeamMemberState: AdminTeamMemberState = {
  status: "idle",
  message: "",
  errors: {},
};

export function validateAdminTeamMember(
  input: AdminTeamMemberInput,
):
  | { success: true; data: AdminTeamMemberValues }
  | { success: false; errors: AdminTeamMemberFieldErrors } {
  const parsed = adminTeamMemberSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: AdminTeamMemberFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof AdminTeamMemberInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

export function adminTeamMemberInputFromFormData(formData: FormData): AdminTeamMemberInput {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    name: read("name"),
    role: read("role"),
    cro_number: read("cro_number"),
    bio: read("bio"),
    photo_url: read("photo_url"),
    order: read("order"),
    published: formData.get("published") === "on",
  };
}

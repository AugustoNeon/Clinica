"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteTeamMember, updateTeamMember } from "@/lib/data/team";
import {
  adminTeamMemberInputFromFormData,
  validateAdminTeamMember,
  type AdminTeamMemberState,
} from "@/lib/validation/adminTeamMember";

export async function updateTeamMemberAction(
  id: string,
  _prevState: AdminTeamMemberState,
  formData: FormData,
): Promise<AdminTeamMemberState> {
  const input = adminTeamMemberInputFromFormData(formData);
  const result = validateAdminTeamMember(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  try {
    await updateTeamMember(id, result.data);
  } catch {
    return {
      status: "error",
      message: "Nao foi possivel salvar o membro agora. Tente novamente.",
      errors: {},
    };
  }

  revalidatePath("/admin/equipe");
  revalidatePath("/equipe");
  redirect("/admin/equipe");
}

export async function deleteTeamMemberAction(id: string): Promise<void> {
  await deleteTeamMember(id);
  revalidatePath("/admin/equipe");
  revalidatePath("/equipe");
  redirect("/admin/equipe");
}

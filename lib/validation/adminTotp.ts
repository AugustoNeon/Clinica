import { z } from "zod";

/** Schema do codigo de 6 digitos do autenticador (issue #47) - usado no desafio de login e na confirmacao de cadastro. */
export const adminTotpCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Digite os 6 numeros do aplicativo autenticador."),
});

export type AdminTotpCodeInput = { code: string };

export interface AdminTotpCodeState {
  status: "idle" | "success" | "error";
  message: string;
  errors: { code?: string };
}

export const initialAdminTotpCodeState: AdminTotpCodeState = {
  status: "idle",
  message: "",
  errors: {},
};

export function adminTotpCodeInputFromFormData(formData: FormData): AdminTotpCodeInput {
  return { code: String(formData.get("code") ?? "") };
}

export function validateAdminTotpCode(
  input: AdminTotpCodeInput,
):
  | { success: true; data: AdminTotpCodeInput }
  | { success: false; errors: { code?: string } } {
  const result = adminTotpCodeSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const errors: { code?: string } = {};
  for (const issue of result.error.issues) {
    if (issue.path[0] === "code") errors.code = issue.message;
  }
  return { success: false, errors };
}

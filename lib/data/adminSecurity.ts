import { getSupabaseServerComponentClient } from "@/lib/supabase/server";

/**
 * Dado de MFA do usuario admin (issue #47), guardado em `user_metadata`
 * do proprio Supabase Auth - sem tabela nova. Atualizado via
 * `auth.updateUser({ data })`, que o Supabase permite o usuario logado
 * fazer na PROPRIA conta sem precisar de `service_role` - nao e
 * `lib/data/*` tocando o service_role admin client.
 *
 * NUNCA logar `totp_secret` (e a chave que gera o codigo de 2FA - vazar
 * isso e o mesmo que vazar a senha do segundo fator).
 */

interface TotpMetadata {
  totp_secret?: string | null;
  totp_enabled?: boolean;
}

export async function getTotpStatus(): Promise<{ enabled: boolean; email: string } | null> {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const meta = user.user_metadata as TotpMetadata;
  return { enabled: Boolean(meta.totp_enabled), email: user.email };
}

/** So o proprio Server Action de verificacao (login/middleware) le o secret - nunca exposto a nenhuma pagina. */
export async function getTotpSecretForCurrentUser(): Promise<
  { secret: string; email: string } | null
> {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const meta = user.user_metadata as TotpMetadata;
  if (!meta.totp_enabled || !meta.totp_secret) return null;
  return { secret: meta.totp_secret, email: user.email };
}

export async function saveTotpSecret(secretBase32: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.auth.updateUser({
    data: { totp_secret: secretBase32, totp_enabled: true } satisfies TotpMetadata,
  });
  if (error) throw new Error(`Falha ao salvar TOTP: ${error.message}`);
}

export async function disableTotp(): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.auth.updateUser({
    data: { totp_secret: null, totp_enabled: false } satisfies TotpMetadata,
  });
  if (error) throw new Error(`Falha ao desativar TOTP: ${error.message}`);
}

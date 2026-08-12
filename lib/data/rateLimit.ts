import { getSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Rate limiting do formulario de contato publico (issue #51).
 *
 * Contador por IP com janela deslizante simples, guardado em
 * `contact_rate_limits` (migration 0014) via `service_role` -- mesmo
 * padrao de `contact_leads`, sem policy de RLS para anon/authenticated.
 * Contador em memoria NAO serve aqui: o Worker roda em varias instancias
 * de borda, nao compartilha estado local (decisao ja registrada no
 * comentario antigo de `app/contato/actions.ts`).
 *
 * NUNCA guarda o IP em texto puro -- so o hash (`hashIp`). E bookkeeping
 * de limite, nao precisa do dado bruto.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_SUBMISSIONS_PER_WINDOW = 5;

/** SHA-256 do IP, hex. Sem salt: e limite de taxa, nao controle de acesso -- reversibilidade nao e a ameaca que importa aqui. */
export async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * `true` se o IP (ja em hash) estourou o limite de submissoes na janela
 * atual. Efeito colateral: registra a tentativa (cria ou incrementa a
 * linha) sempre que chamada -- chamar uma vez por submissao real.
 */
export async function isRateLimited(ipHash: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { data: existing, error: selectError } = await supabase
    .from("contact_rate_limits")
    .select("window_start, count")
    .eq("ip_hash", ipHash)
    .maybeSingle();

  if (selectError) throw new Error(`Falha ao checar rate limit: ${selectError.message}`);

  const now = Date.now();
  const windowExpired =
    !existing || now - new Date(existing.window_start as string).getTime() > WINDOW_MS;

  if (windowExpired) {
    const { error: upsertError } = await supabase
      .from("contact_rate_limits")
      .upsert({ ip_hash: ipHash, window_start: new Date(now).toISOString(), count: 1 });
    if (upsertError) throw new Error(`Falha ao registrar rate limit: ${upsertError.message}`);
    return false;
  }

  const nextCount = (existing.count as number) + 1;
  if (nextCount > MAX_SUBMISSIONS_PER_WINDOW) return true;

  const { error: updateError } = await supabase
    .from("contact_rate_limits")
    .update({ count: nextCount })
    .eq("ip_hash", ipHash);
  if (updateError) throw new Error(`Falha ao incrementar rate limit: ${updateError.message}`);

  return false;
}

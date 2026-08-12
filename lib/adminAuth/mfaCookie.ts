/**
 * Assinatura do cookie "MFA verificado nesta sessao" (issue #47).
 *
 * Sem env var nova de proposito: a CHAVE de assinatura e o proprio
 * `totp_secret` do usuario (guardado em `user_metadata` do Supabase
 * Auth, ver `lib/data/adminSecurity.ts`) - ja e um segredo por usuario
 * que so o servidor conhece, e se o TOTP for desativado/trocado o
 * segredo muda, invalidando sozinho qualquer cookie assinado com o
 * valor antigo. Web Crypto (`crypto.subtle`) funciona tanto no
 * middleware (edge) quanto em Server Actions (Node 20+), sem lib extra.
 *
 * O valor assinado inclui `sessionStartedValue` (cookie separado, ver
 * `constants.ts`): um novo login reseta esse cookie, o que invalida
 * automaticamente qualquer cookie de MFA de uma sessao anterior.
 */

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function signMfaCookie(
  totpSecret: string,
  sessionStartedValue: string,
): Promise<string> {
  return hmacSha256Hex(totpSecret, sessionStartedValue);
}

export async function verifyMfaCookie(
  totpSecret: string,
  sessionStartedValue: string,
  cookieValue: string | undefined,
): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await hmacSha256Hex(totpSecret, sessionStartedValue);
  return expected === cookieValue;
}

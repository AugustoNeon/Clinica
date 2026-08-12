import "server-only";
import { TOTP, Secret } from "otpauth";
import QRCode from "qrcode";

/**
 * TOTP proprio (issue #47) - alternativa ao MFA do Supabase Auth, que
 * exige plano Pro (confirmado no dashboard em 2026-08-12). Mesmo
 * algoritmo do Google Authenticator/Authy (RFC 6238), biblioteca
 * `otpauth` (Web Crypto, sem dependencia de Node puro).
 */

const ISSUER = "Clinica Ariane Vaz Storrer";

function buildTotp(secretBase32: string, label: string): TOTP {
  return new TOTP({
    issuer: ISSUER,
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secretBase32),
  });
}

/** Gera um segredo novo (ainda nao salvo) + QR code pra escanear no app autenticador. */
export async function generateTotpEnrollment(
  email: string,
): Promise<{ secretBase32: string; qrDataUrl: string }> {
  const secret = new Secret({ size: 20 });
  const totp = buildTotp(secret.base32, email);
  const qrDataUrl = await QRCode.toDataURL(totp.toString());
  return { secretBase32: secret.base32, qrDataUrl };
}

/** `true` se o codigo de 6 digitos bate com o segredo, com 1 passo de tolerancia (~30s) pra clock drift. */
export function verifyTotpCode(secretBase32: string, code: string, email: string): boolean {
  const totp = buildTotp(secretBase32, email);
  return totp.validate({ token: code.trim(), window: 1 }) !== null;
}

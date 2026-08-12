/**
 * Constantes de sessao e MFA do painel admin (issue #47).
 *
 * Sem "server-only": lido tanto por `lib/supabase/middleware.ts` (edge)
 * quanto por Server Actions (Node) - so constantes, nada de segredo aqui.
 */

export const SESSION_STARTED_COOKIE = "admin_session_started";
export const LAST_ACTIVITY_COOKIE = "admin_last_activity";
export const MFA_VERIFIED_COOKIE = "admin_mfa_verified";

/** Forca novo login se o usuario ficar este tempo sem interagir com o painel. */
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 min

/** Forca novo login mesmo com atividade continua, depois deste prazo. */
export const SESSION_TIMEBOX_MS = 12 * 60 * 60 * 1000; // 12h

const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/admin",
};

export function sessionCookieOptions() {
  return { ...COOKIE_BASE_OPTIONS, maxAge: SESSION_TIMEBOX_MS / 1000 };
}

export function mfaCookieOptions() {
  return { ...COOKIE_BASE_OPTIONS, maxAge: SESSION_TIMEBOX_MS / 1000 };
}

import { NextResponse } from "next/server";
import { buildGoogleAuthorizationUrl } from "@/lib/data/googleCalendar";

/**
 * Route Handler (Fase C, issue #36) — dispara o fluxo OAuth do Google.
 * Nao pode ser Server Action: o resultado e um REDIRECT HTTP pro dominio
 * do Google, nao uma mutation com FormData.
 *
 * `state` aleatorio guardado num cookie httpOnly de curta duracao —
 * validado no callback pra evitar CSRF (alguem forjar um `code` de outra
 * sessao). `secure` segue o protocolo da propria request: `false` em
 * `http://localhost:3000` (dev), `true` em producao — cookie `Secure` e
 * silenciosamente ignorado por HTTP puro, quebraria o fluxo em dev se
 * fixo em `true`.
 */
const STATE_COOKIE = "google_oauth_state";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const state = crypto.randomUUID();
  const redirectUri = new URL("/admin/agenda/google/callback", requestUrl).toString();
  const authorizationUrl = buildGoogleAuthorizationUrl(redirectUri, state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: requestUrl.protocol === "https:",
    sameSite: "lax",
    maxAge: 600,
    path: "/admin/agenda/google",
  });
  return response;
}

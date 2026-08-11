import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveTokensFromAuthorizationCode } from "@/lib/data/googleCalendar";

/**
 * Route Handler (Fase C, issue #36) — recebe o `code`/`state` do Google
 * via querystring (nao da pra ser Server Action, que so recebe FormData) e
 * troca por token. `state` precisa bater com o cookie setado em
 * `.../conectar` (CSRF); cookie e de uso unico, sempre apagado no fim.
 * Redireciona de volta pra `/admin/agenda?google=conectado|erro` — a tela
 * mostra a mensagem correspondente.
 */
const STATE_COOKIE = "google_oauth_state";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;

  const redirectTarget = new URL("/admin/agenda", requestUrl);

  if (!code || !state || !expectedState || state !== expectedState) {
    redirectTarget.searchParams.set("google", "erro");
    const response = NextResponse.redirect(redirectTarget);
    response.cookies.delete(STATE_COOKIE);
    return response;
  }

  const redirectUri = new URL("/admin/agenda/google/callback", requestUrl).toString();

  try {
    await saveTokensFromAuthorizationCode(code, redirectUri);
    redirectTarget.searchParams.set("google", "conectado");
  } catch (error) {
    // Log estruturado do lado do servidor (nunca o `code`/token na mensagem
    // exibida ao usuario) -- sem isso, uma falha na troca com o Google fica
    // sem diagnostico nenhum.
    console.error("Falha ao trocar code por token do Google:", error);
    redirectTarget.searchParams.set("google", "erro");
  }

  const response = NextResponse.redirect(redirectTarget);
  response.cookies.delete(STATE_COOKIE);
  return response;
}

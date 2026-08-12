import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_STARTED_COOKIE,
  LAST_ACTIVITY_COOKIE,
  MFA_VERIFIED_COOKIE,
  INACTIVITY_TIMEOUT_MS,
  SESSION_TIMEBOX_MS,
  sessionCookieOptions,
} from "@/lib/adminAuth/constants";
import { verifyMfaCookie } from "@/lib/adminAuth/mfaCookie";

/**
 * Atualiza a sessao do Supabase dentro do middleware e protege `/admin`.
 *
 * Usa `getUser()`, NUNCA `getSession()`, aqui: `getSession()` so le o
 * cookie sem validar contra o servidor Supabase, o que aceitaria um
 * cookie adulterado. `getUser()` valida o JWT de verdade a cada request
 * (guia oficial de SSR do Supabase para App Router).
 *
 * Variaveis de ambiente ausentes (ex.: CI de outra branch, build sem
 * `.env.local`) fazem o middleware deixar a request passar sem checar
 * auth, em vez de quebrar toda rota do site — a pagina/layout do admin
 * tem sua propria checagem redundante como rede de seguranca.
 *
 * ISSUE #47 (timeout de sessao + MFA): alternativa sem Supabase Pro
 * (dashboard confirmou que MFA e timeout de sessao nativos exigem Pro).
 * Timeout: cookies `admin_session_started`/`admin_last_activity`
 * proprios, checados a cada request. MFA: `user.user_metadata` ja vem
 * de `getUser()` sem custo extra de rede - se `totp_enabled`, exige
 * cookie assinado (`admin_mfa_verified`) valido pra liberar `/admin/*`
 * alem de `/admin/mfa`.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const isMfaRoute = pathname === "/admin/mfa";
  const isLogoutRoute = pathname === "/admin/logout";

  if (isAdminRoute && !isLoginRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminRoute && !isLoginRoute && !isLogoutRoute && user) {
    const now = Date.now();
    const sessionStarted = request.cookies.get(SESSION_STARTED_COOKIE)?.value;
    const lastActivity = request.cookies.get(LAST_ACTIVITY_COOKIE)?.value;

    const timedOut =
      (sessionStarted && now - Number(sessionStarted) > SESSION_TIMEBOX_MS) ||
      (lastActivity && now - Number(lastActivity) > INACTIVITY_TIMEOUT_MS);

    if (timedOut) {
      await supabase.auth.signOut();
      const redirectResponse = NextResponse.redirect(new URL("/admin/login", request.url));
      for (const name of [SESSION_STARTED_COOKIE, LAST_ACTIVITY_COOKIE, MFA_VERIFIED_COOKIE]) {
        redirectResponse.cookies.delete({ name, path: "/admin" });
      }
      return redirectResponse;
    }

    // Sessao sem `session_started` (ex.: login anterior a este deploy) -
    // comeca a contar a partir de agora em vez de forcar logout imediato.
    const effectiveSessionStarted = sessionStarted ?? String(now);
    if (!sessionStarted) {
      response.cookies.set(SESSION_STARTED_COOKIE, effectiveSessionStarted, sessionCookieOptions());
    }
    response.cookies.set(LAST_ACTIVITY_COOKIE, String(now), sessionCookieOptions());

    const totpEnabled = Boolean((user.user_metadata as { totp_enabled?: boolean }).totp_enabled);
    const totpSecret = (user.user_metadata as { totp_secret?: string }).totp_secret;

    if (totpEnabled && totpSecret && !isMfaRoute) {
      const mfaCookie = request.cookies.get(MFA_VERIFIED_COOKIE)?.value;
      const mfaValid = await verifyMfaCookie(totpSecret, effectiveSessionStarted, mfaCookie);
      if (!mfaValid) {
        const mfaUrl = new URL("/admin/mfa", request.url);
        mfaUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(mfaUrl);
      }
    }
  }

  return response;
}

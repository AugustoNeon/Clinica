import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

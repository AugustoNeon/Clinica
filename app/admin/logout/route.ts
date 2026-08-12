import { NextResponse } from "next/server";
import { getSupabaseServerComponentClient } from "@/lib/supabase/server";
import {
  SESSION_STARTED_COOKIE,
  LAST_ACTIVITY_COOKIE,
  MFA_VERIFIED_COOKIE,
} from "@/lib/adminAuth/constants";

/**
 * Encerra a sessao do admin (Fase 5 PR2, issue #18).
 *
 * Route Handler (nao Server Action) porque e disparado por um POST de
 * formulario simples no layout do admin, sem precisar de client component.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServerComponentClient();
  await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  // Limpa os cookies de sessao/MFA do issue #47 - senao um login novo
  // herdaria o "inicio de sessao" do login anterior.
  for (const name of [SESSION_STARTED_COOKIE, LAST_ACTIVITY_COOKIE, MFA_VERIFIED_COOKIE]) {
    response.cookies.delete({ name, path: "/admin" });
  }
  return response;
}

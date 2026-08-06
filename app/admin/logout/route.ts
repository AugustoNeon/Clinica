import { NextResponse } from "next/server";
import { getSupabaseServerComponentClient } from "@/lib/supabase/server";

/**
 * Encerra a sessao do admin (Fase 5 PR2, issue #18).
 *
 * Route Handler (nao Server Action) porque e disparado por um POST de
 * formulario simples no layout do admin, sem precisar de client component.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServerComponentClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

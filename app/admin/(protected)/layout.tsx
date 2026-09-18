import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getLeads } from "@/lib/data/leads";
import { getSupabaseServerComponentClient } from "@/lib/supabase/server";

/**
 * Shell das rotas autenticadas de `/admin` (Fase 5 PR2, issue #18; barra
 * lateral desde a issue #67).
 *
 * Route group `(protected)` para nao envolver `/admin/login` — se
 * envolvesse, o redirect abaixo criaria loop (login redirecionando pra si
 * mesmo). O middleware ja bloqueia acesso nao-autenticado antes de chegar
 * aqui; esta checagem e rede de seguranca redundante (Server Component
 * renderiza independente do middleware em alguns caminhos de cache/RSC).
 *
 * O contador de mensagens novas na navegacao vem de `getLeads()` — dado
 * pessoal fica no servidor; so o NUMERO desce para o componente de cliente.
 */
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const leads = await getLeads().catch(() => []);
  const newLeads = leads.filter((lead) => lead.status === "novo").length;

  return (
    <div className="flex min-h-full flex-1 flex-col lg:pl-64">
      <AdminSidebar email={user.email ?? ""} badges={{ "/admin/leads": newLeads }} />
      <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}

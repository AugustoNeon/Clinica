import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSupabaseServerComponentClient } from "@/lib/supabase/server";

/** Secoes do painel — usado tanto na nav do header quanto no dashboard-inicio (`page.tsx`). */
export const adminSections = [
  { href: "/admin/servicos", label: "Serviços" },
  { href: "/admin/equipe", label: "Equipe" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/depoimentos", label: "Depoimentos" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/configuracoes", label: "Configurações" },
  { href: "/admin/leads", label: "Mensagens recebidas" },
];

/**
 * Shell das rotas autenticadas de `/admin` (Fase 5 PR2, issue #18).
 *
 * Route group `(protected)` para nao envolver `/admin/login` — se
 * envolvesse, o redirect abaixo criaria loop (login redirecionando pra si
 * mesmo). O middleware ja bloqueia acesso nao-autenticado antes de chegar
 * aqui; esta checagem e rede de seguranca redundante (Server Component
 * renderiza independente do middleware em alguns caminhos de cache/RSC).
 */
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[70vh]">
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/admin" className="text-sm font-medium">
            Painel administrativo
          </Link>
          <nav aria-label="Navegação do painel">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {adminSections.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="opacity-80 hover:opacity-100 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <span className="opacity-70">{user.email}</span>
            <form action="/admin/logout" method="post">
              <button type="submit" className="underline underline-offset-2">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

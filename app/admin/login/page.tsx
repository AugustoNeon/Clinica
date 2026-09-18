import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdminLoginForm } from "@/components/sections/AdminLoginForm";
import { IconArrowLeft } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

/**
 * Tela de login. Quem ja esta autenticado nao chega aqui: o middleware
 * (`lib/supabase/middleware.ts`) redireciona `/admin/login` para `/admin`
 * quando ha sessao valida.
 *
 * Camada rica (issue #71): tela dividida — painel de marca a esquerda
 * (azul profundo, textura, tagline e a foto real da doutora) e o
 * formulario a direita. Nao consulta o banco de proposito: login precisa
 * abrir mesmo com o Supabase fora, entao a tagline aqui e a confirmada
 * pela cliente, fixa.
 */
export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative overflow-hidden bg-blue-deep text-white">
        <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-dark/80 blur-3xl"
        />
        <div className="relative flex h-full flex-col px-6 py-8 sm:px-10 lg:py-12">
          <Image
            src="/images/logo/logo-horizontal-white.png"
            alt="Dra. Ariane Vaz Storrer"
            width={1600}
            height={480}
            priority
            className="h-10 w-auto self-start"
          />
          <div className="mt-10 max-w-md lg:mt-auto">
            <p className="font-display text-3xl font-medium leading-tight sm:text-4xl">
              Te ajudo a sorrir com confiança
            </p>
            <svg aria-hidden viewBox="0 0 240 40" className="mt-3 h-5 w-36 text-terracotta-soft" fill="none">
              <path
                className="smile-arc"
                d="M8 8c40 34 184 34 224 0"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                pathLength={1}
              />
            </svg>
            <p className="mt-5 text-base leading-relaxed text-white/85">
              Painel da clínica: agenda, pacientes, mensagens e o conteúdo do
              site, tudo num lugar só.
            </p>
          </div>
          <div className="relative mx-auto mt-10 hidden w-64 lg:block lg:self-end">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px]">
              <Image
                src="/images/team/ariane-04-jaleco-retrato.jpg"
                alt=""
                fill
                sizes="16rem"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-semibold">Entrar no painel</h1>
            <p className="mt-1 text-sm text-ink-muted">Use o e-mail e a senha da conta administradora.</p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-surface p-6 shadow-lg shadow-blue-deep/10 sm:p-8">
            <AdminLoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-ink-muted">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-medium text-blue-dark underline-offset-4 hover:underline"
            >
              <IconArrowLeft width={16} height={16} />
              Voltar ao site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

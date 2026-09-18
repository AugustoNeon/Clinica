"use client";

import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary das páginas públicas. Substitui a tela crua do Next
 * ("This page couldn't load", em inglês, sem marca) por uma com o menu do
 * site, botão de tentar de novo e o código do erro (`digest`) para a pessoa
 * informar ao suporte (issue #60).
 *
 * Caso real que motivou: banco pausado (plano gratuito do Supabase) em
 * 2026-09-18 derrubou todas as páginas com esse erro genérico.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Container className="py-20 sm:py-28">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Não conseguimos carregar esta página
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          Pode ser uma instabilidade momentânea. Tente de novo em alguns
          segundos. Se continuar assim, fale com a clínica pelo telefone ou
          WhatsApp — o atendimento não depende do site.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            Tentar de novo
          </Button>
          <Link href="/" className={buttonClasses("secondary")}>
            Voltar ao início
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs text-ink-muted">
            Código do erro para o suporte: <code>{error.digest}</code>
          </p>
        )}
      </div>
    </Container>
  );
}

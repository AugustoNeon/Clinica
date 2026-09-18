import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404 com a cara do site (antes era a tela padrão do Next, sem menu nem
 * marca). Não consulta o banco de propósito: página de erro precisa
 * renderizar mesmo quando o resto está fora do ar.
 */
export default function NotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="max-w-xl">
        <p className="font-display text-7xl font-semibold leading-none text-blue sm:text-8xl">
          404
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Essa página não existe
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          O endereço pode ter mudado ou ter sido digitado errado. O que você
          procura provavelmente está em uma das páginas abaixo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={buttonClasses("primary")}>
            Voltar ao início
          </Link>
          <Link href="/servicos" className={buttonClasses("secondary")}>
            Ver serviços
          </Link>
          <Link href="/contato" className={buttonClasses("secondary")}>
            Falar com a clínica
          </Link>
        </div>
      </div>
    </Container>
  );
}

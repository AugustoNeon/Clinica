import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Conteudo da pagina 404, compartilhado entre `app/not-found.tsx` (URL que
 * nao bate com rota nenhuma, renderizada so no layout raiz) e
 * `app/(site)/not-found.tsx` (`notFound()` dentro do site, ja com chrome).
 * Nao consulta o banco de proposito: pagina de erro precisa renderizar
 * mesmo quando o resto esta fora do ar.
 */
export function NotFoundContent() {
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

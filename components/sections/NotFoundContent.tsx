import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconTooth } from "@/components/ui/serviceIcons";

/**
 * Conteudo da pagina 404, compartilhado entre `app/not-found.tsx` (URL que
 * nao bate com rota nenhuma, renderizada so no layout raiz) e
 * `app/(site)/not-found.tsx` (`notFound()` dentro do site, ja com chrome).
 * Nao consulta o banco de proposito: pagina de erro precisa renderizar
 * mesmo quando o resto esta fora do ar.
 */
export function NotFoundContent() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pattern-arcs-blue pointer-events-none absolute inset-0" />
      <Container className="relative grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="max-w-xl">
          <p className="font-display text-7xl font-semibold leading-none text-blue sm:text-8xl lg:text-9xl">
            404
          </p>
          <svg aria-hidden viewBox="0 0 240 40" className="mt-2 h-6 w-40 text-terracotta" fill="none">
            <path
              className="smile-arc"
              d="M8 8c40 34 184 34 224 0"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1}
            />
          </svg>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Essa página não existe
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
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
        <div aria-hidden className="float hidden justify-center lg:flex">
          <span className="inline-flex h-56 w-56 items-center justify-center rounded-full bg-surface-tint text-blue">
            <IconTooth width={140} height={140} strokeWidth={1.25} />
          </span>
        </div>
      </Container>
    </div>
  );
}

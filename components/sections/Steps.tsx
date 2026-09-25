import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconWhatsApp } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface StepsProps {
  whatsapp: string;
}

const STEPS = [
  {
    title: "Você entra em contato",
    text: "Pelo WhatsApp, pelo telefone ou pelo formulário do site. Conte o que está sentindo ou o que gostaria de mudar. Não precisa saber o nome do procedimento.",
  },
  {
    title: "Avaliação no consultório",
    text: "Conversa sobre a queixa, exame clínico e, se necessário, exames de imagem. É aqui que se descobre o que realmente precisa ser feito.",
  },
  {
    title: "Plano de tratamento",
    text: "Você recebe as etapas propostas, explicadas uma a uma, e tira todas as dúvidas antes de decidir. Nada começa sem você entender o caminho.",
  },
];

/**
 * "Sua primeira consulta": sequencia real de 3 passos — por isso a
 * numeracao existe (o numero carrega informacao de ordem, nao e enfeite
 * de secao). Texto generico do processo de consulta, sem prazo ou preco.
 *
 * Camada rica (issue #71): os tres passos ficam sobre o arco do sorriso —
 * o do meio desce um pouco e um traco terracota liga os tres numeros,
 * desenhando-se conforme a secao entra na tela. A composicao e a curva do
 * logo, nao uma linha do tempo generica.
 */
export function Steps({ whatsapp }: StepsProps) {
  const whatsappHref = buildWhatsAppUrl(whatsapp, "Olá! Gostaria de agendar uma primeira consulta.");

  return (
    <section className="relative overflow-hidden bg-terracotta-tint py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold sm:text-5xl">Como funciona a primeira consulta</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            Três passos. Você chega sabendo o que esperar e sai sabendo o que vem
            depois.
          </p>
        </div>

        <div className="relative mt-14 lg:mt-16">
          {/* O arco que liga os passos: so a partir de `md`, quando os tres ficam lado a lado. */}
          <svg
            aria-hidden
            viewBox="0 0 1200 96"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-24 w-full md:block"
            fill="none"
          >
            <path
              d="M200 32Q600 128 1000 32"
              stroke="var(--terracotta)"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              className="draw-on-scroll"
            />
          </svg>

          <ol className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`flex flex-col items-center text-center ${index === 1 ? "md:translate-y-12" : ""}`}
              >
                <span
                  aria-hidden
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-dark font-display text-2xl font-bold text-white ring-8 ring-terracotta-tint"
                >
                  {index + 1}
                </span>
                <h3 className="mt-6 text-xl font-semibold sm:text-2xl">
                  <span className="sr-only">Passo {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-ink-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 md:mt-24">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("primary", "", "lg")}
          >
            <IconWhatsApp width={20} height={20} />
            Agendar pelo WhatsApp
          </a>
          <Link href="/contato" className={buttonClasses("ghost", "", "lg")}>
            Enviar mensagem
          </Link>
        </div>
      </Container>
    </section>
  );
}

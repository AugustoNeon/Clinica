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
    text: "Pelo WhatsApp, pelo telefone ou pelo formulário do site. Conte o que está sentindo ou o que gostaria de mudar — não precisa saber o nome do procedimento.",
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
 */
export function Steps({ whatsapp }: StepsProps) {
  const whatsappHref = buildWhatsAppUrl(whatsapp, "Olá! Gostaria de agendar uma primeira consulta.");

  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Como funciona a primeira consulta
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            Três passos, sem mistério. A ideia é que você chegue sabendo o que
            esperar e saia sabendo o que vem depois.
          </p>
        </div>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative border-t-2 border-blue/30 pt-6">
              <span className="font-display text-5xl font-semibold leading-none text-blue" aria-hidden>
                {index + 1}
              </span>
              <h3 className="mt-4 text-xl font-medium">
                <span className="sr-only">Passo {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("primary", "", "lg")}
          >
            <IconWhatsApp width={20} height={20} />
            Dar o primeiro passo
          </a>
          <Link href="/contato" className={buttonClasses("ghost", "", "lg")}>
            Prefiro enviar uma mensagem
          </Link>
        </div>
      </Container>
    </section>
  );
}

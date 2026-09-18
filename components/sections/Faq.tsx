import { Container } from "@/components/ui/Container";
import { IconChevronDown } from "@/components/ui/icons";
import { FAQ_ITEMS, type FaqItem } from "@/lib/content/faq";

interface FaqProps {
  items?: FaqItem[];
  title?: string;
  description?: string;
}

/**
 * Perguntas frequentes com `<details>` nativo: abre/fecha sem JavaScript,
 * funciona com teclado e leitor de tela de graca. O chevron gira via CSS
 * (`details.faq[open]` em globals.css). Camada rica (issue #71): cada
 * pergunta e um bloco proprio; o aberto ganha fundo azul diluido e o
 * chevron vira um disco azul — o estado e visivel de longe.
 */
export function Faq({
  items = FAQ_ITEMS,
  title = "Dúvidas comuns antes da primeira consulta",
  description = "Respostas gerais, do jeito que a odontologia orienta. O que vale para o seu caso é definido na avaliação.",
}: FaqProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{description}</p>
        </div>

        <div className="reveal grid gap-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="faq group rounded-2xl border border-ink/10 bg-surface transition-colors duration-200 ease-out open:border-blue/40 open:bg-surface-tint hover:border-blue/40"
            >
              <summary className="flex items-center justify-between gap-6 px-5 py-4 text-left font-display text-lg font-medium transition-colors ease-out group-open:text-blue-dark hover:text-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark sm:px-6 sm:py-5 sm:text-xl">
                {item.question}
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink-muted transition-colors ease-out group-open:border-blue-dark group-open:bg-blue-dark group-open:text-white">
                  <IconChevronDown className="faq-chevron transition-transform duration-200 ease-out" />
                </span>
              </summary>
              <p className="max-w-prose px-5 pb-6 text-base leading-relaxed text-ink-muted sm:px-6">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

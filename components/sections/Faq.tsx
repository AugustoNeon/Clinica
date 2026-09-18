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
 * (`details.faq[open]` em globals.css).
 */
export function Faq({
  items = FAQ_ITEMS,
  title = "Dúvidas comuns antes da primeira consulta",
  description = "Respostas gerais, do jeito que a odontologia orienta. O que vale para o seu caso é definido na avaliação.",
}: FaqProps) {
  return (
    <section className="bg-surface-tint py-14 sm:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{description}</p>
        </div>

        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item) => (
            <details key={item.question} className="faq group">
              <summary className="flex items-center justify-between gap-6 py-5 text-left font-display text-xl font-medium transition-colors ease-out hover:text-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark">
                {item.question}
                <IconChevronDown className="faq-chevron shrink-0 text-ink-muted transition-transform duration-200 ease-out" />
              </summary>
              <p className="max-w-prose pb-6 text-base leading-relaxed text-ink-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

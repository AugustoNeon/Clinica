import { IconQuote, IconStar } from "@/components/ui/icons";
import type { Testimonial } from "@/types";

interface TestimonialListProps {
  testimonials: Testimonial[];
}

function Stars({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <p className="flex items-center gap-0.5" aria-label={`Avaliação: ${value} de 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <IconStar
          key={index}
          width={16}
          height={16}
          className={index < value ? "text-terracotta" : "text-ink/15"}
        />
      ))}
    </p>
  );
}

/**
 * Depoimentos publicados (ja filtrados por `consent_confirmed` em
 * `lib/data/testimonials.ts`). Aspas grandes + estrelas em terracota:
 * o unico lugar do site onde o acento aparece em area maior.
 */
export function TestimonialList({ testimonials }: TestimonialListProps) {
  if (testimonials.length === 0) {
    return <p className="text-ink-muted">Nenhum depoimento publicado ainda.</p>;
  }

  return (
    <ul className="reveal grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <li key={testimonial.id}>
          <figure className="flex h-full flex-col rounded-3xl border border-ink/10 bg-surface p-7">
            <IconQuote width={32} height={32} className="text-blue/40" />
            <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink">
              <p>{testimonial.content}</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
              <span className="text-sm font-medium">{testimonial.patient_name}</span>
              <Stars rating={testimonial.rating} />
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

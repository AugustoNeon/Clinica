import { IconStar } from "@/components/ui/icons";
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
          className={index < value ? "text-terracotta-text" : "text-ink/15"}
        />
      ))}
    </p>
  );
}

/**
 * Depoimentos reais (ja filtrados por `consent_confirmed` em
 * `lib/data/testimonials.ts` e, na Home, sem os de exemplo). Issue #73:
 * sobre fundo claro, o primeiro em destaque tipografico e os demais em
 * lista com filete — sem cartao com sombra para cada um. Citacao curta:
 * o paciente fala, o site nao enfeita.
 */
export function TestimonialList({ testimonials }: TestimonialListProps) {
  if (testimonials.length === 0) {
    return null;
  }

  const [featured, ...others] = testimonials;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
      <figure>
        <blockquote>
          <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
            “{featured.content}”
          </p>
        </blockquote>
        <figcaption className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-base font-semibold">{featured.patient_name}</span>
          <Stars rating={featured.rating} />
        </figcaption>
      </figure>

      {others.length > 0 && (
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {others.map((testimonial) => (
            <li key={testimonial.id} className="py-5">
              <figure>
                <blockquote className="text-base leading-relaxed text-ink">
                  <p>“{testimonial.content}”</p>
                </blockquote>
                <figcaption className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold">{testimonial.patient_name}</span>
                  <Stars rating={testimonial.rating} />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

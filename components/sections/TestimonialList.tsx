import { IconQuote, IconStar } from "@/components/ui/icons";
import type { Testimonial } from "@/types";

interface TestimonialListProps {
  testimonials: Testimonial[];
}

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <p className={`flex items-center gap-0.5 ${className}`} aria-label={`Avaliação: ${value} de 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <IconStar
          key={index}
          width={16}
          height={16}
          className={index < value ? "text-terracotta-soft" : "text-white/25"}
        />
      ))}
    </p>
  );
}

/**
 * Depoimentos publicados (ja filtrados por `consent_confirmed` em
 * `lib/data/testimonials.ts`), sobre a secao azul profunda da Home
 * (issue #71): o primeiro ganha destaque em tipo grande, os demais entram
 * como cartoes brancos. O terracota claro nas estrelas e o acento sobre
 * azul (5.6:1, DESIGN.md).
 */
export function TestimonialList({ testimonials }: TestimonialListProps) {
  if (testimonials.length === 0) {
    return <p className="text-white/85">Nenhum depoimento publicado ainda.</p>;
  }

  const [featured, ...others] = testimonials;

  return (
    <div className="reveal grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
      <figure className="relative">
        <IconQuote width={56} height={56} className="text-terracotta-soft/80" />
        <blockquote className="mt-4">
          <p className="font-display text-2xl font-medium leading-snug text-white sm:text-3xl lg:text-4xl">
            {featured.content}
          </p>
        </blockquote>
        <figcaption className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-base font-medium text-white">{featured.patient_name}</span>
          <Stars rating={featured.rating} />
        </figcaption>
      </figure>

      {others.length > 0 && (
        <ul className="grid content-start gap-4">
          {others.map((testimonial) => (
            <li key={testimonial.id}>
              <figure className="rounded-3xl bg-surface p-6 text-ink shadow-xl shadow-blue-deep/40 sm:p-7">
                <blockquote className="text-base leading-relaxed">
                  <p>{testimonial.content}</p>
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
                  <span className="text-sm font-medium">{testimonial.patient_name}</span>
                  <p className="flex items-center gap-0.5" aria-label={`Avaliação: ${Math.round(testimonial.rating)} de 5`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <IconStar
                        key={index}
                        width={16}
                        height={16}
                        className={index < Math.round(testimonial.rating) ? "text-terracotta" : "text-ink/15"}
                      />
                    ))}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

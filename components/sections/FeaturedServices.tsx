import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconArrowRight } from "@/components/ui/icons";
import { pickFeatured } from "@/lib/config/services";
import type { Service } from "@/types";

interface FeaturedServicesProps {
  services: Service[];
}

/**
 * Servicos na Home (issue #65): composicao editorial em duas colunas, no
 * lugar da grade de 15 cards iguais. A coluna da esquerda fica fixa no
 * scroll (intro + CTA); a da direita lista os servicos em destaque como
 * linhas grandes e o restante como indice compacto — 15 itens continuam
 * a um clique, sem 15 caixas identicas.
 */
export function FeaturedServices({ services }: FeaturedServicesProps) {
  if (services.length === 0) {
    return null;
  }

  const { featured, rest } = pickFeatured(services);

  return (
    <section className="py-14 sm:py-20 lg:py-24" id="servicos">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            O que você precisa, em um só consultório
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            Prevenção, estética, reabilitação e cirurgia. Se você não sabe qual
            especialidade procurar, tudo bem: a avaliação inicial é justamente
            para isso.
          </p>
          <Link href="/servicos" className={buttonClasses("secondary", "mt-8")}>
            Ver todos os serviços
            <IconArrowRight width={18} height={18} />
          </Link>
        </div>

        <div className="reveal">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {featured.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/servicos/${service.slug}`}
                  className="group grid gap-2 py-6 transition-colors ease-out hover:bg-surface-tint sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-4 sm:-mx-4 sm:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
                >
                  <div>
                    <h3 className="text-2xl font-medium transition-colors ease-out group-hover:text-blue-dark">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-muted sm:text-base">
                      {service.description}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="hidden h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink-muted transition ease-out group-hover:border-blue-dark group-hover:bg-blue-dark group-hover:text-white sm:inline-flex"
                  >
                    <IconArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {rest.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-medium text-ink-muted">E também</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {rest.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/servicos/${service.slug}`}
                      className="inline-flex rounded-full border border-ink/15 px-3.5 py-1.5 text-sm text-ink transition ease-out hover:border-blue hover:bg-surface-tint hover:text-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconArrowRight, IconWhatsApp } from "@/components/ui/icons";
import { ServiceIcon } from "@/components/ui/serviceIcons";
import { pickFeatured } from "@/lib/config/services";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { Service } from "@/types";

interface FeaturedServicesProps {
  services: Service[];
  whatsapp: string;
}

/*
 * Tres tintas para o icone, alternadas: azul diluido, terracota diluido e
 * azul profundo. Cada uma e um par ja documentado no DESIGN.md.
 */
const ICON_TINTS = [
  "bg-surface-tint text-blue-dark",
  "bg-terracotta-tint text-terracotta-text",
  "bg-blue-deep text-blue-glow",
];

/**
 * Servicos na Home (issue #65; mosaico ilustrado na #71). Seis servicos em
 * destaque como blocos com icone ilustrado proprio (`serviceIcons.tsx`),
 * o primeiro maior (duas linhas de altura no desktop), e um bloco azul de
 * chamada no fim da grade — nao e uma grade de cards iguais: os tamanhos
 * variam, as tintas alternam e o icone se redesenha no hover. O restante
 * dos servicos continua a um clique, como indice compacto.
 */
export function FeaturedServices({ services, whatsapp }: FeaturedServicesProps) {
  if (services.length === 0) {
    return null;
  }

  const { featured, rest } = pickFeatured(services);
  const whatsappHref = buildWhatsAppUrl(whatsapp, "Olá! Não sei qual especialidade procurar. Gostaria de agendar uma avaliação.");

  return (
    <section className="relative py-16 sm:py-20 lg:py-28" id="servicos">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              O que você precisa, em um só consultório
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Prevenção, estética, reabilitação e cirurgia. Se você não sabe qual
              especialidade procurar, tudo bem: a avaliação inicial é justamente
              para isso.
            </p>
          </div>
          <Link href="/servicos" className={buttonClasses("secondary")}>
            Ver todos os serviços
            <IconArrowRight width={18} height={18} />
          </Link>
        </div>

        <ul className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, index) => {
            const large = index === 0;
            return (
              <li key={service.id} className={large ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
                <Link
                  href={`/servicos/${service.slug}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 ease-out hover:-translate-y-1 hover:border-blue hover:shadow-xl hover:shadow-blue-dark/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark sm:p-7 ${
                    large ? "border-blue/25 bg-surface-tint lg:p-9" : "border-ink/10 bg-surface"
                  }`}
                >
                  {large && (
                    <svg
                      aria-hidden
                      viewBox="0 0 240 120"
                      className="pointer-events-none absolute -right-16 top-32 hidden h-56 w-auto text-blue/15 transition-colors duration-300 ease-out group-hover:text-blue/25 lg:block"
                      fill="none"
                    >
                      <path d="M10 10c50 100 170 100 220 0" stroke="currentColor" strokeWidth="22" strokeLinecap="round" />
                    </svg>
                  )}
                  <span
                    className={`relative inline-flex shrink-0 items-center justify-center rounded-2xl ${
                      large ? "h-16 w-16 bg-blue-dark text-white lg:h-24 lg:w-24" : `h-14 w-14 ${ICON_TINTS[index % ICON_TINTS.length]}`
                    }`}
                  >
                    <ServiceIcon slug={service.slug} className="service-icon" width={large ? 48 : 30} height={large ? 48 : 30} />
                  </span>
                  <h3
                    className={`relative font-medium ${large ? "mt-6 lg:mt-auto lg:pt-10" : "mt-6"} transition-colors ease-out group-hover:text-blue-dark ${
                      large ? "text-2xl lg:text-3xl" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className={`relative mt-2 leading-relaxed text-ink-muted ${large ? "text-base lg:text-lg" : "flex-1 text-base"}`}>
                    {service.description}
                  </p>
                  <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-dark">
                    Saiba mais
                    <IconArrowRight
                      width={16}
                      height={16}
                      className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            );
          })}

          {/* Bloco de chamada: fecha a grade em azul, com a textura da marca. */}
          <li className="lg:col-span-2">
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-blue-dark p-7 text-white sm:p-8 lg:flex-row lg:items-center lg:gap-8">
              <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
              <div className="relative max-w-md">
                <p className="font-display text-2xl font-medium leading-tight sm:text-3xl">
                  Não sabe qual especialidade procurar?
                </p>
                <p className="mt-2 text-base leading-relaxed text-white/90">
                  Conte o que está sentindo. A avaliação inicial descobre o que precisa
                  ser feito — e se precisa.
                </p>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("inverse", "relative shrink-0", "lg")}
              >
                <IconWhatsApp width={20} height={20} />
                Agendar avaliação
              </a>
            </div>
          </li>
        </ul>

        {rest.length > 0 && (
          <div className="mt-10">
            <p className="text-sm font-medium text-ink-muted">E também</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rest.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/servicos/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/15 py-2 pl-2.5 pr-4 text-sm text-ink transition ease-out hover:border-blue hover:bg-surface-tint hover:text-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
                  >
                    <ServiceIcon slug={service.slug} width={20} height={20} className="text-blue-dark" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}

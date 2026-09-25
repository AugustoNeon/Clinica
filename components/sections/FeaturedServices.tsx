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
 * Servicos na Home (issue #65; mosaico na #71). Seis servicos em destaque,
 * o primeiro maior (duas linhas de altura no desktop) com o icone grande
 * como imagem do bloco, e um bloco azul de chamada no fim da grade.
 *
 * Critique de 2026-09-25: nos blocos menores o icone fica AO LADO do
 * titulo (nao num quadrado em cima, o padrao de template que o detector
 * apontou), o bloco nao "pula" no hover — so a borda e o fundo respondem —
 * e o "Saiba mais" e texto sublinhado, sem seta anexada.
 */
export function FeaturedServices({ services, whatsapp }: FeaturedServicesProps) {
  if (services.length === 0) {
    return null;
  }

  const { featured, rest } = pickFeatured(services);
  const whatsappHref = buildWhatsAppUrl(
    whatsapp,
    "Olá! Não sei qual especialidade procurar. Gostaria de agendar uma avaliação.",
  );

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
            if (index === 0) {
              return (
                <li key={service.id} className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
                  <Link
                    href={`/servicos/${service.slug}`}
                    className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-3xl bg-blue-dark p-7 text-white transition-colors duration-300 ease-out hover:bg-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark lg:p-9"
                  >
                    <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
                    {/* O icone grande e a imagem do bloco: sem caixa, sangrando no canto. */}
                    <ServiceIcon
                      slug={service.slug}
                      className="service-icon pointer-events-none absolute -right-6 -top-6 h-44 w-44 text-white/15 lg:h-64 lg:w-64"
                    />
                    <h3 className="relative text-2xl font-medium text-white lg:text-3xl">{service.title}</h3>
                    <p className="relative mt-2 max-w-sm text-base leading-relaxed text-white/90 lg:text-lg">
                      {service.description}
                    </p>
                    <span className="relative mt-6 text-sm font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors group-hover:decoration-white">
                      Saiba mais
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={service.id}>
                <Link
                  href={`/servicos/${service.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-surface p-6 transition-colors duration-200 ease-out hover:border-blue hover:bg-surface-tint/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark sm:p-7"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${ICON_TINTS[index % ICON_TINTS.length]}`}
                    >
                      <ServiceIcon slug={service.slug} className="service-icon" width={26} height={26} />
                    </span>
                    <h3 className="text-xl font-medium transition-colors ease-out group-hover:text-blue-dark sm:text-2xl">
                      {service.title}
                    </h3>
                  </div>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-ink-muted">{service.description}</p>
                  <span className="mt-5 text-sm font-medium text-blue-dark underline decoration-blue-dark/30 underline-offset-4 transition-colors group-hover:decoration-blue-dark">
                    Saiba mais
                  </span>
                </Link>
              </li>
            );
          })}

          {/* Bloco de chamada: fecha a grade em azul, com a textura da marca. */}
          <li className="lg:col-span-2">
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-blue-deep p-7 text-white sm:p-8 lg:flex-row lg:items-center lg:gap-8">
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
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 py-2 pl-2.5 pr-4 text-sm text-ink transition-colors ease-out hover:border-blue hover:bg-surface-tint hover:text-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
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

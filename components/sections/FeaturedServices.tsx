import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconWhatsApp } from "@/components/ui/icons";
import { ServiceIcon } from "@/components/ui/serviceIcons";
import { pickFeatured } from "@/lib/config/services";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { Service } from "@/types";

interface FeaturedServicesProps {
  services: Service[];
  whatsapp: string;
}

/**
 * Servicos na Home (issue #65; mosaico na #71). Seis servicos em destaque,
 * o primeiro maior (duas linhas de altura no desktop) com o icone grande
 * como imagem do bloco, e um bloco azul de chamada no fim da grade.
 *
 * Critique de 2026-09-25: nos blocos menores o icone fica AO LADO do
 * titulo (nao num quadrado em cima, o padrao de template que o detector
 * apontou) e o "Saiba mais" e texto sublinhado, sem seta anexada. No hover
 * o bloco sobe com sombra (`.lift`) e o icone gira: pedido do usuario
 * (issue #73). Cada bloco aparece subindo ao rolar, um depois do outro.
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
    <section className="relative py-16 sm:py-20 lg:py-24" id="servicos">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold sm:text-5xl">
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
          </Link>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, index) => {
            const stagger = { "--reveal-start": `${(index % 3) * 40}px` } as React.CSSProperties;
            if (index === 0) {
              return (
                <li key={service.id} className="reveal sm:col-span-2 lg:col-span-1 lg:row-span-2" style={stagger}>
                  <Link
                    href={`/servicos/${service.slug}`}
                    className="lift group relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-3xl bg-blue-dark p-7 text-white hover:bg-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark lg:p-9"
                  >
                    <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
                    {/* O icone grande e a imagem do bloco: sem caixa, sangrando no canto. */}
                    <ServiceIcon
                      slug={service.slug}
                      className="service-icon pointer-events-none absolute -right-6 -top-6 h-44 w-44 text-white/15 lg:h-64 lg:w-64"
                    />
                    <h3 className="relative text-2xl font-bold text-white lg:text-3xl">{service.title}</h3>
                    <p className="relative mt-2 max-w-sm text-base leading-relaxed text-white/90 lg:text-lg">
                      {service.description}
                    </p>
                    <span className="relative mt-6 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors group-hover:decoration-white">
                      Saiba mais
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={service.id} className="reveal" style={stagger}>
                <Link
                  href={`/servicos/${service.slug}`}
                  className="lift group flex h-full flex-col rounded-3xl bg-surface-sunken p-6 hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark sm:p-7"
                >
                  <div className="flex items-center gap-4">
                    <ServiceIcon slug={service.slug} className="service-icon shrink-0 text-blue-dark" width={36} height={36} />
                    <h3 className="text-xl font-bold transition-colors ease-out group-hover:text-blue-dark sm:text-2xl">
                      {service.title}
                    </h3>
                  </div>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-ink-muted">{service.description}</p>
                  <span className="mt-5 text-sm font-semibold text-blue-dark underline decoration-blue-dark/30 underline-offset-4 transition-colors group-hover:decoration-blue-dark">
                    Saiba mais
                  </span>
                </Link>
              </li>
            );
          })}

          {/* Bloco de chamada: fecha a grade em azul, com a textura da marca. */}
          <li className="reveal lg:col-span-2">
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-blue-deep p-7 text-white sm:p-8 lg:flex-row lg:items-center lg:gap-8">
              <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
              <div className="relative max-w-md">
                <p className="font-display text-2xl font-bold leading-tight sm:text-3xl">
                  Não sabe qual especialidade procurar?
                </p>
                <p className="mt-2 text-base leading-relaxed text-white/90">
                  Conte o que está sentindo. A avaliação inicial descobre o que precisa
                  ser feito, e se precisa.
                </p>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("inverse", "relative shrink-0", "lg")}
              >
                <IconWhatsApp width={20} height={20} />
                Agendar pelo WhatsApp
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
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-sunken py-2 pl-3 pr-4 text-sm font-semibold text-ink transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-surface-tint hover:text-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
                  >
                    <ServiceIcon slug={service.slug} width={20} height={20} className="service-icon text-blue-dark" />
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

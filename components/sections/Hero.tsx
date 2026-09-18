import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconClock, IconMapPin, IconShield, IconWhatsApp } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface HeroProps {
  /** Tagline da clinica ("Te ajudo a sorrir com confiança") — vira o h1. */
  tagline: string;
  whatsapp: string;
  address: string;
  openingHours: string;
  insurance: string;
  /** Nome e cargo da profissional, para a etiqueta sobre a foto. */
  professional: { name: string; role: string } | null;
}

/**
 * Abertura da Home (issue #65).
 *
 * A foto real da doutora e o elemento principal (PRODUCT.md, principio 1:
 * "uma profissional, nao uma clinica anonima"). A moldura em arco repete a
 * curva do logo — e o unico motivo grafico do site, usado de novo na secao
 * "sobre" e na faixa final, de proposito, para ter assinatura sem virar
 * decoracao aleatoria.
 *
 * O h1 e a tagline em primeira pessoa (confirmada pela cliente), nao o nome
 * da clinica: o nome ja esta no logo, no `<title>` e na etiqueta da foto.
 */
export function Hero({ tagline, whatsapp, address, openingHours, insurance, professional }: HeroProps) {
  const whatsappHref = buildWhatsAppUrl(whatsapp, "Olá! Gostaria de agendar uma avaliação.");
  const [street, cityState] = (address ?? "").split("—").map((part) => part.trim());

  return (
    <section className="relative overflow-hidden bg-surface-tint">
      {/* Circulo suave atras da foto: da profundidade sem virar "blob" de template. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[44rem] w-[44rem] -translate-y-1/2 rounded-full bg-blue/10 lg:block"
      />

      <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="rise-in text-base font-medium text-blue-dark">
            Odontologia clínica e estética em Araucária, PR
          </p>
          <h1
            className="rise-in mt-4 text-[2.75rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]"
            style={{ "--rise-delay": "80ms" } as React.CSSProperties}
          >
            {tagline}
          </h1>
          <p
            className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
            style={{ "--rise-delay": "160ms" } as React.CSSProperties}
          >
            Atendimento humanizado e personalizado, da consulta de rotina à
            reabilitação completa — com uma única profissional cuidando de você
            do início ao fim.
          </p>

          <div
            className="rise-in mt-8 flex flex-wrap gap-3"
            style={{ "--rise-delay": "240ms" } as React.CSSProperties}
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "", "lg")}
            >
              <IconWhatsApp width={20} height={20} />
              Agendar pelo WhatsApp
            </a>
            <Link href="/servicos" className={buttonClasses("secondary", "", "lg")}>
              Ver serviços
            </Link>
          </div>

          <ul
            className="rise-in mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted"
            style={{ "--rise-delay": "320ms" } as React.CSSProperties}
          >
            <li className="flex items-center gap-2">
              <IconMapPin className="text-terracotta-text" width={18} height={18} />
              <span>
                {street}
                {cityState ? `, ${cityState}` : ""}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <IconClock className="text-terracotta-text" width={18} height={18} />
              <span>{openingHours}</span>
            </li>
            {insurance && (
              <li className="flex items-center gap-2">
                <IconShield className="text-terracotta-text" width={18} height={18} />
                <span>Particular e convênio {insurance}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[999px_999px_1.75rem_1.75rem] bg-blue/20 shadow-xl shadow-blue-dark/10">
            <Image
              src="/images/team/ariane-02-sentada.jpg"
              alt="Dra. Ariane Vaz Storrer sorrindo, sentada, em foto de estúdio"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 100vw"
              className="object-cover object-top"
            />
          </div>

          {professional && (
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface px-4 py-3 shadow-lg shadow-blue-dark/10 sm:left-8">
              <Image
                src="/images/logo/icon-smile.png"
                alt=""
                width={512}
                height={512}
                className="h-9 w-9"
              />
              <div className="leading-tight">
                <p className="font-display text-base font-medium">{professional.name}</p>
                <p className="text-xs text-ink-muted">{professional.role}</p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

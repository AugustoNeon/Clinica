import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconClock, IconMapPin, IconShield, IconWhatsApp } from "@/components/ui/icons";
import { SmileDivider } from "@/components/ui/SmileDivider";
import { TiltFrame } from "@/components/ui/TiltFrame";
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

type Vars = React.CSSProperties;

/**
 * Abertura da Home (issue #65; camada rica na #71).
 *
 * Estrategia de cor "drenched": o azul profundo da marca ocupa a faixa
 * inteira, com a textura de arcos por cima e duas formas que derivam
 * devagar no scroll. A foto real da doutora continua sendo o elemento
 * principal (PRODUCT.md, principio 1), agora num palco em camadas: anel
 * terracota atras, disco azul mais atras ainda, e dois "chips" de fato na
 * frente — cada camada tem profundidade propria e acompanha a inclinacao
 * do mouse (`TiltFrame` + `.tilt-layer`). Os chips flutuam devagar.
 *
 * O h1 e a tagline em primeira pessoa (confirmada pela cliente), nao o nome
 * da clinica: o nome ja esta no logo, no `<title>` e na etiqueta da foto.
 */
export function Hero({ tagline, whatsapp, address, openingHours, insurance, professional }: HeroProps) {
  const whatsappHref = buildWhatsAppUrl(whatsapp, "Olá! Gostaria de agendar uma avaliação.");
  const [street, cityState] = (address ?? "").split("—").map((part) => part.trim());

  return (
    <section className="relative overflow-hidden bg-blue-deep text-white">
      <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
      {/* Formas de fundo: derivam no scroll (`.drift`), so decorativas. */}
      <div
        aria-hidden
        className="drift pointer-events-none absolute -top-40 right-[-14rem] h-[46rem] w-[46rem] rounded-full bg-blue-dark/80 blur-3xl lg:right-[-6rem]"
        style={{ "--drift-from": "0px", "--drift-to": "-90px" } as Vars}
      />
      <div
        aria-hidden
        className="drift pointer-events-none absolute bottom-24 -left-32 h-80 w-80 rounded-full bg-terracotta/30 blur-3xl"
        style={{ "--drift-from": "50px", "--drift-to": "-50px" } as Vars}
      />

      <Container className="relative grid items-center gap-16 pt-14 pb-20 sm:pt-20 sm:pb-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:py-28">
        <div className="max-w-2xl">
          <p className="rise-in inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-glow">
            <span aria-hidden className="h-2 w-2 rounded-full bg-terracotta-soft" />
            Odontologia clínica e estética em Araucária, PR
          </p>
          <h1
            className="rise-in mt-7 text-[3rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.75rem] xl:text-[5.25rem]"
            style={{ "--rise-delay": "80ms" } as Vars}
          >
            {tagline}
          </h1>
          {/* O sorriso do logo, desenhado sob o titulo: assinatura da marca, nao enfeite. */}
          <svg aria-hidden viewBox="0 0 240 40" className="mt-4 h-7 w-48 text-terracotta-soft sm:w-64" fill="none">
            <path
              className="smile-arc"
              d="M8 8c40 34 184 34 224 0"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1}
            />
          </svg>
          <p
            className="rise-in mt-7 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl"
            style={{ "--rise-delay": "160ms" } as Vars}
          >
            Atendimento humanizado e personalizado, da consulta de rotina à
            reabilitação completa — com uma única profissional cuidando de você
            do início ao fim.
          </p>

          <div className="rise-in mt-9 flex flex-wrap gap-3" style={{ "--rise-delay": "240ms" } as Vars}>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("inverse", "", "lg")}
            >
              <IconWhatsApp width={20} height={20} />
              Agendar pelo WhatsApp
            </a>
            <Link href="/servicos" className={buttonClasses("outline-inverse", "", "lg")}>
              Ver serviços
            </Link>
          </div>

          {/* So no celular: no desktop a barra de topo ja mostra endereco e horario. */}
          <ul
            className="rise-in mt-11 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/85 lg:hidden"
            style={{ "--rise-delay": "320ms" } as Vars}
          >
            <li className="flex items-center gap-2">
              <IconMapPin className="text-terracotta-soft" width={18} height={18} />
              <span>
                {street}
                {cityState ? `, ${cityState}` : ""}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <IconClock className="text-terracotta-soft" width={18} height={18} />
              <span>{openingHours}</span>
            </li>
            {insurance && (
              <li className="flex items-center gap-2">
                <IconShield className="text-terracotta-soft" width={18} height={18} />
                <span>Particular e convênio {insurance}</span>
              </li>
            )}
          </ul>
        </div>

        <div
          className="rise-in relative mx-auto w-full max-w-sm px-4 sm:max-w-md sm:px-0 lg:max-w-none lg:pl-8"
          style={{ "--rise-delay": "120ms" } as Vars}
        >
          <TiltFrame max={7} className="relative">
            {/* Camadas de tras: disco azul e anel terracota, com profundidade negativa. */}
            <div
              aria-hidden
              className="tilt-layer absolute -left-10 top-6 h-44 w-44 rounded-full bg-blue/70 sm:-left-14 sm:h-56 sm:w-56"
              style={{ "--depth": "-70px" } as Vars}
            />
            <div
              aria-hidden
              className="tilt-layer absolute -inset-3 rounded-[999px_999px_2.25rem_2.25rem] border-2 border-terracotta-soft/70 sm:-inset-4"
              style={{ "--depth": "-30px" } as Vars}
            />

            <div className="tilt-glare relative aspect-[4/5] overflow-hidden rounded-[999px_999px_1.75rem_1.75rem] bg-blue-dark shadow-2xl shadow-blue-deep/70">
              <Image
                src="/images/team/ariane-02-sentada.jpg"
                alt="Dra. Ariane Vaz Storrer sorrindo, sentada, em foto de estúdio"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 100vw"
                className="object-cover object-top"
              />
            </div>

            {/* Selos na frente da foto: profundidade positiva + flutuacao. O de
                urgencia parece botao, entao E um link para o WhatsApp. */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="tilt-layer float absolute left-0 top-[14%] flex items-center gap-2.5 rounded-2xl bg-surface px-3.5 py-2.5 text-ink shadow-xl shadow-blue-deep/50 transition-colors ease-out hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-left-8"
              style={{ "--depth": "55px", "--float-delay": "0ms" } as Vars}
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-dark text-white">
                <IconWhatsApp width={16} height={16} />
              </span>
              <span className="text-sm font-medium leading-tight">
                Urgência?
                <br />
                <span className="font-normal text-ink-muted">Direto pelo WhatsApp</span>
              </span>
            </a>

            {insurance && (
              <div
                className="tilt-layer float absolute right-2 top-[58%] flex items-center gap-2.5 rounded-2xl bg-surface px-3.5 py-2.5 text-ink shadow-xl shadow-blue-deep/50 sm:-right-2"
                style={{ "--depth": "75px", "--float-delay": "1600ms" } as Vars}
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta text-ink">
                  <IconShield width={16} height={16} />
                </span>
                <span className="text-sm font-medium leading-tight">
                  Particular e convênio
                  <br />
                  <span className="font-normal text-ink-muted">{insurance}</span>
                </span>
              </div>
            )}

            {professional && (
              <div
                className="tilt-layer absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-ink shadow-xl shadow-blue-deep/50 sm:left-8"
                style={{ "--depth": "40px" } as Vars}
              >
                <Image src="/images/logo/icon-smile.png" alt="" width={512} height={512} className="h-9 w-9" />
                <div className="leading-tight">
                  <p className="font-display text-base font-medium">{professional.name}</p>
                  <p className="text-xs text-ink-muted">{professional.role}</p>
                </div>
              </div>
            )}
          </TiltFrame>
        </div>
      </Container>

      {/* A faixa sorri para a proxima secao (ticker terracota). */}
      <SmileDivider className="relative text-terracotta" />
    </section>
  );
}

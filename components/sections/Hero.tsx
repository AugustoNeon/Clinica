import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconClock, IconMapPin, IconShield, IconWhatsApp } from "@/components/ui/icons";
import { Tooth3D } from "@/components/three/Tooth3D";
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
 * Abertura da Home (issue #65; azul aceso e revisao anti-IA na #73).
 *
 * O azul do logo, com mais saturacao, ocupa a faixa inteira; a foto real da
 * doutora e o elemento principal (PRODUCT.md, principio 1), dentro do arco
 * do logo com um anel coral. O palco da foto e 3D (pedido do usuario):
 * segue o mouse (`TiltFrame`) e cada camada tem profundidade propria, do
 * disco marinho la atras ao dente 3D na frente, que entra girando, vira com
 * a rolagem e gira com o dedo. Sem manchas desfocadas.
 *
 * O h1 e a tagline em primeira pessoa (confirmada pela cliente), nao o nome
 * da clinica: o nome ja esta no logo, no `<title>` e no cracha da foto.
 */
export function Hero({ tagline, whatsapp, address, openingHours, insurance, professional }: HeroProps) {
  const whatsappHref = buildWhatsAppUrl(whatsapp, "Olá! Gostaria de agendar uma avaliação.");
  const [street, cityState] = (address ?? "").split("—").map((part) => part.trim());

  return (
    <section className="relative overflow-hidden bg-blue-dark text-white">
      <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />

      <Container className="relative grid items-center gap-14 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-20">
        <div className="max-w-2xl">
          <p className="rise-in text-base font-semibold text-blue-glow">
            Odontologia clínica e estética em Araucária, PR
          </p>
          <h1
            className="rise-in mt-5 text-[2.75rem] font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
            style={{ "--rise-delay": "80ms" } as Vars}
          >
            {tagline}
          </h1>
          {/* O sorriso do logo, desenhado sob o titulo: assinatura da marca. */}
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
            className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl"
            style={{ "--rise-delay": "160ms" } as Vars}
          >
            Da limpeza de rotina à reabilitação completa, com a mesma profissional
            cuidando de você do início ao fim.
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
            className="rise-in mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/90 lg:hidden"
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
          className="rise-in relative mx-auto w-full max-w-sm px-3 sm:max-w-md sm:px-0 lg:ml-auto lg:mr-4"
          style={{ "--rise-delay": "120ms" } as Vars}
        >
          <TiltFrame max={7} className="relative">
            {/* Camadas de tras: disco marinho e anel coral, com profundidade negativa. */}
            <div
              aria-hidden
              className="tilt-layer absolute -left-8 top-16 h-40 w-40 rounded-full bg-blue-deep sm:-left-14 sm:h-52 sm:w-52"
              style={{ "--depth": "-70px" } as Vars}
            />
            <div
              aria-hidden
              className="tilt-layer absolute -right-3 top-5 bottom-8 left-5 rounded-[999px_999px_2rem_2rem] border-[3px] border-terracotta sm:-right-5"
              style={{ "--depth": "-30px" } as Vars}
            />
            <div className="tilt-glare relative aspect-[4/5] overflow-hidden rounded-[999px_999px_1.5rem_1.5rem] bg-blue-deep">
              <Image
                src="/images/team/ariane-02-sentada.jpg"
                alt="Dra. Ariane Vaz Storrer sorrindo, sentada, em foto de estúdio"
                fill
                priority
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 28rem, 100vw"
                className="object-cover object-top"
              />
            </div>

            {/* Dente 3D na frente da foto: a camada mais proxima. */}
            <div
              className="tilt-layer absolute -left-4 -top-6 h-32 w-32 sm:-left-12 sm:-top-8 sm:h-44 sm:w-44 lg:-left-16 lg:h-48 lg:w-48"
              style={{ "--depth": "80px" } as Vars}
            >
              <Tooth3D className="h-full w-full" draggable />
            </div>

            {professional && (
              <div
                className="tilt-layer absolute -bottom-5 left-0 flex items-center gap-3 rounded-full bg-surface py-2 pl-2 pr-5 text-ink shadow-lg shadow-blue-deep/30 sm:-left-6"
                style={{ "--depth": "40px" } as Vars}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-tint">
                  <Image src="/images/logo/icon-smile.png" alt="" width={512} height={512} className="h-7 w-7" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-base font-semibold">{professional.name}</span>
                  <span className="block text-xs text-ink-muted">{professional.role}</span>
                </span>
              </div>
            )}
          </TiltFrame>
        </div>
      </Container>

      {/* A faixa sorri para a proxima secao (aviso de urgencia em coral). */}
      <SmileDivider className="relative text-terracotta" />
    </section>
  );
}

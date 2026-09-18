import type { SVGProps } from "react";

/*
 * Icones ilustrados por servico (issue #71): desenhos proprios, no mesmo
 * traco dos icones de interface (1.75px, cantos redondos), um por
 * especialidade. Sao imagem de marca — nao um pacote generico de icones
 * medicos — e por isso o dente base e o mesmo em quase todos, variando so
 * o detalhe que identifica a especialidade (brilho, bracket, parafuso,
 * carinha...). `pathLength=1` em cada traco permite o efeito de "redesenhar"
 * no hover (`.draw-icon` em globals.css).
 *
 * O mapeamento e por slug (`lib/config/services.ts` decide os slugs);
 * servico sem desenho proprio recebe o dente base — nunca fica sem icone.
 */

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

/** Molar visto de frente: coroa larga, duas raizes. Base de quase todos os icones. */
const TOOTH =
  "M7.6 3.5c-2.6 0-4.1 2-4.1 4.6 0 3 1.5 4.6 2 7.6.4 2.6.8 4.8 2.2 4.8 1.5 0 1.6-3.8 2.3-5.3.4-.9 1.6-.9 2 0 .7 1.5.8 5.3 2.3 5.3 1.4 0 1.8-2.2 2.2-4.8.5-3 2-4.6 2-7.6 0-2.6-1.5-4.6-4.1-4.6-1.7 0-2.6.8-3.4.8s-1.7-.8-3.4-.8Z";

function Tooth(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={TOOTH} pathLength={1} />
    </svg>
  );
}

function ToothSparkle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7.6 6.2c-2.6 0-4.1 2-4.1 4.6 0 3 1.5 4.6 2 7.6.4 2.6.8 4.1 2.2 4.1 1.5 0 1.6-3.1 2.3-4.6.4-.9 1.6-.9 2 0 .7 1.5.8 4.6 2.3 4.6 1.4 0 1.8-1.5 2.2-4.1.5-3 2-4.6 2-7.6" pathLength={1} />
      <path d="M18 2v4M16 4h4" pathLength={1} />
      <path d="M21 8.5v2.5M19.75 9.75h2.5" pathLength={1} />
    </svg>
  );
}

function ToothBraces(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={TOOTH} pathLength={1} />
      <path d="M2.5 11.5h19" pathLength={1} />
      <rect x="10" y="9.5" width="4" height="4" rx="0.8" pathLength={1} />
    </svg>
  );
}

function Implant(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7.6 3.5c-2.4 0-3.8 1.6-3.8 3.6l1.2 3.9h14l1.2-3.9c0-2-1.4-3.6-3.8-3.6-1.7 0-2.6.8-3.4.8s-1.7-.8-3.4-.8Z" pathLength={1} />
      <path d="M9.5 13v6.2L12 21.5l2.5-2.3V13" pathLength={1} />
      <path d="M9.5 15h5M9.5 17.5h5" pathLength={1} />
    </svg>
  );
}

function Veneer(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={TOOTH} pathLength={1} />
      <path d="M8.5 6.5c-.9 1.6-1 3.6-.4 5.2" pathLength={1} />
      <path d="M17.5 4.5l2.5-2.5" pathLength={1} />
    </svg>
  );
}

function ToothSmile(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={TOOTH} pathLength={1} />
      <path d="M9.4 9.2h.01M14.6 9.2h.01" strokeWidth={2.4} pathLength={1} />
      <path d="M9.5 12.2c1.4 1.5 3.6 1.5 5 0" pathLength={1} />
    </svg>
  );
}

function RootCanal(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={TOOTH} pathLength={1} />
      <path d="M12 7.5v3l-1.6 2.2 1.6 2.3v2.5" pathLength={1} />
    </svg>
  );
}

function Scalpel(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 20.5l9.5-9.5" pathLength={1} />
      <path d="M13 11l4.5-4.5a2 2 0 0 1 2.9 2.9L16 13.9c-1.2 1.2-3 1.4-4.5.6Z" pathLength={1} />
      <path d="M6.5 20.5h-3v-3" pathLength={1} />
    </svg>
  );
}

function ToothExtract(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10.6 5.5c-2.6 0-4.1 2-4.1 4.6 0 3 1.5 4.6 2 7.6.4 2.6.8 4.8 2.2 4.8 1.5 0 1.6-3.8 2.3-5.3.4-.9 1.6-.9 2 0 .7 1.5.8 5.3 2.3 5.3 1.4 0 1.8-2.2 2.2-4.8.5-3 2-4.6 2-7.6 0-2.6-1.5-4.6-4.1-4.6-1.7 0-2.6.8-3.4.8s-1.7-.8-3.4-.8Z" pathLength={1} />
      <path d="M4.5 3.5l-2-2M3 7.5H1M6.5 2.5v-1" pathLength={1} />
    </svg>
  );
}

function Denture(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 11.5a8.5 6.5 0 0 1 17 0v3a8.5 4.5 0 0 1-17 0Z" pathLength={1} />
      <path d="M8 10.5v5.5M12 9.8v6.7M16 10.5v5.5" pathLength={1} />
    </svg>
  );
}

function Crown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 18.5h15l1.5-10-4.6 3.3L12 5.5l-4.4 6.3L3 8.5Z" pathLength={1} />
      <path d="M8 15.5h8" pathLength={1} />
    </svg>
  );
}

function Filling(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={TOOTH} pathLength={1} />
      <path d="M10 7.2h4v2.6h-4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Face(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2.5a7 7 0 0 0-7 7c0 3 1.4 4.9 2.8 6.8.7 1 1.2 2.7 1.2 4.2h6c0-1.5.5-3.2 1.2-4.2C17.6 14.4 19 12.5 19 9.5a7 7 0 0 0-7-7Z" pathLength={1} />
      <path d="M9.5 9.5h.01M14.5 9.5h.01" strokeWidth={2.4} pathLength={1} />
      <path d="M9.8 13.2c1.3 1.2 3.1 1.2 4.4 0" pathLength={1} />
      <path d="M20.5 3.5v2M19.5 4.5h2" pathLength={1} />
    </svg>
  );
}

function HeartTooth(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20.5s-8-4.9-8-10.4A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 8 2.9c0 5.5-8 10.4-8 10.4Z" pathLength={1} />
      <path d="M9.5 12.5c1.4 1.5 3.6 1.5 5 0" pathLength={1} />
    </svg>
  );
}

function SmileRow(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8.5c4.5 8.5 13.5 8.5 18 0" pathLength={1} />
      <path d="M7 11.2v3.6M10.5 13v3.8M13.5 13v3.8M17 11.2v3.6" pathLength={1} />
      <path d="M3 8.5c4.5-2 13.5-2 18 0" pathLength={1} />
    </svg>
  );
}

const ICON_BY_SLUG: Record<string, (props: IconProps) => React.JSX.Element> = {
  "clinico-geral": Tooth,
  "clareamento-dental": ToothSparkle,
  ortodontia: ToothBraces,
  implantodontia: Implant,
  facetas: Veneer,
  odontopediatria: ToothSmile,
  endodontia: RootCanal,
  cirurgias: Scalpel,
  "extracao-de-sisos": ToothExtract,
  protese: Denture,
  coroas: Crown,
  dentistica: Filling,
  "harmonizacao-facial": Face,
  "atendimento-necessidades-especiais": HeartTooth,
  "reabilitacao-oral": SmileRow,
};

interface ServiceIconProps extends IconProps {
  slug: string;
}

/** Icone do servico pelo slug; dente base quando nao ha desenho proprio. */
export function ServiceIcon({ slug, ...props }: ServiceIconProps) {
  const Icon = ICON_BY_SLUG[slug] ?? Tooth;
  return <Icon {...props} />;
}

/** O dente base sozinho — para usos fora da lista de servicos (404, vazio...). */
export { Tooth as IconTooth };

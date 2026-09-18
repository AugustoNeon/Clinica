import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconArrowRight, IconWhatsApp } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { TeamMember } from "@/types";

interface DoctorIntroProps {
  professional: TeamMember;
  clinicTagline: string;
  whatsapp?: string;
}

const FALLBACK_PHOTO = "/images/team/ariane-03-jaleco-corpo-inteiro.jpg";
const SECOND_PHOTO = "/images/team/ariane-01-retrato-casual.jpg";

type Vars = React.CSSProperties;

/**
 * Apresentacao da doutora na Home. O texto e o mesmo da pagina "Sobre"
 * (fatos do questionario: 1 ano na regiao, atendimento humanizado, todos
 * os perfis) — a bio pessoal ainda e placeholder no banco e por isso NAO
 * aparece aqui; ela fica na pagina da equipe, com o aviso devido.
 *
 * Camada rica (issue #71): duas fotos reais sobrepostas (a grande em arco
 * invertido, a segunda como retrato inclinado por cima), formas da marca
 * atras e a tagline em destaque. Fotografia e o principal carregador de
 * "acolhedora e humana" (DESIGN.md → Fotografia): duas fotos dizem mais
 * que uma.
 */
export function DoctorIntro({ professional, clinicTagline, whatsapp }: DoctorIntroProps) {
  const whatsappHref = whatsapp
    ? buildWhatsAppUrl(whatsapp, "Olá! Gostaria de agendar uma avaliação.")
    : null;

  return (
    <section className="relative overflow-hidden bg-surface-tint py-16 sm:py-20 lg:py-28">
      <div aria-hidden className="pattern-arcs-blue pointer-events-none absolute inset-0" />
      <Container className="relative grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="reveal relative mx-auto w-full max-w-sm pb-10 pr-10 sm:pr-14 lg:max-w-md">
          <div
            aria-hidden
            className="drift absolute -left-10 -top-10 h-52 w-52 rounded-full bg-blue/35"
            style={{ "--drift-from": "30px", "--drift-to": "-30px" } as Vars}
          />
          <div
            aria-hidden
            className="drift absolute right-0 top-1/3 h-28 w-28 rounded-full bg-terracotta/45"
            style={{ "--drift-from": "-20px", "--drift-to": "40px" } as Vars}
          />

          {/* Arco invertido em relacao ao hero: mesma familia de forma, outra postura. */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem_1.75rem_999px_999px] bg-blue/20 shadow-2xl shadow-blue-deep/25">
            <Image
              src={professional.photo_url ?? FALLBACK_PHOTO}
              alt={`${professional.name}, ${professional.role}`}
              fill
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 24rem, 100vw"
              className="object-cover object-top"
            />
          </div>

          {/* Segundo retrato, inclinado, por cima: a mesma pessoa fora do jaleco. */}
          <div className="absolute bottom-0 right-0 w-36 -rotate-6 rounded-2xl bg-surface p-2 shadow-xl shadow-blue-deep/25 transition-transform duration-500 ease-out hover:rotate-0 sm:w-44">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-blue/20">
              <Image
                src={SECOND_PHOTO}
                alt={`${professional.name} em retrato casual`}
                fill
                sizes="11rem"
                className="object-cover object-top"
              />
            </div>
            <p className="px-1 pb-1 pt-2 font-display text-sm text-ink-muted">
              {professional.name.split(" ").slice(0, 2).join(" ")}
            </p>
          </div>
        </div>

        <div className="reveal">
          <p className="font-display text-3xl font-medium leading-tight text-blue-dark sm:text-4xl lg:text-5xl">
            <span aria-hidden className="text-terracotta">“</span>
            {clinicTagline}
            <span aria-hidden className="text-terracotta">”</span>
          </p>
          <h2 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">Quem cuida de você</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-muted">
            <p>
              A {professional.name} atende sozinha o consultório em Araucária:
              é ela quem avalia, explica e executa cada etapa do tratamento. Em
              atividade há 1 ano na região, recebe pacientes de todos os perfis
              — da rotina preventiva a tratamentos mais específicos.
            </p>
            <p>
              O compromisso é simples: você entender o que está acontecendo com
              a sua boca e decidir com calma o que fazer, sem pressão e sem
              surpresa.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/equipe" className={buttonClasses("primary")}>
              Conhecer a {professional.name.split(" ").slice(0, 2).join(" ")}
              <IconArrowRight width={18} height={18} />
            </Link>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("secondary")}
              >
                <IconWhatsApp width={18} height={18} className="text-blue-dark" />
                Falar com ela
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

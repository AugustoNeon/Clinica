import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconWhatsApp } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { TeamMember } from "@/types";

interface DoctorIntroProps {
  professional: TeamMember;
  /** Mantido na assinatura por compatibilidade; a tagline ja e o h1 do hero. */
  clinicTagline?: string;
  whatsapp?: string;
}

const FALLBACK_PHOTO = "/images/team/ariane-03-jaleco-corpo-inteiro.jpg";
const SECOND_PHOTO = "/images/team/ariane-01-retrato-casual.jpg";

/**
 * Apresentacao da doutora, logo depois do hero (issue #73): a clinica e uma
 * profissional so, e isso e o que o paciente precisa saber primeiro. Os
 * fatos sao os do questionario (1 ano na regiao, atendimento humanizado,
 * todos os perfis); a bio pessoal ainda e placeholder no banco e por isso
 * NAO aparece aqui.
 *
 * Duas fotos reais: a grande em arco invertido e um retrato menor por cima.
 * Atras, dois circulos chapados (marinho e coral) que derivam devagar no
 * scroll; a foto grande abre de baixo para cima ao entrar e o retrato menor
 * se endireita com o mouse. Sem manchas desfocadas. A tagline nao se repete
 * aqui porque ja e o titulo do hero, logo acima.
 */
type Vars = React.CSSProperties;
export function DoctorIntro({ professional, whatsapp }: DoctorIntroProps) {
  const whatsappHref = whatsapp
    ? buildWhatsAppUrl(whatsapp, "Olá! Gostaria de agendar uma avaliação.")
    : null;
  const shortName = professional.name.split(" ").slice(0, 2).join(" ");

  return (
    <section className="bg-surface-tint py-16 sm:py-20 lg:py-24">
      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-sm pb-10 pr-10 sm:pr-14 lg:max-w-md">
          {/* Formas chapadas de fundo: derivam no scroll, so decorativas. */}
          <div
            aria-hidden
            className="drift absolute -left-10 -top-8 h-44 w-44 rounded-full bg-blue-dark sm:h-52 sm:w-52"
            style={{ "--drift-from": "30px", "--drift-to": "-30px" } as Vars}
          />
          <div
            aria-hidden
            className="drift absolute right-0 top-1/3 h-24 w-24 rounded-full bg-terracotta"
            style={{ "--drift-from": "-20px", "--drift-to": "40px" } as Vars}
          />
          {/* Arco invertido em relacao ao hero: mesma familia de forma, outra postura. */}
          <div className="reveal-photo relative aspect-[4/5] overflow-hidden rounded-[1.5rem_1.5rem_999px_999px] bg-blue/20">
            <Image
              src={professional.photo_url ?? FALLBACK_PHOTO}
              alt={`${professional.name}, ${professional.role}`}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 24rem, 100vw"
              className="object-cover object-top"
            />
          </div>

          {/* Segundo retrato por cima: a mesma pessoa fora do jaleco. */}
          <div className="absolute bottom-0 right-0 w-36 -rotate-6 rounded-3xl bg-surface p-2 shadow-md shadow-blue-deep/15 transition-transform duration-500 ease-out hover:rotate-0 hover:scale-105 sm:w-44">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-blue/20">
              <Image
                src={SECOND_PHOTO}
                alt={`${professional.name} em retrato casual`}
                fill
                sizes="11rem"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold sm:text-5xl">Quem cuida de você</h2>
          <p className="mt-3 text-lg font-semibold text-blue-dark">
            {professional.name}, {professional.role.toLowerCase()}
          </p>
          <div className="mt-6 max-w-[62ch] space-y-4 text-lg leading-relaxed text-ink-muted">
            <p>
              Ela atende sozinha o consultório em Araucária. Quem avalia é quem
              explica e quem executa cada etapa do tratamento. Em atividade há 1
              ano na região, recebe pacientes de todos os perfis, da rotina
              preventiva a tratamentos mais específicos.
            </p>
            <p>
              O compromisso é simples: você entender o que está acontecendo com a
              sua boca e decidir com calma o que fazer, sem pressão e sem surpresa.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/equipe" className={buttonClasses("primary")}>
              Conhecer a {shortName}
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

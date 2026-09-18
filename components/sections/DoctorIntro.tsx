import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconArrowRight } from "@/components/ui/icons";
import type { TeamMember } from "@/types";

interface DoctorIntroProps {
  professional: TeamMember;
  clinicTagline: string;
}

const FALLBACK_PHOTO = "/images/team/ariane-03-jaleco-corpo-inteiro.jpg";

/**
 * Apresentacao da doutora na Home. O texto e o mesmo da pagina "Sobre"
 * (fatos do questionario: 1 ano na regiao, atendimento humanizado, todos
 * os perfis) — a bio pessoal ainda e placeholder no banco e por isso NAO
 * aparece aqui; ela fica na pagina da equipe, com o aviso devido.
 */
export function DoctorIntro({ professional, clinicTagline }: DoctorIntroProps) {
  return (
    <section className="bg-surface-tint py-14 sm:py-20 lg:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          {/* Arco invertido em relacao ao hero: mesma familia de forma, outra postura. */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem_1.75rem_999px_999px] bg-blue/20">
            <Image
              src={professional.photo_url ?? FALLBACK_PHOTO}
              alt={`${professional.name}, ${professional.role}`}
              fill
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 24rem, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div
            aria-hidden
            className="absolute -left-4 -top-4 -z-10 h-32 w-32 rounded-full bg-terracotta/30"
          />
        </div>

        <div>
          <p className="font-display text-2xl font-medium text-blue-dark sm:text-3xl">
            “{clinicTagline}”
          </p>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Quem cuida de você
          </h2>
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
          <Link href="/equipe" className={buttonClasses("secondary", "mt-8")}>
            Conhecer a {professional.name.split(" ").slice(0, 2).join(" ")}
            <IconArrowRight width={18} height={18} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

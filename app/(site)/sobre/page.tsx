import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PracticalInfo } from "@/components/sections/PracticalInfo";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroEmblem } from "@/components/ui/HeroEmblem";
import { IconHeart, IconShield, IconSparkle } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { getTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Sobre a clínica",
  description:
    "Consultório odontológico em Araucária (PR) com uma única profissional, a Dra. Ariane Vaz Storrer: atendimento humanizado e personalizado, do preventivo à reabilitação.",
};

const VALUES = [
  {
    icon: IconHeart,
    tint: "text-terracotta-text",
    title: "Acolhimento de verdade",
    text: "Consulta é conversa antes de ser procedimento. Medo de dentista, vergonha do sorriso, dúvida boba: tudo cabe aqui.",
  },
  {
    icon: IconShield,
    tint: "text-blue-dark",
    title: "Transparência no plano",
    text: "Cada etapa proposta vem explicada e com o porquê. Você decide sabendo o que está decidindo.",
  },
  {
    icon: IconSparkle,
    tint: "text-blue-deep",
    title: "Cuidado personalizado",
    text: "Sem protocolo genérico: o plano parte do seu caso, do seu tempo e do que você quer alcançar.",
  },
];


export default async function SobrePage() {
  const [settings, team] = await Promise.all([getSiteSettingsMap(), getTeamMembers()]);
  const professional = team[0] ?? null;

  return (
    <>
      <PageHero
        title="Um consultório, uma profissional, o seu sorriso"
        lead="Odontologia clínica e estética em Araucária (PR), com atendimento humanizado e personalizado em todas as especialidades."
        visual={
          <HeroEmblem>
            <Image
              src="/images/logo/icon-smile.png"
              alt=""
              width={512}
              height={512}
              className="h-32 w-32 brightness-0 invert"
            />
          </HeroEmblem>
        }
      />

      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-prose">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">A clínica</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-muted">
              <p>
                A Dra. Ariane Vaz Storrer oferece atendimento humanizado e
                personalizado em odontologia clínica e estética, em Araucária
                (PR). Em atividade há 1 ano na região, a clínica recebe
                pacientes de todos os perfis, da rotina preventiva a
                tratamentos mais específicos, com o objetivo de ajudar cada
                paciente a sorrir com confiança.
              </p>
              <p>
                O atendimento é particular, com atendimento também a pacientes
                conveniados da {settings.insurance}. Fora do horário comum,
                casos de urgência são atendidos diretamente pelo WhatsApp da
                clínica.
              </p>
            </div>
            {professional && (
              <Link href="/equipe" className={buttonClasses("primary", "mt-8")}>
                Conhecer a profissional
              </Link>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            {/* Circulo chapado que deriva no scroll atras da foto (decorativo). */}
            <div
              aria-hidden
              className="drift absolute -right-10 -top-10 h-48 w-48 rounded-full bg-surface-tint sm:h-56 sm:w-56"
              style={{ "--drift-from": "30px", "--drift-to": "-30px" } as React.CSSProperties}
            />
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[999px_999px_2.25rem_2.25rem] border-[3px] border-terracotta"
            />
            <div className="reveal-photo relative aspect-[3/4] overflow-hidden rounded-[999px_999px_1.75rem_1.75rem] bg-blue/20">
              <Image
                src="/images/team/ariane-04-jaleco-retrato.jpg"
                alt="Dra. Ariane Vaz Storrer de jaleco, com o nome bordado"
                fill
                sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-surface-tint py-14 sm:py-20 lg:py-24">
        <Container className="relative">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              O que você pode esperar
            </h2>
          </div>
          <ul className="mt-10 grid gap-3 md:grid-cols-3">
            {VALUES.map((value) => (
              <li
                key={value.title}
                className="rounded-3xl bg-surface p-6 sm:p-7"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex shrink-0 ${value.tint}`}
                  >
                    <value.icon width={30} height={30} />
                  </span>
                  <h3 className="text-xl font-semibold sm:text-2xl">{value.title}</h3>
                </div>
                <p className="mt-4 text-base leading-relaxed text-ink-muted">{value.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">O espaço</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Consultório em {settings.address}.
            </p>
          </div>
          {/*
           * Espaco reservado para as fotos de fachada, recepcao e consultorio
           * (issue #10). Enquanto nao chegam, o bloco e visivelmente
           * provisorio — nunca foto de banco fingindo ser a clinica.
           */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Fachada", "Recepção", "Consultório"].map((label) => (
              <div
                key={label}
                className="relative flex aspect-[4/3] items-end overflow-hidden rounded-3xl border border-dashed border-blue/40 bg-surface-tint p-5"
              >
                <span className="relative text-sm font-medium text-ink">{label}: foto em breve</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <PlaceholderNotice>
              Fotos do espaço físico (fachada, recepção, consultório) ainda não
              foram enviadas pela clínica. Entram assim que a Dra. Ariane
              mandar o material.
            </PlaceholderNotice>
          </div>
        </Container>
      </section>

      <PracticalInfo settings={settings} title="Onde fica e como funciona" />

      <CtaBand whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconWhatsApp } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { getTeamMembers } from "@/lib/data/team";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export const metadata: Metadata = {
  title: "Equipe",
  description:
    "Conheça a Dra. Ariane Vaz Storrer, cirurgiã-dentista responsável pelo consultório em Araucária (PR).",
};

const FALLBACK_PHOTO = "/images/team/ariane-03-jaleco-corpo-inteiro.jpg";
const SECOND_PHOTO = "/images/team/ariane-01-retrato-casual.jpg";

type Vars = React.CSSProperties;

export default async function EquipePage() {
  const [members, settings] = await Promise.all([getTeamMembers(), getSiteSettingsMap()]);
  /*
   * A clinica tem UMA profissional (PRODUCT.md) — por isso esta pagina nao usa
   * grade: uma grade de um card so parece lista incompleta. O layout e uso
   * unico e mora aqui mesmo, sem virar componente.
   */
  const professional = members[0] ?? null;
  const bioIsPlaceholder = professional ? /placeholder/i.test(professional.bio) : false;
  const whatsappHref = buildWhatsAppUrl(settings.whatsapp, "Olá! Gostaria de agendar uma avaliação.");

  return (
    <>
      <PageHero
        title="Quem vai cuidar de você"
        lead="Uma única profissional acompanha o seu tratamento do início ao fim: quem avalia é quem trata."
      />

      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <Container>
          {professional === null ? (
            <p className="text-ink-muted">Nenhum profissional cadastrado ainda.</p>
          ) : (
            <div className="grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
              <div className="reveal relative mx-auto w-full max-w-sm pb-10 pr-10 sm:pr-14 lg:max-w-none">
                <div
                  aria-hidden
                  className="drift absolute -left-10 -top-10 h-52 w-52 rounded-full bg-blue/30"
                  style={{ "--drift-from": "30px", "--drift-to": "-30px" } as Vars}
                />
                <div
                  aria-hidden
                  className="absolute -inset-3 right-7 bottom-7 rounded-[999px_999px_2.25rem_2.25rem] border-2 border-terracotta/50 sm:right-11"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[999px_999px_1.75rem_1.75rem] bg-blue/20 shadow-2xl shadow-blue-deep/25">
                  <Image
                    src={professional.photo_url ?? FALLBACK_PHOTO}
                    alt={`${professional.name}, ${professional.role}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 36vw, (min-width: 640px) 24rem, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-36 rotate-6 rounded-2xl bg-surface p-2 shadow-xl shadow-blue-deep/25 transition-transform duration-500 ease-out hover:rotate-0 sm:w-44">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-blue/20">
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

              <div className="max-w-prose">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{professional.name}</h2>
                <p className="mt-3 inline-flex rounded-full bg-terracotta-tint px-3.5 py-1 text-sm font-medium text-terracotta-text">
                  {professional.role}
                </p>
                {/* Divulgacao de profissional de odontologia exige o numero do CRO. */}
                {professional.cro_number ? (
                  <p className="mt-3 text-sm font-medium text-ink-muted">{professional.cro_number}</p>
                ) : (
                  <div className="mt-5">
                    <PlaceholderNotice>
                      O número do CRO e a biografia ainda não foram enviados
                      pela clínica — continuam provisórios até lá.
                    </PlaceholderNotice>
                  </div>
                )}

                <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-muted">
                  {bioIsPlaceholder ? (
                    <>
                      <p>
                        Cirurgiã-dentista à frente do consultório em Araucária
                        (PR), onde atende sozinha todas as especialidades
                        oferecidas: é ela quem avalia, explica e executa cada
                        etapa do tratamento.
                      </p>
                      <p>
                        Em atividade há 1 ano na região, recebe pacientes de
                        todos os perfis — da rotina preventiva à reabilitação
                        completa — com um atendimento humanizado e
                        personalizado.
                      </p>
                    </>
                  ) : (
                    <p>{professional.bio}</p>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses("primary")}
                  >
                    <IconWhatsApp width={18} height={18} />
                    Agendar avaliação
                  </a>
                  <Link href="/servicos" className={buttonClasses("secondary")}>
                    Ver especialidades
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      <CtaBand whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}

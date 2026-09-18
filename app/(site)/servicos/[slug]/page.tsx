import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconArrowRight, IconWhatsApp } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceIcon } from "@/components/ui/serviceIcons";
import { groupServices } from "@/lib/config/services";
import { getServiceBySlug, getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface ServicoPageProps {
  params: Promise<{ slug: string }>;
}

const RELATED_LIMIT = 5;

/** Uma rota estatica por servico publicado. Slug fora da lista cai no notFound(). */
export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Serviço não encontrado" };
  }

  return {
    title: `${service.title} em Araucária`,
    description: service.description,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: { title: service.title, description: service.description },
  };
}

/**
 * Quebra a descricao longa (um paragrafo unico no banco) em paragrafos de
 * duas frases, para leitura confortavel — sem mudar uma palavra do texto.
 */
function toParagraphs(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((sentence) => sentence.trim()) ?? [text];
  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "));
  }
  return paragraphs;
}

export default async function ServicoPage({ params }: ServicoPageProps) {
  const { slug } = await params;
  const [service, services, settings] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getSiteSettingsMap(),
  ]);

  if (!service) {
    notFound();
  }

  const group = groupServices(services).find((candidate) =>
    candidate.services.some((member) => member.id === service.id),
  );
  const related = (group?.services ?? services)
    .filter((candidate) => candidate.id !== service.id)
    .slice(0, RELATED_LIMIT);
  const whatsappMessage = `Olá! Gostaria de agendar uma avaliação de ${service.title}.`;
  const whatsappHref = buildWhatsAppUrl(settings.whatsapp, whatsappMessage);

  return (
    <>
      <PageHero
        title={service.title}
        lead={service.description}
        kicker={group?.title ?? service.category ?? undefined}
        back={{ href: "/servicos", label: "Todos os serviços" }}
        visual={
          <div className="flex justify-center lg:justify-end">
            <span className="float relative inline-flex h-56 w-56 items-center justify-center rounded-full bg-blue-dark/60 text-white shadow-2xl shadow-blue-deep/60 ring-1 ring-white/15">
              <span aria-hidden className="absolute -inset-4 rounded-full border-2 border-terracotta-soft/50" />
              <ServiceIcon slug={service.slug} width={128} height={128} strokeWidth={1.25} />
            </span>
          </div>
        }
      />

      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20 lg:py-20">
        <article className="max-w-prose">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            O que é {service.title.toLowerCase()}
          </h2>
          {/*
           * `long_description` e opcional no tipo: servico sem texto longo cai
           * na descricao curta da listagem em vez de renderizar um vazio.
           */}
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-muted">
            {toParagraphs(service.long_description ?? service.description).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="relative mt-10 overflow-hidden rounded-3xl bg-blue-dark p-6 text-white sm:p-8">
            <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
            <div className="relative">
              <h3 className="text-xl font-medium text-white sm:text-2xl">Vale para o meu caso?</h3>
              <p className="mt-2 text-base leading-relaxed text-white/85">
                Só a avaliação responde isso. Ela inclui exame clínico, conversa
                sobre o que você espera e, quando necessário, exames de imagem —
                e termina com um plano explicado etapa por etapa.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("inverse")}
                >
                  <IconWhatsApp width={18} height={18} />
                  Agendar avaliação
                </a>
                <Link href="/contato" className={buttonClasses("outline-inverse")}>
                  Enviar mensagem
                </Link>
              </div>
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          {related.length > 0 && (
            <nav aria-label="Serviços relacionados" className="rounded-3xl border border-ink/10 bg-surface-tint p-6">
              <p className="font-display text-lg font-medium">
                {group ? `Mais em ${group.title.toLowerCase()}` : "Outros serviços"}
              </p>
              <ul className="mt-4 divide-y divide-ink/10">
                {related.map((candidate) => (
                  <li key={candidate.id}>
                    <Link
                      href={`/servicos/${candidate.slug}`}
                      className="group flex items-center gap-3 py-3 text-base transition-colors ease-out hover:text-blue-dark"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-blue-dark">
                        <ServiceIcon slug={candidate.slug} width={20} height={20} />
                      </span>
                      <span className="flex-1">{candidate.title}</span>
                      <IconArrowRight
                        width={16}
                        height={16}
                        className="shrink-0 text-ink-muted transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-blue-dark"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/servicos"
                className="mt-4 inline-flex text-sm font-medium text-blue-dark underline-offset-4 hover:underline"
              >
                Ver todos os serviços
              </Link>
            </nav>
          )}
        </aside>
      </Container>

      <CtaBand
        whatsapp={settings.whatsapp}
        phone={settings.phone}
        title={`Quer conversar sobre ${service.title.toLowerCase()}?`}
        whatsappMessage={whatsappMessage}
      />
    </>
  );
}

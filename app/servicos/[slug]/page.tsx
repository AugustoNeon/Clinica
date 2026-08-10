import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { getServiceBySlug, getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

interface ServicoPageProps {
  params: Promise<{ slug: string }>;
}

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
    title: service.title,
    description: service.description,
  };
}

export default async function ServicoPage({ params }: ServicoPageProps) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug),
    getSiteSettingsMap(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <Section>
      <div className="max-w-2xl">
        <Link
          href="/servicos"
          className="text-sm font-medium text-blue-dark underline-offset-4 hover:underline"
        >
          &larr; Voltar aos serviços
        </Link>

        {service.category && (
          <p className="mt-6 text-xs uppercase tracking-wide text-ink-muted">
            {service.category}
          </p>
        )}

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {service.title}
        </h1>

        {/*
         * `long_description` e opcional no tipo: servico sem texto longo cai
         * na descricao curta da listagem em vez de renderizar um vazio.
         */}
        <p className="mt-5 text-base leading-relaxed text-ink-muted">
          {service.long_description ?? service.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contato" className={buttonClasses("primary")}>
            Agendar avaliação
          </Link>
          <WhatsAppCta
            whatsapp={settings.whatsapp}
            message={`Olá! Gostaria de agendar uma avaliação de ${service.title}.`}
          />
        </div>
      </div>
    </Section>
  );
}

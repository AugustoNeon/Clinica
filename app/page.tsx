import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { LocationMap } from "@/components/sections/LocationMap";
import { ServiceList } from "@/components/sections/ServiceList";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { TestimonialList } from "@/components/sections/TestimonialList";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { getTeamMembers } from "@/lib/data/team";
import { getTestimonials } from "@/lib/data/testimonials";

export default async function HomePage() {
  const [settings, services, team, testimonials] = await Promise.all([
    getSiteSettingsMap(),
    getServices(),
    getTeamMembers(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero title={settings.clinic_name} subtitle={settings.clinic_tagline} />

      <Section
        title="Servicos"
        description="Conheça as especialidades atendidas pela clínica."
      >
        <ServiceList services={services} />
      </Section>

      <Section
        title="Equipe"
        description="A Dra. Ariane Vaz Storrer é a única profissional da clínica."
      >
        <TeamGrid members={team} />
      </Section>

      <Section
        title="Depoimentos"
        description="Depoimentos de placeholder. Publicar depoimento real exige consentimento por escrito do paciente."
      >
        <TestimonialList testimonials={testimonials} />
      </Section>

      <Section
        title="Convênios e formas de pagamento"
        description="Informações confirmadas pela clínica em 2026-08-05."
      >
        <dl className="grid gap-6 sm:grid-cols-2 sm:max-w-3xl">
          <div>
            <dt className="text-sm font-medium">Convênio atendido</dt>
            <dd className="mt-1 text-sm text-ink-muted">{settings.insurance}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium">Formas de pagamento</dt>
            <dd className="mt-1 text-sm text-ink-muted">{settings.payment_methods}</dd>
          </div>
        </dl>
      </Section>

      <Section title="Onde fica a clínica" description={settings.address}>
        <LocationMap embedUrl={settings.maps_embed_url} />
      </Section>

      {/* Fechamento da home: ultimo CTA antes do rodape. */}
      <Section
        className="bg-surface-tint"
        title="Agende sua avaliação"
        description="Conte o que você está sentindo ou o que quer mudar no seu sorriso — a avaliação define o próximo passo."
      >
        <Link href="/contato" className={buttonClasses("primary")}>
          Falar com a clínica
        </Link>
      </Section>
    </>
  );
}

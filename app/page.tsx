import { Hero } from "@/components/sections/Hero";
import { ServiceList } from "@/components/sections/ServiceList";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { TestimonialList } from "@/components/sections/TestimonialList";
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
    </>
  );
}

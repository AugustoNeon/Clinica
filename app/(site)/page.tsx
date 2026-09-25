import { CtaBand } from "@/components/sections/CtaBand";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { Faq } from "@/components/sections/Faq";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { Hero } from "@/components/sections/Hero";
import { PracticalInfo } from "@/components/sections/PracticalInfo";
import { Steps } from "@/components/sections/Steps";
import { TestimonialList } from "@/components/sections/TestimonialList";
import { UrgencyBar } from "@/components/sections/UrgencyBar";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { Section } from "@/components/ui/Section";
import { getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { getTeamMembers } from "@/lib/data/team";
import { getTestimonials } from "@/lib/data/testimonials";

/**
 * Home (issue #65; reorganizada na #73). A ordem segue a decisao de quem
 * procura dentista pelo celular (PRODUCT.md): primeiro QUEM atende — a
 * clinica e uma profissional so, e isso e o que a diferencia —, depois o
 * que ela faz, como e a primeira consulta, as duvidas, onde fica e a
 * chamada final. Nao e a "cascata padrao" de landing page.
 *
 * Depoimentos so aparecem quando existe pelo menos um REAL: exemplo
 * rotulado como placeholder nao e prova social, e prova social inventada e
 * o sinal de pagina gerada que as skills de revisao mais apontam. Os de
 * exemplo continuam no banco ate a doutora trocar (checklist).
 *
 * Ritmo de cor: azul vivo -> coral -> ceu -> branco -> pessego -> branco ->
 * ceu -> azul vivo -> rodape marinho.
 */
export default async function HomePage() {
  const [settings, services, team, testimonials] = await Promise.all([
    getSiteSettingsMap(),
    getServices(),
    getTeamMembers(),
    getTestimonials(),
  ]);
  const professional = team[0] ?? null;
  const realTestimonials = testimonials.filter((testimonial) => !/placeholder/i.test(testimonial.patient_name));

  return (
    <>
      <LocalBusinessJsonLd settings={settings} services={services} />

      <Hero
        tagline={settings.clinic_tagline}
        whatsapp={settings.whatsapp}
        address={settings.address}
        openingHours={settings.opening_hours}
        insurance={settings.insurance}
        professional={professional ? { name: professional.name, role: professional.role } : null}
      />

      <UrgencyBar whatsapp={settings.whatsapp} />

      {professional && (
        <DoctorIntro
          professional={professional}
          clinicTagline={settings.clinic_tagline}
          whatsapp={settings.whatsapp}
        />
      )}

      <FeaturedServices services={services} whatsapp={settings.whatsapp} />

      <Steps whatsapp={settings.whatsapp} />

      {realTestimonials.length > 0 && (
        <Section title="Quem já passou por aqui" description="Publicados com consentimento por escrito de cada paciente.">
          <TestimonialList testimonials={realTestimonials} />
        </Section>
      )}

      <Faq />

      <PracticalInfo settings={settings} />

      <CtaBand whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}

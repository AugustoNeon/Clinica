import { CtaBand } from "@/components/sections/CtaBand";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { Faq } from "@/components/sections/Faq";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { Hero } from "@/components/sections/Hero";
import { PracticalInfo } from "@/components/sections/PracticalInfo";
import { Steps } from "@/components/sections/Steps";
import { TestimonialList } from "@/components/sections/TestimonialList";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { getTeamMembers } from "@/lib/data/team";
import { getTestimonials } from "@/lib/data/testimonials";

/**
 * Home (issue #65; camada rica na #71). Ordem das secoes segue o funil de
 * quem procura dentista pelo celular (PRODUCT.md): quem e / o que faz /
 * como e / prova social / onde fica / chamada final. Cada bloco le do
 * banco via `lib/data/*`. O ritmo de cor e deliberado: azul profundo →
 * terracota → branco → azul diluido → branco → azul profundo → branco →
 * azul diluido → azul → rodape azul profundo.
 */
export default async function HomePage() {
  const [settings, services, team, testimonials] = await Promise.all([
    getSiteSettingsMap(),
    getServices(),
    getTeamMembers(),
    getTestimonials(),
  ]);
  const professional = team[0] ?? null;
  const hasPlaceholderTestimonial = testimonials.some((testimonial) =>
    /placeholder/i.test(testimonial.patient_name),
  );

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

      <TrustStrip
        insurance={settings.insurance}
        serviceCount={services.length}
        openingHours={settings.opening_hours}
      />

      <FeaturedServices services={services} whatsapp={settings.whatsapp} />

      {professional && (
        <DoctorIntro
          professional={professional}
          clinicTagline={settings.clinic_tagline}
          whatsapp={settings.whatsapp}
        />
      )}

      <Steps whatsapp={settings.whatsapp} />

      {testimonials.length > 0 && (
        <Section
          tone="deep"
          title="Quem já passou por aqui"
          description="Depoimentos publicados só com consentimento por escrito do paciente."
        >
          {hasPlaceholderTestimonial && (
            <div className="mb-8">
              <PlaceholderNotice>
                Os depoimentos abaixo são exemplos. Entram os reais assim que a
                clínica tiver o consentimento por escrito de cada paciente.
              </PlaceholderNotice>
            </div>
          )}
          <TestimonialList testimonials={testimonials} featureFirst={!hasPlaceholderTestimonial} />
        </Section>
      )}

      <Faq />

      <PracticalInfo settings={settings} />

      <CtaBand whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}

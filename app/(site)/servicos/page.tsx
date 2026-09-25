import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { ServiceList } from "@/components/sections/ServiceList";
import { HeroEmblem } from "@/components/ui/HeroEmblem";
import { PageHero } from "@/components/ui/PageHero";
import { IconTooth } from "@/components/ui/serviceIcons";
import { getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Especialidades odontológicas atendidas em Araucária (PR): rotina e prevenção, estética do sorriso, reabilitação, ortodontia, endodontia e cirurgias.",
};

export default async function ServicosPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettingsMap()]);

  return (
    <>
      <PageHero
        title="Serviços e especialidades"
        lead="Tudo o que a clínica atende, organizado pelo que você está procurando. Em dúvida sobre qual é o seu caso? A avaliação inicial resolve isso."
        visual={
          <HeroEmblem>
            <IconTooth width={120} height={120} />
          </HeroEmblem>
        }
      />

      <ServiceList services={services} />

      <CtaBand
        whatsapp={settings.whatsapp}
        phone={settings.phone}
        title="Não sabe por onde começar?"
        text="Mande uma mensagem contando o que está sentindo. A avaliação define qual especialidade faz sentido — e se faz."
      />
    </>
  );
}

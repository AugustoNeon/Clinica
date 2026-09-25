import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { ServiceList } from "@/components/sections/ServiceList";
import { Tooth3D } from "@/components/three/Tooth3D";
import { PageHero } from "@/components/ui/PageHero";
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
        visual={<Tooth3D className="mx-auto aspect-square w-full max-w-[15rem] sm:max-w-xs lg:max-w-md" draggable />}
        visualOnMobile
      />

      <ServiceList services={services} />

      <CtaBand
        whatsapp={settings.whatsapp}
        phone={settings.phone}
        title="Não sabe por onde começar?"
        text="Mande uma mensagem contando o que está sentindo. A avaliação define qual especialidade faz sentido, e se faz."
      />
    </>
  );
}

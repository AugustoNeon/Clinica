import type { Metadata } from "next";
import { ServiceList } from "@/components/sections/ServiceList";
import { Section } from "@/components/ui/Section";
import { getServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Serviços",
};

export default async function ServicosPage() {
  const services = await getServices();

  return (
    <Section
      title="Serviços e especialidades"
      description="Especialidades e procedimentos oferecidos pela clínica."
    >
      <ServiceList services={services} />
    </Section>
  );
}

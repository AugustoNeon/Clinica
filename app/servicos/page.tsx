import type { Metadata } from "next";
import { ServiceList } from "@/components/sections/ServiceList";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Servicos (placeholder)",
};

export default async function ServicosPage() {
  const services = await getServices();

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          Os servicos abaixo sao exemplos genericos. A lista real de
          especialidades depende da pergunta 10 do questionario — e dela sai
          tambem a decisao de dar pagina propria a cada servico.
        </PlaceholderNotice>
      </Container>

      <Section
        title="Servicos e especialidades"
        description="Lista de placeholder, servida por lib/data/services.ts (dados em memoria)."
      >
        <ServiceList services={services} />
      </Section>
    </>
  );
}

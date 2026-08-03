import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export const metadata: Metadata = {
  title: "Contato (placeholder)",
};

export default async function ContatoPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettingsMap()]);

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          Endereco, telefone e horario abaixo sao placeholders. O formulario
          funciona, mas ainda grava em memoria (mock) — nao ha banco de dados
          conectado, e nenhuma mensagem enviada aqui chega a clinica.
        </PlaceholderNotice>
      </Container>

      <Section
        title="Contato"
        description="Envie uma mensagem ou use os dados de atendimento ao lado."
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <ContactForm services={services} />

          <aside className="space-y-6 text-sm">
            <div>
              <p className="font-medium">Endereco</p>
              <p className="mt-1 opacity-80">{settings.address}</p>
            </div>
            <div>
              <p className="font-medium">Telefone</p>
              <p className="mt-1 opacity-80">{settings.phone}</p>
            </div>
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="mt-1 opacity-80">{settings.whatsapp}</p>
            </div>
            <div>
              <p className="font-medium">Horario de atendimento</p>
              <p className="mt-1 opacity-80">{settings.opening_hours}</p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

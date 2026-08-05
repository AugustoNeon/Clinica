import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { LocationMap } from "@/components/sections/LocationMap";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export const metadata: Metadata = {
  title: "Contato",
};

export default async function ContatoPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettingsMap()]);

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          O formulário abaixo funciona, mas ainda grava em memória (mock) — não
          há banco de dados conectado, e nenhuma mensagem enviada aqui chega à
          clínica de verdade ainda.
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
              {/*
               * `wa.me` exige o numero so com digitos e DDI: o valor exibido
               * continua vindo de `settings.whatsapp` (formatado), mas o href
               * e literal porque o mock nao guarda a versao E.164.
               */}
              <p className="mt-1">
                <a
                  href="https://wa.me/5541999981033"
                  className="text-blue-dark underline-offset-4 hover:underline"
                >
                  {settings.whatsapp}
                </a>
              </p>
            </div>
            <div>
              <p className="font-medium">Horario de atendimento</p>
              <p className="mt-1 opacity-80">{settings.opening_hours}</p>
            </div>
          </aside>
        </div>
      </Section>

      <Section title="Como chegar" description={settings.address}>
        <LocationMap embedUrl={settings.maps_embed_url} />
      </Section>
    </>
  );
}

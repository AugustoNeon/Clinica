import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export const metadata: Metadata = {
  title: "Sobre a clinica (placeholder)",
};

export default async function SobrePage() {
  const settings = await getSiteSettingsMap();

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          Historia, missao e diferenciais da clinica sao texto provisorio ate a
          resposta do questionario enviado a cliente.
        </PlaceholderNotice>
      </Container>

      <Section
        title="Sobre a clinica"
        description="Texto institucional de placeholder. Nenhuma informacao aqui foi fornecida pela clinica."
      >
        <div className="max-w-2xl space-y-4 text-base leading-relaxed opacity-90">
          <p>
            Paragrafo de placeholder 1: aqui entra a apresentacao da clinica —
            historia, proposito e o que ela faz de diferente.
          </p>
          <p>
            Paragrafo de placeholder 2: aqui entram estrutura, tecnologia e
            protocolos de atendimento, conforme material enviado pela cliente.
          </p>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium opacity-60">Endereco</dt>
            <dd className="mt-1">{settings.address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium opacity-60">Telefone</dt>
            <dd className="mt-1">{settings.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium opacity-60">Horario</dt>
            <dd className="mt-1">{settings.opening_hours}</dd>
          </div>
        </dl>
      </Section>
    </>
  );
}

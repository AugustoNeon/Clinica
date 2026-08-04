import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export const metadata: Metadata = {
  title: "Sobre a clínica",
};

export default async function SobrePage() {
  const settings = await getSiteSettingsMap();

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          Fotos do espaço físico (fachada, recepção, consultório) ainda não
          foram enviadas pela clínica — entram assim que a Dra. Ariane mandar o
          material.
        </PlaceholderNotice>
      </Container>

      <Section
        title="Sobre a clínica"
        description="Apresentação da clínica e dados de atendimento."
      >
        <div className="max-w-2xl space-y-4 text-base leading-relaxed opacity-90">
          <p>
            A Dra. Ariane Vaz Storrer oferece atendimento humanizado e
            personalizado em odontologia clínica e estética, em Araucária (PR).
            Em atividade há 1 ano na região, a clínica recebe pacientes de todos
            os perfis — da rotina preventiva a tratamentos mais específicos —
            com o objetivo de ajudar cada paciente a sorrir com confiança.
          </p>
          <p>
            O atendimento é particular, com atendimento também a pacientes
            conveniados da SINTRACIMENTO. Fora do horário comum, casos de
            urgência são atendidos diretamente pelo WhatsApp da clínica.
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

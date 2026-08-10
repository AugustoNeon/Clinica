import type { Metadata } from "next";
import { BeforeAfterGallery } from "@/components/sections/BeforeAfterGallery";
import { Section } from "@/components/ui/Section";
import { getBeforeAfterCases } from "@/lib/data/beforeAfter";

export const metadata: Metadata = {
  title: "Resultados",
};

export default async function ResultadosPage() {
  const cases = await getBeforeAfterCases();

  return (
    <Section
      title="Resultados reais"
      description="Casos de pacientes da clínica, publicados com autorização de uso de imagem."
    >
      <BeforeAfterGallery cases={cases} />
    </Section>
  );
}

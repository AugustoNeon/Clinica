import type { Metadata } from "next";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Equipe (placeholder)",
};

export default async function EquipePage() {
  const members = await getTeamMembers();

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          Nenhum profissional real esta listado. Nome, cargo, numero de CRO e
          biografia so entram com material enviado e conferido pela clinica.
        </PlaceholderNotice>
      </Container>

      <Section
        title="Equipe"
        description="Perfis de placeholder, servidos por lib/data/team.ts (dados em memoria)."
      >
        <TeamGrid members={members} />
      </Section>
    </>
  );
}

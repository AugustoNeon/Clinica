import type { Metadata } from "next";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Equipe",
};

export default async function EquipePage() {
  const members = await getTeamMembers();

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          O nome da Dra. Ariane já é real. CRO, biografia e foto ainda não foram
          enviados pela clínica — continuam placeholder até lá.
        </PlaceholderNotice>
      </Container>

      <Section
        title="Equipe"
        description="A Dra. Ariane Vaz Storrer é a única profissional da clínica."
      >
        <TeamGrid members={members} />
      </Section>
    </>
  );
}

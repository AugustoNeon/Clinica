import type { Metadata } from "next";
import { EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { TeamMemberForm } from "@/components/sections/TeamMemberForm";
import { createTeamMemberAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo membro da equipe",
  robots: { index: false, follow: false },
};

export default function NewTeamMemberPage() {
  return (
    <EditorLayout
      title="Novo membro da equipe"
      back={{ href: "/admin/equipe", label: "Equipe" }}
      aside={
        <Tips
          items={[
            "O CRO é obrigatório na divulgação de profissional de odontologia (norma do CFO).",
            "A foto precisa estar hospedada no site (pasta /images/team) ou numa URL pública.",
          ]}
        />
      }
    >
      <TeamMemberForm action={createTeamMemberAction} submitLabel="Criar membro" />
    </EditorLayout>
  );
}

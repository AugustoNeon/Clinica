import type { Metadata } from "next";
import { TeamMemberForm } from "@/components/sections/TeamMemberForm";
import { createTeamMemberAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo membro de equipe",
  robots: { index: false, follow: false },
};

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Novo membro de equipe</h1>
      <TeamMemberForm action={createTeamMemberAction} submitLabel="Criar membro" />
    </div>
  );
}

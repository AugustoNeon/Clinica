import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { DangerZone, EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { TeamMemberForm } from "@/components/sections/TeamMemberForm";
import { buttonClasses } from "@/components/ui/Button";
import { IconExternal } from "@/components/ui/icons";
import { getTeamMemberByIdAdmin } from "@/lib/data/team";
import { deleteTeamMemberAction, updateTeamMemberAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar membro da equipe",
  robots: { index: false, follow: false },
};

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMemberByIdAdmin(id);

  if (!member) {
    notFound();
  }

  const updateWithId = updateTeamMemberAction.bind(null, id);
  const deleteWithId = deleteTeamMemberAction.bind(null, id);

  return (
    <EditorLayout
      title={member.name}
      back={{ href: "/admin/equipe", label: "Equipe" }}
      actions={
        member.published ? (
          <Link href="/equipe" target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary")}>
            <IconExternal width={18} height={18} />
            Ver no site
          </Link>
        ) : undefined
      }
      aside={
        <>
          <Tips
            items={[
              "Enquanto o CRO estiver vazio, a página da equipe mostra um aviso de conteúdo provisório.",
              "A bio aparece inteira na página da equipe; a Home usa um texto institucional fixo.",
            ]}
          />
          <DangerZone text="A clínica tem uma profissional só — excluir deixa a página da equipe vazia.">
            <ConfirmAction
              action={deleteWithId}
              label="Excluir membro"
              question={`Excluir “${member.name}” da equipe?`}
            />
          </DangerZone>
        </>
      }
    >
      <TeamMemberForm member={member} action={updateWithId} submitLabel="Salvar alterações" />
    </EditorLayout>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamMemberForm } from "@/components/sections/TeamMemberForm";
import { getTeamMemberByIdAdmin } from "@/lib/data/team";
import { deleteTeamMemberAction, updateTeamMemberAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar membro de equipe",
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
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar membro de equipe</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="text-sm text-red-600 underline underline-offset-2 dark:text-red-400"
          >
            Excluir
          </button>
        </form>
      </div>
      <div className="mt-6">
        <TeamMemberForm member={member} action={updateWithId} submitLabel="Salvar alteracoes" />
      </div>
    </div>
  );
}

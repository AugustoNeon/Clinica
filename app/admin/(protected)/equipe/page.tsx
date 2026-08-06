import type { Metadata } from "next";
import Link from "next/link";
import { getAllTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Equipe",
  robots: { index: false, follow: false },
};

export default async function AdminTeamPage() {
  const members = await getAllTeamMembers();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Equipe</h1>
        <Link href="/admin/equipe/novo" className="underline underline-offset-2">
          + Novo membro
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/15">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm opacity-70">
                {member.role} — {member.published ? "publicado" : "rascunho"}
              </p>
            </div>
            <Link
              href={`/admin/equipe/${member.id}/editar`}
              className="text-sm underline underline-offset-2"
            >
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { ListRow } from "@/components/admin/ListRow";
import { Notice } from "@/components/admin/Notice";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buttonClasses } from "@/components/ui/Button";
import { IconPlus, IconUser } from "@/components/ui/icons";
import { getAllTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Equipe",
  robots: { index: false, follow: false },
};

export default async function AdminTeamPage() {
  const members = await getAllTeamMembers();
  const missingCro = members.filter((member) => member.published && !member.cro_number);

  return (
    <div>
      <AdminPageHeader
        title="Equipe"
        description="Quem aparece na página da equipe e na apresentação da Home."
        actions={
          <Link href="/admin/equipe/novo" className={buttonClasses("secondary")}>
            <IconPlus width={18} height={18} />
            Novo membro
          </Link>
        }
      />

      {missingCro.length > 0 && (
        <Notice tone="warning" title="CRO faltando" className="mb-6">
          A divulgação de profissional de odontologia exige o número do CRO.
          Enquanto ele não está cadastrado, a página da equipe mostra um aviso
          de conteúdo provisório no lugar.
        </Notice>
      )}

      <AdminPanel flush>
        {members.length === 0 ? (
          <EmptyState
            icon={<IconUser />}
            title="Nenhum profissional cadastrado"
            action={
              <Link href="/admin/equipe/novo" className={buttonClasses("primary")}>
                Cadastrar
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-ink/10">
            {members.map((member) => (
              <ListRow
                key={member.id}
                href={`/admin/equipe/${member.id}/editar`}
                title={member.name}
                leading={
                  member.photo_url ? (
                    <Image
                      src={member.photo_url}
                      alt=""
                      width={96}
                      height={96}
                      className="h-12 w-12 shrink-0 rounded-full object-cover object-top"
                    />
                  ) : (
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-tint text-blue-dark">
                      <IconUser />
                    </span>
                  )
                }
                meta={
                  <>
                    {member.role}
                    {member.cro_number ? ` · ${member.cro_number}` : ""}
                  </>
                }
                badges={
                  <>
                    <StatusBadge tone={member.published ? "success" : "neutral"}>
                      {member.published ? "Publicado" : "Rascunho"}
                    </StatusBadge>
                    {!member.cro_number && <StatusBadge tone="warning">Sem CRO</StatusBadge>}
                    {/placeholder/i.test(member.bio) && <StatusBadge tone="warning">Bio provisória</StatusBadge>}
                  </>
                }
              />
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}

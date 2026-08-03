import type { TeamMember } from "@/types";

/**
 * Camada de dados de `team_members`.
 *
 * IMPLEMENTACAO ATUAL: dados de PLACEHOLDER em memoria — ver o comentario
 * de cabecalho de `lib/data/services.ts` para o contrato de substituicao.
 *
 * Atencao de conteudo: nome, CRO e bio de dentista sao dados reais de
 * profissional. Nada aqui pode virar texto plausivel inventado; so entra
 * material enviado pela cliente.
 */

const PLACEHOLDER_TEAM: TeamMember[] = [
  {
    id: "team-placeholder-1",
    name: "Profissional Exemplo 1 (placeholder)",
    role: "Cargo Exemplo (placeholder)",
    cro_number: "CRO-XX 00000 (placeholder)",
    bio: "Biografia de placeholder do Profissional Exemplo 1. Substituir pelo texto enviado pela cliente.",
    photo_url: null,
    order: 1,
    published: true,
  },
  {
    id: "team-placeholder-2",
    name: "Profissional Exemplo 2 (placeholder)",
    role: "Cargo Exemplo (placeholder)",
    cro_number: "CRO-XX 00000 (placeholder)",
    bio: "Biografia de placeholder do Profissional Exemplo 2. Substituir pelo texto enviado pela cliente.",
    photo_url: null,
    order: 2,
    published: true,
  },
];

/** Membros de equipe publicados, ja ordenados por `order`. */
export async function getTeamMembers(): Promise<TeamMember[]> {
  return PLACEHOLDER_TEAM.filter((member) => member.published).sort(
    (a, b) => a.order - b.order,
  );
}

/** Um membro de equipe publicado pelo id, ou `null` se nao existir. */
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const members = await getTeamMembers();
  return members.find((member) => member.id === id) ?? null;
}

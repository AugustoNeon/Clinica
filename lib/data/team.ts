import type { TeamMember } from "@/types";

/**
 * Camada de dados de `team_members`.
 *
 * IMPLEMENTACAO ATUAL: dados em memoria — ver o comentario de cabecalho de
 * `lib/data/services.ts` para o contrato de substituicao por Supabase.
 *
 * CONTEUDO: nome e cargo sao REAIS desde 2026-08-04. A clinica tem uma unica
 * profissional e a cliente pediu explicitamente que a pagina fale so dela,
 * sem listar terceiros. `cro_number`, `bio` e `photo_url` continuam
 * placeholder: ela foi consultada e preferiu nao detalhar por ora.
 *
 * Atencao de conteudo: nome, CRO e bio de dentista sao dados reais de
 * profissional. Nada aqui pode virar texto plausivel inventado; so entra
 * material enviado pela cliente.
 */

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-ariane",
    name: "Dra. Ariane Vaz Storrer",
    role: "Cirurgiã-Dentista",
    cro_number: null,
    bio: "Biografia ainda não enviada pela clínica (placeholder) — texto real entra assim que a Dra. Ariane enviar.",
    photo_url: null,
    order: 1,
    published: true,
  },
];

/** Membros de equipe publicados, ja ordenados por `order`. */
export async function getTeamMembers(): Promise<TeamMember[]> {
  return TEAM_MEMBERS.filter((member) => member.published).sort((a, b) => a.order - b.order);
}

/** Um membro de equipe publicado pelo id, ou `null` se nao existir. */
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const members = await getTeamMembers();
  return members.find((member) => member.id === id) ?? null;
}

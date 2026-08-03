import type { ContactLead, NewContactLead } from "@/types";

/**
 * Camada de dados de `contact_leads`.
 *
 * IMPLEMENTACAO ATUAL: armazenamento EM MEMORIA (mock). Nao existe projeto
 * Supabase ainda. O array vive no processo do servidor e some a cada
 * restart/deploy — e proposital: enquanto nao ha banco, nenhum dado pessoal
 * fica persistido em lugar nenhum.
 *
 * Troca futura (unico arquivo que muda):
 *   const supabase = getSupabaseServerClient();
 *   const { data, error } = await supabase
 *     .from("contact_leads").insert({ ...input, status: "novo" }).select().single();
 *
 * REGRAS QUE VALEM DESDE JA (PLANEJAMENTO.md secoes 6 e 7):
 * - Nunca logar o conteudo do lead: nome, telefone, e-mail e mensagem sao
 *   dado pessoal. Log de erro so com id/tipo de falha.
 * - Leitura de leads e exclusiva do painel admin autenticado (RLS no
 *   Supabase). Nao criar rota publica de listagem.
 * - Definir politica de retencao/anonimizacao antes de ir para producao.
 */

const leads: ContactLead[] = [];

/** Gera um id opaco para o registro mock. Substituido pelo default do banco. */
function generateId(): string {
  return globalThis.crypto.randomUUID();
}

/**
 * Cria um lead de contato. A validacao (Zod) acontece antes, na Server
 * Action — esta funcao assume um payload ja validado.
 */
export async function createLead(input: NewContactLead): Promise<ContactLead> {
  const lead: ContactLead = {
    ...input,
    id: generateId(),
    status: "novo",
    created_at: new Date().toISOString(),
  };
  leads.push(lead);
  return lead;
}

/**
 * Lista os leads recebidos, do mais recente para o mais antigo.
 *
 * ACESSO RESTRITO: so pode ser chamada de contexto autenticado do painel
 * admin. Enquanto o painel nao existe, nenhuma rota consome esta funcao.
 */
export async function getLeads(): Promise<ContactLead[]> {
  return [...leads].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

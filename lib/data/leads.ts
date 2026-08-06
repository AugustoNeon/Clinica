import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { ContactLead, ContactLeadStatus, NewContactLead } from "@/types";

/**
 * Camada de dados de `contact_leads`.
 *
 * IMPLEMENTACAO: query real no Supabase (Fase 5 PR1, issue #16), via o
 * cliente PRIVILEGIADO (`service_role`) porque a tabela nao tem nenhuma
 * policy de RLS para `anon`/`authenticated` — nem leitura nem escrita
 * (`supabase/migrations/0002_rls_policies.sql`). Dado pessoal (LGPD):
 * acesso restrito ao painel admin autenticado e a esta Server Action.
 *
 * REGRAS QUE VALEM DESDE JA (PLANEJAMENTO.md secoes 6 e 7):
 * - Nunca logar o conteudo do lead: nome, telefone, e-mail e mensagem sao
 *   dado pessoal. Log de erro so com id/tipo de falha.
 * - Leitura de leads e exclusiva do painel admin autenticado. Nao criar
 *   rota publica de listagem.
 * - Definir politica de retencao/anonimizacao antes de ir para producao.
 */

/**
 * Cria um lead de contato. A validacao (Zod) acontece antes, na Server
 * Action — esta funcao assume um payload ja validado.
 */
export async function createLead(input: NewContactLead): Promise<ContactLead> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contact_leads")
    .insert({ ...input, status: "novo" })
    .select()
    .single();

  if (error) throw new Error(`Falha ao criar contact_lead: ${error.message}`);
  return data as ContactLead;
}

/**
 * Lista os leads recebidos, do mais recente para o mais antigo.
 *
 * ACESSO RESTRITO: so pode ser chamada de contexto autenticado do painel
 * admin. Enquanto o painel nao existe, nenhuma rota consome esta funcao.
 */
export async function getLeads(): Promise<ContactLead[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contact_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Falha ao buscar contact_leads: ${error.message}`);
  return data as ContactLead[];
}

/**
 * MUTATION DO PAINEL ADMIN (Fase 5 PR3f, issue #20).
 *
 * Diferente das outras entidades do PR3 (servicos/equipe/blog/depoimentos/
 * site_settings): usa `service_role` (`getSupabaseAdminClient`), NAO o
 * cliente cookie-aware com RLS `authenticated` — `contact_leads` nao tem
 * NENHUMA policy de RLS para `anon`/`authenticated` (0002_rls_policies.sql),
 * de proposito, por ser dado pessoal (LGPD). O controle de acesso e feito
 * pela rota `/admin/leads` estar atras do middleware de autenticacao, nao
 * por RLS. Unico campo mutavel: `status` — nome/telefone/e-mail/mensagem
 * sao o que o paciente enviou, nunca editados.
 */
export async function updateLeadStatus(
  id: string,
  status: ContactLeadStatus,
): Promise<ContactLead> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contact_leads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Falha ao atualizar status do contact_lead: ${error.message}`);
  return data as ContactLead;
}

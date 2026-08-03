import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Clientes Supabase para o SERVIDOR (Server Components, Server Actions,
 * Route Handlers).
 *
 * ESTADO: NAO ESTA LIGADO A NADA AINDA. Nao existe projeto Supabase
 * criado; `lib/data/*` roda com dados mock. Ver o cabecalho de
 * `lib/supabase/client.ts` para o contrato de substituicao.
 *
 * `import "server-only"` e a barreira: se algum dia este modulo for
 * importado por engano de um componente de cliente, o build QUEBRA em
 * vez de vazar a chave de servico para o bundle do browser.
 *
 * Segredos: nenhum valor literal aqui. Criacao preguicosa — o build nao
 * pode depender de env var estar setada.
 */

let serverClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variavel de ambiente ausente: ${name}. Copie .env.example para .env.local e preencha.`,
    );
  }
  return value;
}

/**
 * Cliente de leitura padrao do servidor, com a chave anonima. Respeita
 * Row Level Security — e o que deve ser usado para conteudo publico
 * (servicos, equipe, posts, depoimentos).
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (serverClient) return serverClient;

  serverClient = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false } },
  );
  return serverClient;
}

/**
 * Cliente PRIVILEGIADO (`service_role`), que IGNORA Row Level Security.
 *
 * Uso restrito a operacoes de servidor que precisam escapar de RLS —
 * por exemplo, gravar em `contact_leads` a partir da Server Action do
 * formulario publico. Toda chamada aqui precisa de validacao propria de
 * entrada e de autorizacao explicita: nao ha rede de seguranca do banco.
 *
 * Nunca importar este modulo de codigo de cliente (o `server-only` acima
 * impede).
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  adminClient = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return adminClient;
}

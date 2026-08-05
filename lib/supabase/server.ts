import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

/**
 * Cliente Supabase COOKIE-AWARE, para Server Components/Actions da area
 * `/admin` (Fase 5 PR2, issue #18). Diferente de `getSupabaseServerClient`
 * acima: le/escreve a sessao de autenticacao via cookie httpOnly
 * (`next/headers`), entao sabe QUEM esta logado — nao serve para as
 * queries de conteudo publico (essas continuam com `getSupabaseServerClient`).
 *
 * NAO cacheia instancia (ao contrario dos clientes acima): precisa ler o
 * cookie da request atual a cada chamada, e uma instancia modulo-level
 * vazaria a sessao de um usuario para a proxima request no mesmo processo.
 */
export async function getSupabaseServerComponentClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component nao pode escrever cookie (ex.: renderizacao
            // de pagina, so Server Action/Route Handler podem). O
            // middleware ja cuida de renovar a sessao nesses casos.
          }
        },
      },
    },
  );
}

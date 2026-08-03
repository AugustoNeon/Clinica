import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para o BROWSER (componentes com "use client").
 *
 * ESTADO: NAO ESTA LIGADO A NADA AINDA. Nao existe projeto Supabase
 * criado; `lib/data/*` roda com dados mock. Este arquivo existe como
 * ponto de integracao unico: quando o projeto Supabase existir, so
 * `lib/data/*` passa a chamar estes clientes — paginas e componentes
 * nao mudam.
 *
 * Segredos: NUNCA hardcode chave aqui. Os valores vem de variavel de
 * ambiente (ver `.env.example`). A criacao e PREGUICOSA de proposito —
 * `npm run build` nao pode depender de env var estar setada.
 *
 * Chave usada: `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Ela e publica por
 * design e so e segura com Row Level Security ativa em TODAS as
 * tabelas. A chave `service_role` NUNCA pode aparecer neste arquivo:
 * qualquer coisa importada por codigo de cliente vai para o bundle.
 *
 * Quando entrar autenticacao do painel admin, avaliar `@supabase/ssr`
 * (sessao por cookie, compativel com App Router) no lugar deste
 * `createClient` simples.
 */

let browserClient: SupabaseClient | null = null;

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
 * Devolve (criando na primeira chamada) o cliente Supabase do browser.
 * Lanca erro claro se as variaveis de ambiente nao estiverem definidas.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  browserClient = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
  return browserClient;
}

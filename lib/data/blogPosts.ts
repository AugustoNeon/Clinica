import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";

/**
 * Camada de dados de `blog_posts`.
 *
 * IMPLEMENTACAO: query real no Supabase (Fase 5 PR1, issue #16). Conteudo
 * ainda e PLACEHOLDER (migrado para `supabase/migrations/0003_seed_conteudo_real.sql`)
 * — o blog e escopo confirmado (`lib/config/features.ts`), mas o material
 * real ainda nao chegou da cliente.
 */

/** Posts publicados, do mais recente para o mais antigo. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Falha ao buscar blog_posts: ${error.message}`);
  return data as BlogPost[];
}

/** Um post publicado pelo slug, ou `null` se nao existir. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar blog_post por slug: ${error.message}`);
  return data as BlogPost | null;
}

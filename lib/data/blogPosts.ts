import { getSupabaseServerClient, getSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import type { AdminBlogPostValues } from "@/lib/validation/adminBlogPost";

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

/**
 * MUTATIONS DO PAINEL ADMIN (Fase 5 PR3c, issue #20).
 *
 * Usam `getSupabaseServerComponentClient()` (cookie-aware), NAO
 * `getSupabaseAdminClient()`: a RLS de `blog_posts_admin_write`
 * (`supabase/migrations/0007_admin_write_policies_blog.sql`) e a camada de
 * autorizacao real — o cliente precisa carregar a sessao do usuario logado
 * pra RLS autorizar.
 */

/** Todos os posts (qualquer status), para a listagem do admin. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("title");

  if (error) throw new Error(`Falha ao buscar blog_posts (admin): ${error.message}`);
  return data as BlogPost[];
}

/** Um post pelo id (qualquer status), para a tela de edicao. */
export async function getBlogPostByIdAdmin(id: string): Promise<BlogPost | null> {
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(`Falha ao buscar blog_post por id (admin): ${error.message}`);
  return data as BlogPost | null;
}

export async function createBlogPost(input: AdminBlogPostValues): Promise<BlogPost> {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      ...input,
      author_id: user?.id ?? null,
      published_at: input.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw new Error(`Falha ao criar blog_post: ${error.message}`);
  return data as BlogPost;
}

export async function updateBlogPost(id: string, input: AdminBlogPostValues): Promise<BlogPost> {
  const supabase = await getSupabaseServerComponentClient();
  const existing = await getBlogPostByIdAdmin(id);

  // Preserva a data original de publicacao se o post ja estava publicado —
  // editar um post publicado nao deve "republicar" com data de hoje.
  const published_at =
    input.status !== "published"
      ? null
      : (existing?.published_at ?? new Date().toISOString());

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ ...input, published_at })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Falha ao atualizar blog_post: ${error.message}`);
  return data as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await getSupabaseServerComponentClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir blog_post: ${error.message}`);
}

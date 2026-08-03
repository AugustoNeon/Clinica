import type { BlogPost } from "@/types";

/**
 * Camada de dados de `blog_posts`.
 *
 * IMPLEMENTACAO ATUAL: dados de PLACEHOLDER em memoria — ver o comentario
 * de cabecalho de `lib/data/services.ts` para o contrato de substituicao.
 *
 * O blog e ESCOPO EM ABERTO (PLANEJAMENTO.md, "Decisoes em aberto":
 * pergunta 22 do questionario). A rota existe, mas o link no menu e
 * controlado por `lib/config/features.ts` — nada aqui assume que o blog
 * vai para producao.
 */

const PLACEHOLDER_POSTS: BlogPost[] = [
  {
    id: "post-placeholder-1",
    slug: "post-exemplo-1",
    title: "Post Exemplo 1 (placeholder)",
    content:
      "Conteudo de placeholder do Post Exemplo 1. Substituir por material real quando (e se) o blog for confirmado.",
    cover_image_url: null,
    author_id: null,
    status: "published",
    published_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "post-placeholder-2",
    slug: "post-exemplo-2",
    title: "Post Exemplo 2 (placeholder)",
    content:
      "Conteudo de placeholder do Post Exemplo 2. Substituir por material real quando (e se) o blog for confirmado.",
    cover_image_url: null,
    author_id: null,
    status: "draft",
    published_at: null,
  },
];

/** Posts publicados, do mais recente para o mais antigo. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  return PLACEHOLDER_POSTS.filter((post) => post.status === "published").sort(
    (a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""),
  );
}

/** Um post publicado pelo slug, ou `null` se nao existir. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

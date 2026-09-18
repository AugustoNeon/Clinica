import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { IconArrowRight } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data/blogPosts";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { excerpt, formatDate } from "@/lib/utils/text";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const MORE_POSTS_LIMIT = 3;

/** Uma rota estatica por post publicado. Slug fora da lista cai no notFound(). */
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post não encontrado" };
  }

  return {
    title: post.title,
    description: excerpt(post.content, 160),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: excerpt(post.content, 160),
      publishedTime: post.published_at ?? undefined,
    },
  };
}

/**
 * Pagina de um post (issue #65 — a listagem existia, mas nenhum post
 * abria). O conteudo e texto simples no banco: quebras de linha duplas
 * viram paragrafos; nada de HTML cru.
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
    getSiteSettingsMap(),
  ]);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const more = posts.filter((candidate) => candidate.id !== post.id).slice(0, MORE_POSTS_LIMIT);

  return (
    <>
      <PageHero
        title={post.title}
        kicker={post.published_at ? formatDate(post.published_at) : undefined}
        back={{ href: "/blog", label: "Todos os posts" }}
      />

      <Container className="py-14 sm:py-16 lg:py-20">
        <article className="max-w-prose space-y-5 text-lg leading-relaxed text-ink">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>

        {more.length > 0 && (
          <nav aria-label="Mais posts" className="mt-16 max-w-prose border-t border-ink/10 pt-8">
            <p className="font-display text-xl font-medium">Continue lendo</p>
            <ul className="mt-4 divide-y divide-ink/10">
              {more.map((candidate) => (
                <li key={candidate.id}>
                  <Link
                    href={`/blog/${candidate.slug}`}
                    className="group flex items-center justify-between gap-4 py-3 text-base transition-colors ease-out hover:text-blue-dark"
                  >
                    {candidate.title}
                    <IconArrowRight
                      width={16}
                      height={16}
                      className="shrink-0 text-ink-muted transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-blue-dark"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>

      <CtaBand whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}

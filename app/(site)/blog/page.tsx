import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { HeroEmblem } from "@/components/ui/HeroEmblem";
import { IconArrowRight, IconPen } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { getBlogPosts } from "@/lib/data/blogPosts";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { excerpt, formatDate } from "@/lib/utils/text";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Orientações sobre saúde bucal, prevenção e tratamentos, escritas pela Dra. Ariane Vaz Storrer.",
};

/**
 * Rota CONFIRMADA desde 2026-08-04: a pergunta 22 do questionario voltou
 * "sim" e a Dra. Ariane pretende publicar 1x por semana. O link no menu e
 * fixo (lib/config/navigation.ts) — nao ha mais flag controlando a rota.
 * Falta o conteudo: nenhum post real foi escrito ainda.
 */
export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getBlogPosts(), getSiteSettingsMap()]);
  const hasPlaceholder = posts.some((post) => /placeholder/i.test(post.title));

  return (
    <>
      <PageHero
        title="Blog"
        lead="Orientações práticas sobre saúde bucal, prevenção e o que esperar de cada tratamento, no mesmo tom da consulta."
        visual={
          <HeroEmblem>
            <IconPen width={112} height={112} strokeWidth={1.25} />
          </HeroEmblem>
        }
      />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          {hasPlaceholder && (
            <div className="mb-10 max-w-3xl">
              <PlaceholderNotice>
                O blog é confirmado (a Dra. Ariane pretende publicar 1x por
                semana), mas nenhum post real foi escrito ainda. A listagem
                abaixo é só um exemplo.
              </PlaceholderNotice>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="max-w-xl">
              <p className="font-display text-2xl font-medium">Ainda não há posts publicados.</p>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Os primeiros textos estão a caminho. Enquanto isso, as dúvidas
                mais comuns já estão respondidas na página inicial.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid gap-3 py-8 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
                  >
                    <p className="text-sm text-ink-muted">
                      {post.published_at ? (
                        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                      ) : (
                        "Rascunho"
                      )}
                    </p>
                    <div>
                      <h2 className="text-2xl font-medium transition-colors ease-out group-hover:text-blue-dark">
                        {post.title}
                      </h2>
                      <p className="mt-2 max-w-prose text-base leading-relaxed text-ink-muted">
                        {excerpt(post.content, 180)}
                      </p>
                    </div>
                    <IconArrowRight
                      className="hidden text-ink-muted transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-blue-dark sm:block"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <CtaBand whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}

import type { Metadata } from "next";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getBlogPosts } from "@/lib/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog (placeholder)",
};

/**
 * Rota OPCIONAL. O blog ainda nao foi decidido (pergunta 22 do
 * questionario). A pagina existe e funciona, mas o link no menu so aparece
 * quando `FEATURES.blog` (lib/config/features.ts) for ligado — nenhum
 * componente assume que esta rota vai a producao.
 */
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          O blog ainda nao foi confirmado como escopo. Esta pagina existe como
          rota opcional; nenhum menu depende dela.
        </PlaceholderNotice>
      </Container>

      <Section
        title="Blog"
        description="Listagem de placeholder, servida por lib/data/blogPosts.ts (dados em memoria)."
      >
        {posts.length === 0 ? (
          <p className="opacity-80">Nenhum post publicado ainda.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id}>
                <Card className="h-full">
                  {post.published_at && (
                    <p className="text-xs uppercase tracking-wide opacity-60">
                      {post.published_at.slice(0, 10)}
                    </p>
                  )}
                  <CardTitle>{post.title}</CardTitle>
                  <CardBody>{post.content}</CardBody>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

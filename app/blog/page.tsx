import type { Metadata } from "next";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { getBlogPosts } from "@/lib/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog",
};

/**
 * Rota CONFIRMADA desde 2026-08-04: a pergunta 22 do questionario voltou
 * "sim" e a Dra. Ariane pretende publicar 1x por semana. O link no menu e
 * fixo (lib/config/navigation.ts) — nao ha mais flag controlando a rota.
 * Falta o conteudo: nenhum post real foi escrito ainda.
 */
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          O blog é confirmado (a Dra. Ariane pretende publicar 1x por semana),
          mas nenhum post real foi escrito ainda — a listagem abaixo é só um
          exemplo.
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

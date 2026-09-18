import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { ListRow } from "@/components/admin/ListRow";
import { StatusBadge, type BadgeTone } from "@/components/admin/StatusBadge";
import { buttonClasses } from "@/components/ui/Button";
import { IconExternal, IconPen, IconPlus } from "@/components/ui/icons";
import { getAllBlogPosts } from "@/lib/data/blogPosts";
import { formatDate } from "@/lib/utils/text";
import type { BlogPostStatus } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

const STATUS: Record<BlogPostStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: "Rascunho", tone: "neutral" },
  published: { label: "Publicado", tone: "success" },
  archived: { label: "Arquivado", tone: "warning" },
};

/**
 * Rota CONFIRMADA desde 2026-08-04: a pergunta 22 do questionario voltou
 * "sim" e a Dra. Ariane pretende publicar 1x por semana.
 */
export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();
  const published = posts.filter((post) => post.status === "published").length;

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description={`${published} ${published === 1 ? "post publicado" : "posts publicados"}. Rascunho não aparece no site; arquivado sai do site sem apagar o texto.`}
        actions={
          <Link href="/admin/blog/novo" className={buttonClasses("primary")}>
            <IconPlus width={18} height={18} />
            Novo post
          </Link>
        }
      />

      <AdminPanel flush>
        {posts.length === 0 ? (
          <EmptyState
            icon={<IconPen />}
            title="Nenhum post ainda"
            text="Um texto por semana sobre dúvidas que os pacientes trazem no consultório já faz o blog valer a pena."
            action={
              <Link href="/admin/blog/novo" className={buttonClasses("primary")}>
                Escrever o primeiro
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-ink/10">
            {posts.map((post) => (
              <ListRow
                key={post.id}
                href={`/admin/blog/${post.id}/editar`}
                title={post.title}
                meta={
                  <>
                    {post.published_at ? formatDate(post.published_at) : "Sem data de publicação"}
                    <span className="font-mono text-xs"> · /blog/{post.slug}</span>
                  </>
                }
                badges={
                  <>
                    <StatusBadge tone={STATUS[post.status].tone}>{STATUS[post.status].label}</StatusBadge>
                    {/placeholder/i.test(post.title) && <StatusBadge tone="warning">Exemplo</StatusBadge>}
                  </>
                }
                actions={
                  post.status === "published" ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver ${post.title} no site`}
                      title="Ver no site"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors ease-out hover:bg-surface-sunken hover:text-blue-dark"
                    >
                      <IconExternal width={18} height={18} />
                    </Link>
                  ) : null
                }
              />
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}

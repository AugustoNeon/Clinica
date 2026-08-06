import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

const statusLabels: Record<string, string> = {
  draft: "rascunho",
  published: "publicado",
  archived: "arquivado",
};

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link href="/admin/blog/novo" className="underline underline-offset-2">
          + Novo post
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/15">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-sm opacity-70">
                /{post.slug} — {statusLabels[post.status] ?? post.status}
              </p>
            </div>
            <Link
              href={`/admin/blog/${post.id}/editar`}
              className="text-sm underline underline-offset-2"
            >
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

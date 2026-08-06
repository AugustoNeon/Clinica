import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/sections/BlogPostForm";
import { getBlogPostByIdAdmin } from "@/lib/data/blogPosts";
import { deleteBlogPostAction, updateBlogPostAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar post",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostByIdAdmin(id);

  if (!post) {
    notFound();
  }

  const updateWithId = updateBlogPostAction.bind(null, id);
  const deleteWithId = deleteBlogPostAction.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar post</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="text-sm text-red-600 underline underline-offset-2 dark:text-red-400"
          >
            Excluir
          </button>
        </form>
      </div>
      <div className="mt-6">
        <BlogPostForm post={post} action={updateWithId} submitLabel="Salvar alteracoes" />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { DangerZone, EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { BlogPostForm } from "@/components/sections/BlogPostForm";
import { buttonClasses } from "@/components/ui/Button";
import { IconExternal } from "@/components/ui/icons";
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
    <EditorLayout
      title={post.title}
      back={{ href: "/admin/blog", label: "Blog" }}
      actions={
        post.status === "published" ? (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("secondary")}
          >
            <IconExternal width={18} height={18} />
            Ver no site
          </Link>
        ) : undefined
      }
      aside={
        <>
          <Tips
            items={[
              "“Arquivado” tira o post do site sem apagar o texto — dá para voltar depois.",
              "Mudar o slug muda o endereço; links já compartilhados param de funcionar.",
            ]}
          />
          <DangerZone text="Excluir apaga o texto de vez. Prefira arquivar.">
            <ConfirmAction
              action={deleteWithId}
              label="Excluir post"
              question={`Excluir “${post.title}” para sempre?`}
            />
          </DangerZone>
        </>
      }
    >
      <BlogPostForm post={post} action={updateWithId} submitLabel="Salvar alterações" />
    </EditorLayout>
  );
}

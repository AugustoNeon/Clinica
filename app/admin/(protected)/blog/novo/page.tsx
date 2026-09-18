import type { Metadata } from "next";
import { EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { BlogPostForm } from "@/components/sections/BlogPostForm";
import { createBlogPostAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo post",
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
  return (
    <EditorLayout
      title="Novo post"
      description="Escreva como explica no consultório: uma dúvida real, uma resposta direta."
      back={{ href: "/admin/blog", label: "Blog" }}
      aside={
        <Tips
          items={[
            "Comece em rascunho; publique quando reler no dia seguinte.",
            "Parágrafos curtos, separados por uma linha em branco.",
            "Evite prometer resultado ou citar preço — o post é orientação, não anúncio.",
          ]}
        />
      }
    >
      <BlogPostForm action={createBlogPostAction} submitLabel="Criar post" />
    </EditorLayout>
  );
}

import type { Metadata } from "next";
import { BlogPostForm } from "@/components/sections/BlogPostForm";
import { createBlogPostAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo post",
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Novo post</h1>
      <BlogPostForm action={createBlogPostAction} submitLabel="Criar post" />
    </div>
  );
}

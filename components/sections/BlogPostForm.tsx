"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  blogPostStatusValues,
  initialAdminBlogPostState,
  type AdminBlogPostState,
} from "@/lib/validation/adminBlogPost";
import type { BlogPost } from "@/types";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

const statusLabels: Record<(typeof blogPostStatusValues)[number], string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

interface BlogPostFormProps {
  post?: BlogPost;
  action: (state: AdminBlogPostState, formData: FormData) => Promise<AdminBlogPostState>;
  submitLabel: string;
}

export function BlogPostForm({ post, action, submitLabel }: BlogPostFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminBlogPostState);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

      <Field label="Titulo" error={state.errors.title}>
        <input
          name="title"
          type="text"
          defaultValue={post?.title}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.title)}
        />
      </Field>

      <Field label="Slug" error={state.errors.slug}>
        <input
          name="slug"
          type="text"
          defaultValue={post?.slug}
          placeholder="ex.: dica-de-higiene"
          className={inputClasses}
          aria-invalid={Boolean(state.errors.slug)}
        />
      </Field>

      <Field label="Conteudo" error={state.errors.content}>
        <textarea
          name="content"
          rows={10}
          defaultValue={post?.content}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.content)}
        />
      </Field>

      <Field label="URL da imagem de capa (opcional)" error={state.errors.cover_image_url}>
        <input
          name="cover_image_url"
          type="text"
          defaultValue={post?.cover_image_url ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.cover_image_url)}
        />
      </Field>

      <Field label="Status" error={state.errors.status}>
        <select
          name="status"
          defaultValue={post?.status ?? "draft"}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.status)}
        >
          {blogPostStatusValues.map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>
      </Field>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

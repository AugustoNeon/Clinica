"use client";

import { useActionState, useState } from "react";
import { Notice } from "@/components/admin/Notice";
import { Field, FormActions, FormSection, describedBy, inputClasses } from "@/components/admin/form";
import { slugify } from "@/lib/utils/slug";
import {
  blogPostStatusValues,
  initialAdminBlogPostState,
  type AdminBlogPostState,
} from "@/lib/validation/adminBlogPost";
import type { BlogPost } from "@/types";

const statusLabels: Record<(typeof blogPostStatusValues)[number], string> = {
  draft: "Rascunho — só você vê",
  published: "Publicado — no ar no site",
  archived: "Arquivado — sai do site, texto fica guardado",
};

interface BlogPostFormProps {
  post?: BlogPost;
  action: (state: AdminBlogPostState, formData: FormData) => Promise<AdminBlogPostState>;
  submitLabel: string;
}

export function BlogPostForm({ post, action, submitLabel }: BlogPostFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminBlogPostState);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const errors = state.errors;

  return (
    <form action={formAction} noValidate className="grid gap-6">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <FormSection title="Post">
        <Field id="title" label="Título" error={errors.title}>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={post?.title}
            className={`${inputClasses} text-lg`}
            aria-invalid={Boolean(errors.title)}
            onBlur={(event) => {
              if (!slugTouched && slug === "") setSlug(slugify(event.target.value));
            }}
          />
        </Field>
        <Field
          id="slug"
          label="Endereço (slug)"
          hint={`O post fica em /blog/${slug || "…"}.`}
          error={errors.slug}
        >
          <input
            id="slug"
            name="slug"
            type="text"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            placeholder="ex.: dica-de-higiene"
            className={`${inputClasses} font-mono text-sm`}
            aria-invalid={Boolean(errors.slug)}
            aria-describedby={describedBy("slug", Boolean(errors.slug), true)}
          />
        </Field>
      </FormSection>

      <FormSection title="Conteúdo">
        <Field
          id="content"
          label="Texto"
          hint="Separe os parágrafos com uma linha em branco. O site formata o resto."
          error={errors.content}
        >
          <textarea
            id="content"
            name="content"
            rows={16}
            defaultValue={post?.content}
            className={`${inputClasses} leading-relaxed`}
            aria-invalid={Boolean(errors.content)}
            aria-describedby={describedBy("content", Boolean(errors.content), true)}
          />
        </Field>
      </FormSection>

      <FormSection title="Publicação">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="status" label="Status" error={errors.status}>
            <select
              id="status"
              name="status"
              defaultValue={post?.status ?? "draft"}
              className={inputClasses}
              aria-invalid={Boolean(errors.status)}
            >
              {blogPostStatusValues.map((value) => (
                <option key={value} value={value}>
                  {statusLabels[value]}
                </option>
              ))}
            </select>
          </Field>
          <Field id="cover_image_url" label="URL da imagem de capa" optional error={errors.cover_image_url}>
            <input
              id="cover_image_url"
              name="cover_image_url"
              type="url"
              defaultValue={post?.cover_image_url ?? ""}
              className={inputClasses}
              aria-invalid={Boolean(errors.cover_image_url)}
            />
          </Field>
        </div>
      </FormSection>

      <FormActions submitLabel={submitLabel} pending={isPending} cancelHref="/admin/blog" />
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { Notice } from "@/components/admin/Notice";
import {
  CheckboxField,
  Field,
  FormActions,
  FormSection,
  describedBy,
  inputClasses,
} from "@/components/admin/form";
import { slugify } from "@/lib/utils/slug";
import { initialAdminServiceState, type AdminServiceState } from "@/lib/validation/adminService";
import type { Service } from "@/types";

interface ServiceFormProps {
  service?: Service;
  action: (state: AdminServiceState, formData: FormData) => Promise<AdminServiceState>;
  submitLabel: string;
}

export function ServiceForm({ service, action, submitLabel }: ServiceFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminServiceState);
  // Slug controlado so para sugerir a partir do titulo enquanto estiver vazio (criacao).
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(service));
  const errors = state.errors;

  return (
    <form action={formAction} noValidate className="grid gap-6">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <FormSection title="Identificação" description="Como o serviço aparece nas listas e no endereço da página.">
        <Field id="title" label="Título" error={errors.title}>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={service?.title}
            maxLength={120}
            className={inputClasses}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={describedBy("title", Boolean(errors.title), false)}
            onBlur={(event) => {
              if (!slugTouched && slug === "") setSlug(slugify(event.target.value));
            }}
          />
        </Field>

        <Field
          id="slug"
          label="Endereço (slug)"
          hint={`A página fica em /servicos/${slug || "…"}. Só letras minúsculas, números e hífen.`}
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
            placeholder="ex.: clinico-geral"
            maxLength={120}
            className={`${inputClasses} font-mono text-sm`}
            aria-invalid={Boolean(errors.slug)}
            aria-describedby={describedBy("slug", Boolean(errors.slug), true)}
          />
        </Field>

        <Field id="category" label="Categoria" optional error={errors.category}>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={service?.category ?? ""}
            maxLength={120}
            className={inputClasses}
            aria-invalid={Boolean(errors.category)}
          />
        </Field>
      </FormSection>

      <FormSection title="Textos" description="A descrição curta vai nas listas; a longa, na página do serviço.">
        <Field
          id="description"
          label="Descrição curta"
          hint="Uma ou duas frases, até 300 caracteres."
          error={errors.description}
        >
          <textarea
            id="description"
            name="description"
            rows={2}
            maxLength={300}
            defaultValue={service?.description}
            className={inputClasses}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={describedBy("description", Boolean(errors.description), true)}
          />
        </Field>

        <Field
          id="long_description"
          label="Descrição longa"
          optional
          hint="O que é, para que serve, que tipo de procedimento envolve. Sem preço, prazo ou promessa de resultado."
          error={errors.long_description}
        >
          <textarea
            id="long_description"
            name="long_description"
            rows={8}
            maxLength={4000}
            defaultValue={service?.long_description ?? ""}
            className={inputClasses}
            aria-invalid={Boolean(errors.long_description)}
            aria-describedby={describedBy("long_description", Boolean(errors.long_description), true)}
          />
        </Field>
      </FormSection>

      <FormSection title="Exibição">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="order" label="Ordem de exibição" hint="Menor aparece primeiro." error={errors.order}>
            <input
              id="order"
              name="order"
              type="number"
              min={0}
              defaultValue={service?.order ?? 0}
              className={inputClasses}
              aria-invalid={Boolean(errors.order)}
              aria-describedby={describedBy("order", Boolean(errors.order), true)}
            />
          </Field>
          <Field id="image_url" label="URL da imagem" optional error={errors.image_url}>
            <input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={service?.image_url ?? ""}
              className={inputClasses}
              aria-invalid={Boolean(errors.image_url)}
            />
          </Field>
        </div>
        <CheckboxField
          id="published"
          name="published"
          label="Publicado"
          hint="Visível no site. Desmarque para esconder sem apagar."
          defaultChecked={service?.published ?? false}
        />
      </FormSection>

      <FormActions submitLabel={submitLabel} pending={isPending} cancelHref="/admin/servicos" />
    </form>
  );
}

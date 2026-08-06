"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { initialAdminServiceState, type AdminServiceState } from "@/lib/validation/adminService";
import type { Service } from "@/types";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

interface ServiceFormProps {
  service?: Service;
  action: (state: AdminServiceState, formData: FormData) => Promise<AdminServiceState>;
  submitLabel: string;
}

export function ServiceForm({ service, action, submitLabel }: ServiceFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminServiceState);

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
          defaultValue={service?.title}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.title)}
        />
      </Field>

      <Field label="Slug" error={state.errors.slug}>
        <input
          name="slug"
          type="text"
          defaultValue={service?.slug}
          placeholder="ex.: clinico-geral"
          className={inputClasses}
          aria-invalid={Boolean(state.errors.slug)}
        />
      </Field>

      <Field label="Descricao curta" error={state.errors.description}>
        <textarea
          name="description"
          rows={2}
          defaultValue={service?.description}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.description)}
        />
      </Field>

      <Field label="Descricao longa (pagina do servico)" error={state.errors.long_description}>
        <textarea
          name="long_description"
          rows={6}
          defaultValue={service?.long_description ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.long_description)}
        />
      </Field>

      <Field label="Categoria (opcional)" error={state.errors.category}>
        <input
          name="category"
          type="text"
          defaultValue={service?.category ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.category)}
        />
      </Field>

      <Field label="URL da imagem (opcional)" error={state.errors.image_url}>
        <input
          name="image_url"
          type="text"
          defaultValue={service?.image_url ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.image_url)}
        />
      </Field>

      <Field label="Ordem de exibicao" error={state.errors.order}>
        <input
          name="order"
          type="number"
          min={0}
          defaultValue={service?.order ?? 0}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.order)}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={service?.published ?? false} />
        Publicado (visivel no site)
      </label>

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

"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  initialAdminTestimonialState,
  type AdminTestimonialState,
} from "@/lib/validation/adminTestimonial";
import type { Testimonial } from "@/types";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

interface TestimonialFormProps {
  testimonial?: Testimonial;
  action: (state: AdminTestimonialState, formData: FormData) => Promise<AdminTestimonialState>;
  submitLabel: string;
}

export function TestimonialForm({ testimonial, action, submitLabel }: TestimonialFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminTestimonialState);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

      <Field label="Nome do paciente" error={state.errors.patient_name}>
        <input
          name="patient_name"
          type="text"
          defaultValue={testimonial?.patient_name}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.patient_name)}
        />
      </Field>

      <Field label="Depoimento" error={state.errors.content}>
        <textarea
          name="content"
          rows={5}
          defaultValue={testimonial?.content}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.content)}
        />
      </Field>

      <Field label="Avaliacao (1 a 5)" error={state.errors.rating}>
        <input
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={testimonial?.rating ?? 5}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.rating)}
        />
      </Field>

      <Field label="URL da foto (opcional)" error={state.errors.photo_url}>
        <input
          name="photo_url"
          type="text"
          defaultValue={testimonial?.photo_url ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.photo_url)}
        />
      </Field>

      <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="consent_confirmed"
            defaultChecked={testimonial?.consent_confirmed ?? false}
            className="mt-0.5"
          />
          <span>
            Confirmo que tenho o <strong>consentimento por escrito do paciente</strong> pra
            publicar este depoimento (LGPD). Sem esta marcacao, o depoimento nunca aparece no
            site, mesmo que &quot;Publicado&quot; esteja marcado abaixo.
          </span>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={testimonial?.published ?? false}
        />
        Publicado (visivel no site, se o consentimento acima tambem estiver marcado)
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

"use client";

import { useActionState } from "react";
import { Notice } from "@/components/admin/Notice";
import {
  CheckboxField,
  Field,
  FormActions,
  FormSection,
  describedBy,
  inputClasses,
} from "@/components/admin/form";
import {
  initialAdminTestimonialState,
  type AdminTestimonialState,
} from "@/lib/validation/adminTestimonial";
import type { Testimonial } from "@/types";

const RATINGS = [5, 4, 3, 2, 1];

interface TestimonialFormProps {
  testimonial?: Testimonial;
  action: (state: AdminTestimonialState, formData: FormData) => Promise<AdminTestimonialState>;
  submitLabel: string;
}

export function TestimonialForm({ testimonial, action, submitLabel }: TestimonialFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminTestimonialState);
  const errors = state.errors;

  return (
    <form action={formAction} noValidate className="grid gap-6">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <FormSection title="Depoimento">
        <Field
          id="patient_name"
          label="Nome do paciente"
          hint="Como o paciente autorizou aparecer (pode ser só o primeiro nome)."
          error={errors.patient_name}
        >
          <input
            id="patient_name"
            name="patient_name"
            type="text"
            defaultValue={testimonial?.patient_name}
            className={inputClasses}
            aria-invalid={Boolean(errors.patient_name)}
            aria-describedby={describedBy("patient_name", Boolean(errors.patient_name), true)}
          />
        </Field>
        <Field id="content" label="Texto do depoimento" error={errors.content}>
          <textarea
            id="content"
            name="content"
            rows={5}
            defaultValue={testimonial?.content}
            className={inputClasses}
            aria-invalid={Boolean(errors.content)}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="rating" label="Avaliação" error={errors.rating}>
            <select
              id="rating"
              name="rating"
              defaultValue={testimonial?.rating ?? 5}
              className={inputClasses}
              aria-invalid={Boolean(errors.rating)}
            >
              {RATINGS.map((value) => (
                <option key={value} value={value}>
                  {"★".repeat(value)}
                  {"☆".repeat(5 - value)} — {value} de 5
                </option>
              ))}
            </select>
          </Field>
          <Field id="photo_url" label="URL da foto" optional error={errors.photo_url}>
            <input
              id="photo_url"
              name="photo_url"
              type="url"
              defaultValue={testimonial?.photo_url ?? ""}
              className={inputClasses}
              aria-invalid={Boolean(errors.photo_url)}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title="Publicação"
        description="Depoimento é dado pessoal: só vai ao ar com as duas marcações abaixo."
      >
        <div className="rounded-xl border border-amber-600/30 bg-amber-50 p-4">
          <CheckboxField
            id="consent_confirmed"
            name="consent_confirmed"
            label="Tenho o consentimento por escrito do paciente para publicar este depoimento (LGPD)."
            hint="Sem esta marcação o depoimento nunca aparece no site, mesmo publicado."
            defaultChecked={testimonial?.consent_confirmed ?? false}
          />
        </div>
        <CheckboxField
          id="published"
          name="published"
          label="Publicado"
          hint="Visível no site, se o consentimento acima também estiver marcado."
          defaultChecked={testimonial?.published ?? false}
        />
      </FormSection>

      <FormActions submitLabel={submitLabel} pending={isPending} cancelHref="/admin/depoimentos" />
    </form>
  );
}

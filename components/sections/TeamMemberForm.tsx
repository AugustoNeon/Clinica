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
  initialAdminTeamMemberState,
  type AdminTeamMemberState,
} from "@/lib/validation/adminTeamMember";
import type { TeamMember } from "@/types";

interface TeamMemberFormProps {
  member?: TeamMember;
  action: (state: AdminTeamMemberState, formData: FormData) => Promise<AdminTeamMemberState>;
  submitLabel: string;
}

export function TeamMemberForm({ member, action, submitLabel }: TeamMemberFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminTeamMemberState);
  const errors = state.errors;

  return (
    <form action={formAction} noValidate className="grid gap-6">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

      <FormSection title="Profissional">
        <Field id="name" label="Nome" hint="Como deve aparecer no site, com o Dra." error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={member?.name}
            className={inputClasses}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name", Boolean(errors.name), true)}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="role" label="Cargo" error={errors.role}>
            <input
              id="role"
              name="role"
              type="text"
              defaultValue={member?.role}
              placeholder="ex.: Cirurgiã-Dentista"
              className={inputClasses}
              aria-invalid={Boolean(errors.role)}
            />
          </Field>
          <Field
            id="cro_number"
            label="CRO"
            hint="Ex.: CRO-PR 12345. Obrigatório na divulgação de profissional."
            error={errors.cro_number}
          >
            <input
              id="cro_number"
              name="cro_number"
              type="text"
              defaultValue={member?.cro_number ?? ""}
              className={inputClasses}
              aria-invalid={Boolean(errors.cro_number)}
              aria-describedby={describedBy("cro_number", Boolean(errors.cro_number), true)}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Apresentação" description="Texto e foto da página da equipe e do bloco da Home.">
        <Field
          id="bio"
          label="Biografia"
          hint="Formação, tempo de atuação, o que gosta de fazer na profissão — em primeira ou terceira pessoa, como preferir."
          error={errors.bio}
        >
          <textarea
            id="bio"
            name="bio"
            rows={7}
            defaultValue={member?.bio}
            className={inputClasses}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={describedBy("bio", Boolean(errors.bio), true)}
          />
        </Field>
        <Field
          id="photo_url"
          label="URL da foto"
          optional
          hint="Fotos já no site: /images/team/ariane-01-retrato-casual.jpg, ariane-02-sentada.jpg, ariane-03-jaleco-corpo-inteiro.jpg, ariane-04-jaleco-retrato.jpg."
          error={errors.photo_url}
        >
          <input
            id="photo_url"
            name="photo_url"
            type="text"
            defaultValue={member?.photo_url ?? ""}
            className={`${inputClasses} font-mono text-sm`}
            aria-invalid={Boolean(errors.photo_url)}
            aria-describedby={describedBy("photo_url", Boolean(errors.photo_url), true)}
          />
        </Field>
      </FormSection>

      <FormSection title="Exibição">
        <Field id="order" label="Ordem de exibição" error={errors.order}>
          <input
            id="order"
            name="order"
            type="number"
            min={0}
            defaultValue={member?.order ?? 0}
            className={`${inputClasses} sm:max-w-40`}
            aria-invalid={Boolean(errors.order)}
          />
        </Field>
        <CheckboxField
          id="published"
          name="published"
          label="Publicado"
          hint="Visível no site."
          defaultChecked={member?.published ?? false}
        />
      </FormSection>

      <FormActions submitLabel={submitLabel} pending={isPending} cancelHref="/admin/equipe" />
    </form>
  );
}

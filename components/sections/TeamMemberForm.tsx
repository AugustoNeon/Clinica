"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  initialAdminTeamMemberState,
  type AdminTeamMemberState,
} from "@/lib/validation/adminTeamMember";
import type { TeamMember } from "@/types";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

interface TeamMemberFormProps {
  member?: TeamMember;
  action: (state: AdminTeamMemberState, formData: FormData) => Promise<AdminTeamMemberState>;
  submitLabel: string;
}

export function TeamMemberForm({ member, action, submitLabel }: TeamMemberFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminTeamMemberState);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

      <Field label="Nome" error={state.errors.name}>
        <input
          name="name"
          type="text"
          defaultValue={member?.name}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.name)}
        />
      </Field>

      <Field label="Cargo" error={state.errors.role}>
        <input
          name="role"
          type="text"
          defaultValue={member?.role}
          placeholder="ex.: Cirurgia-dentista"
          className={inputClasses}
          aria-invalid={Boolean(state.errors.role)}
        />
      </Field>

      <Field label="CRO (opcional)" error={state.errors.cro_number}>
        <input
          name="cro_number"
          type="text"
          defaultValue={member?.cro_number ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.cro_number)}
        />
      </Field>

      <Field label="Bio" error={state.errors.bio}>
        <textarea
          name="bio"
          rows={6}
          defaultValue={member?.bio}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.bio)}
        />
      </Field>

      <Field label="URL da foto (opcional)" error={state.errors.photo_url}>
        <input
          name="photo_url"
          type="text"
          defaultValue={member?.photo_url ?? ""}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.photo_url)}
        />
      </Field>

      <Field label="Ordem de exibicao" error={state.errors.order}>
        <input
          name="order"
          type="number"
          min={0}
          defaultValue={member?.order ?? 0}
          className={inputClasses}
          aria-invalid={Boolean(state.errors.order)}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={member?.published ?? false} />
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

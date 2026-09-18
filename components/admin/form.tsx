import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonClasses } from "@/components/ui/Button";

/*
 * Primitivos de formulario do painel (issue #67). Antes cada formulario
 * repetia a mesma string de classes e um `<label>` sem `htmlFor` — agora o
 * rotulo aponta para o campo (leitor de tela e clique no rotulo funcionam),
 * erro e dica ficam ligados por `aria-describedby`, e o foco e o mesmo do
 * formulario publico de contato.
 */

export const inputClasses =
  "w-full rounded-xl border border-ink/20 bg-surface px-3.5 py-2.5 text-base text-ink outline-none transition duration-200 ease-out placeholder:text-ink-muted/70 hover:border-ink/40 focus:border-blue-dark focus:ring-4 focus:ring-blue/20 aria-invalid:border-red-600 aria-invalid:focus:ring-red-600/15 disabled:cursor-not-allowed disabled:bg-surface-sunken";

export const checkboxClasses = "mt-0.5 h-4 w-4 shrink-0 accent-blue-dark";

/** Campo de codigo TOTP (6 digitos): grande, centralizado, com espacamento entre digitos. */
export const codeInputClasses =
  "w-full rounded-xl border border-ink/20 bg-surface px-3 py-3 text-center font-display text-3xl tracking-[0.35em] text-ink outline-none transition duration-200 ease-out hover:border-ink/40 focus:border-blue-dark focus:ring-4 focus:ring-blue/20 aria-invalid:border-red-600";

interface FieldProps {
  id: string;
  label: string;
  /** Texto curto abaixo do rotulo: o que o campo faz / onde aparece no site. */
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function Field({ id, label, hint, error, optional, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-muted">(opcional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-erro`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-dica`} className="mt-1.5 text-sm text-ink-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** `aria-describedby` certo para um campo com dica e/ou erro. */
export function describedBy(id: string, hasError: boolean, hasHint: boolean): string | undefined {
  if (hasError) return `${id}-erro`;
  if (hasHint) return `${id}-dica`;
  return undefined;
}

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: ReactNode;
  hint?: string;
  defaultChecked?: boolean;
  error?: string;
}

export function CheckboxField({ id, name, label, hint, defaultChecked, error }: CheckboxFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 text-sm leading-relaxed">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className={checkboxClasses}
          aria-invalid={Boolean(error)}
        />
        <span>
          <span className="font-medium">{label}</span>
          {hint && <span className="block text-ink-muted">{hint}</span>}
        </span>
      </label>
      {error && <p className="mt-1.5 text-sm text-red-700">{error}</p>}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Agrupa campos relacionados com um titulo — o formulario deixa de ser uma coluna infinita. */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6">
      <legend className="px-1 font-display text-lg font-medium">{title}</legend>
      {description && <p className="-mt-1 mb-5 text-sm text-ink-muted">{description}</p>}
      <div className="grid gap-5">{children}</div>
    </fieldset>
  );
}

interface FormActionsProps {
  submitLabel: string;
  pending: boolean;
  pendingLabel?: string;
  cancelHref?: string;
  disabled?: boolean;
  children?: ReactNode;
}

/** Rodape do formulario: salvar + cancelar (volta para a lista). */
export function FormActions({
  submitLabel,
  pending,
  pendingLabel = "Salvando…",
  cancelHref,
  disabled = false,
  children,
}: FormActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit" size="lg" disabled={pending || disabled}>
        {pending ? pendingLabel : submitLabel}
      </Button>
      {cancelHref && (
        <Link href={cancelHref} className={buttonClasses("ghost", "", "lg")}>
          Cancelar
        </Link>
      )}
      {children}
    </div>
  );
}

"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useState, type FormEvent } from "react";
import { submitContactForm } from "@/app/(site)/contato/actions";
import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/icons";
import {
  initialContactFormState,
  validateContactForm,
  type ContactFieldErrors,
  type ContactFormInput,
} from "@/lib/validation/contact";
import type { Service } from "@/types";

interface ContactFormProps {
  /** Opcoes de "servico de interesse", vindas de `lib/data/services.ts`. */
  services: Service[];
}

const EMPTY_VALUES: ContactFormInput = {
  name: "",
  phone: "",
  email: "",
  message: "",
  preferred_service: "",
  lgpd_consent: false,
};

/*
 * Campos: borda `ink/20` (nao cinza claro generico), foco em `blue-dark` com
 * anel suave, e `aria-invalid` pinta a borda de vermelho — o erro e visivel
 * antes mesmo de ler a mensagem. Fundo branco sempre (o formulario pode
 * ficar sobre `surface-tint`).
 */
const inputClasses =
  "w-full rounded-xl border border-ink/20 bg-surface px-4 py-3 text-base text-ink outline-none transition duration-200 ease-out placeholder:text-ink-muted/70 hover:border-ink/40 focus:border-blue-dark focus:ring-4 focus:ring-blue/20 aria-invalid:border-red-600 aria-invalid:focus:ring-red-600/15";

export function ContactForm({ services }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );
  const [values, setValues] = useState<ContactFormInput>(EMPTY_VALUES);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});

  // Erro do cliente tem precedencia visual, mas o servidor e quem decide:
  // mesmo schema nos dois lados (lib/validation/contact.ts).
  const errors: ContactFieldErrors = { ...state.errors, ...clientErrors };

  function update<K extends keyof ContactFormInput>(field: K, value: ContactFormInput[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setClientErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Validacao no cliente: evita ida ao servidor com dado obviamente
    // invalido. NAO substitui a validacao da Server Action.
    const result = validateContactForm(values);
    if (!result.success) {
      event.preventDefault();
      setClientErrors(result.errors);
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-blue/30 bg-surface-tint p-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-dark text-white">
          <IconCheck width={24} height={24} />
        </span>
        <p className="mt-4 font-display text-2xl font-medium">Mensagem enviada</p>
        <p className="mt-2 text-base leading-relaxed text-ink-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl border border-red-600/40 bg-red-50 p-4 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Nome completo" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            className={inputClasses}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field id="phone" label="Telefone / WhatsApp" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="(41) 99999-9999"
            className={inputClasses}
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label="E-mail" hint="opcional" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={180}
            className={inputClasses}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field
          id="preferred_service"
          label="Serviço de interesse"
          hint="opcional"
          error={errors.preferred_service}
        >
          <select
            id="preferred_service"
            name="preferred_service"
            className={inputClasses}
            value={values.preferred_service}
            onChange={(event) => update("preferred_service", event.target.value)}
          >
            <option value="">Não sei / outro</option>
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label="Mensagem" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={2000}
          placeholder="Ex.: sinto sensibilidade no lado esquerdo há duas semanas…"
          className={inputClasses}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      <div>
        <label htmlFor="lgpd_consent" className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            id="lgpd_consent"
            name="lgpd_consent"
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-blue-dark"
            checked={values.lgpd_consent}
            onChange={(event) => update("lgpd_consent", event.target.checked)}
            aria-invalid={Boolean(errors.lgpd_consent)}
          />
          {/* LGPD: consentimento explicito, nunca marcado por default. */}
          <span>
            Li e concordo com a{" "}
            <Link href="/privacidade" className="font-medium text-blue-dark underline underline-offset-4">
              Política de Privacidade
            </Link>{" "}
            e autorizo o contato pelos dados informados.
          </span>
        </label>
        {errors.lgpd_consent && (
          <p className="mt-1.5 text-sm text-red-700">{errors.lgpd_consent}</p>
        )}
      </div>

      {/*
        TURNSTILE (Cloudflare, issue #51) — liga sozinho quando
        NEXT_PUBLIC_TURNSTILE_SITE_KEY existir (embutida no build, e
        publica por natureza: e so o identificador do widget, nao um
        segredo). Sem a key, nada e renderizado e o formulario segue
        funcionando normal — a verificacao no servidor
        (app/(site)/contato/actions.ts) tambem e pulada nesse caso.
      */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <>
          <div
            className="cf-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        </>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Enviando…" : "Enviar mensagem"}
        </Button>
        <p className="text-sm text-ink-muted">Resposta no horário de atendimento.</p>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {hint && <span className="ml-1.5 font-normal text-ink-muted">({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

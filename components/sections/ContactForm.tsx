"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useState, type FormEvent } from "react";
import { submitContactForm } from "@/app/contato/actions";
import { Button } from "@/components/ui/Button";
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

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

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
      <div
        role="status"
        className="rounded-xl border border-black/10 p-6 text-sm dark:border-white/15"
      >
        <p className="font-medium">Mensagem enviada</p>
        <p className="mt-2 opacity-80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

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
          autoComplete="tel"
          maxLength={30}
          placeholder="(00) 00000-0000"
          className={inputClasses}
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
        />
      </Field>

      <Field id="email" label="E-mail (opcional)" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={180}
          className={inputClasses}
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>

      <Field id="preferred_service" label="Servico de interesse (opcional)" error={errors.preferred_service}>
        <select
          id="preferred_service"
          name="preferred_service"
          className={inputClasses}
          value={values.preferred_service}
          onChange={(event) => update("preferred_service", event.target.value)}
        >
          <option value="">Nao sei / outro</option>
          {services.map((service) => (
            <option key={service.id} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Mensagem" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={2000}
          className={inputClasses}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      <div>
        <label htmlFor="lgpd_consent" className="flex items-start gap-3 text-sm">
          <input
            id="lgpd_consent"
            name="lgpd_consent"
            type="checkbox"
            className="mt-1"
            checked={values.lgpd_consent}
            onChange={(event) => update("lgpd_consent", event.target.checked)}
            aria-invalid={Boolean(errors.lgpd_consent)}
          />
          {/* LGPD: consentimento explicito, nunca marcado por default. */}
          <span>
            Li e concordo com a{" "}
            <Link href="/privacidade" className="underline">
              Politica de Privacidade
            </Link>{" "}
            e autorizo o contato pelos dados informados.
          </span>
        </label>
        {errors.lgpd_consent && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lgpd_consent}</p>
        )}
      </div>

      {/*
        TURNSTILE (Cloudflare, issue #51) — liga sozinho quando
        NEXT_PUBLIC_TURNSTILE_SITE_KEY existir (embutida no build, e
        publica por natureza: e so o identificador do widget, nao um
        segredo). Sem a key, nada e renderizado e o formulario segue
        funcionando normal — a verificacao no servidor
        (app/contato/actions.ts) tambem e pulada nesse caso.
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

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

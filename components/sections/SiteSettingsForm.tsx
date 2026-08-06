"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  initialAdminSiteSettingsState,
  type AdminSiteSettingsState,
} from "@/lib/validation/adminSiteSettings";
import type { SiteSetting } from "@/types";

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

const settingLabels: Record<string, string> = {
  clinic_name: "Nome da clinica",
  clinic_tagline: "Tagline",
  address: "Endereco",
  phone: "Telefone",
  whatsapp: "WhatsApp",
  email: "E-mail",
  opening_hours: "Horario de funcionamento",
  instagram_url: "Instagram (URL)",
  facebook_url: "Facebook (URL)",
  maps_url: "Google Maps (link curto)",
  maps_embed_url: "Google Maps (URL de embed)",
  payment_methods: "Formas de pagamento",
  insurance: "Convenio",
};

interface SiteSettingsFormProps {
  settings: SiteSetting[];
  action: (
    state: AdminSiteSettingsState,
    formData: FormData,
  ) => Promise<AdminSiteSettingsState>;
}

export function SiteSettingsForm({ settings, action }: SiteSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminSiteSettingsState);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}
      {state.status === "success" && state.message && (
        <p className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm">
          {state.message}
        </p>
      )}

      {settings.map((setting) => (
        <Field
          key={setting.key}
          label={settingLabels[setting.key] ?? setting.key}
          error={state.errors[setting.key]}
        >
          {setting.key.includes("embed") ? (
            <textarea
              name={setting.key}
              rows={2}
              defaultValue={setting.value}
              className={inputClasses}
              aria-invalid={Boolean(state.errors[setting.key])}
            />
          ) : (
            <input
              name={setting.key}
              type="text"
              defaultValue={setting.value}
              className={inputClasses}
              aria-invalid={Boolean(state.errors[setting.key])}
            />
          )}
        </Field>
      ))}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar configuracoes"}
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

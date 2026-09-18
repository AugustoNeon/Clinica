"use client";

import { useActionState } from "react";
import { Notice } from "@/components/admin/Notice";
import { Field, FormActions, FormSection, describedBy, inputClasses } from "@/components/admin/form";
import {
  initialAdminSiteSettingsState,
  type AdminSiteSettingsState,
} from "@/lib/validation/adminSiteSettings";
import type { SiteSetting } from "@/types";

interface SettingMeta {
  label: string;
  /** Onde o valor aparece no site e em que formato deve ser preenchido. */
  hint: string;
  kind?: "text" | "textarea" | "url" | "tel" | "email";
}

const META: Record<string, SettingMeta> = {
  clinic_name: {
    label: "Nome da clínica",
    hint: "Título das abas, rodapé, política de privacidade e dados estruturados para o Google.",
  },
  clinic_tagline: {
    label: "Frase de apresentação (tagline)",
    hint: "É o título grande da Home e a citação no bloco da doutora.",
  },
  phone: {
    label: "Telefone fixo",
    hint: "Formato (41) 3031-6454. Vira link de ligação no site.",
    kind: "tel",
  },
  whatsapp: {
    label: "WhatsApp",
    hint: "Número com DDD. O site monta o link do WhatsApp sozinho, com mensagem pronta.",
    kind: "tel",
  },
  email: {
    label: "E-mail",
    hint: "Rodapé, página de contato e canal do titular na política de privacidade.",
    kind: "email",
  },
  address: {
    label: "Endereço",
    hint: "Use o travessão (—) entre rua/número e cidade/UF: é assim que o site separa os dois.",
  },
  maps_url: {
    label: "Link do Google Maps",
    hint: "Link curto de compartilhamento. Vira o botão “Como chegar”.",
    kind: "url",
  },
  maps_embed_url: {
    label: "Mapa incorporado (URL do iframe)",
    hint: "No Google Maps: Compartilhar › Incorporar um mapa › copie só o endereço que está dentro de src=\"…\".",
    kind: "textarea",
  },
  opening_hours: {
    label: "Horário de atendimento",
    hint: "Ex.: 09h00 às 19h00. Esse formato também alimenta o horário nos dados para o Google.",
  },
  insurance: {
    label: "Convênio",
    hint: "Aparece como “Particular e convênio X”. Deixe vazio se não atender convênio.",
  },
  payment_methods: {
    label: "Formas de pagamento",
    hint: "Ex.: Dinheiro, Pix, Cartão (débito e crédito).",
  },
  instagram_url: {
    label: "Instagram",
    hint: "Link completo do perfil. Aparece no rodapé.",
    kind: "url",
  },
  facebook_url: {
    label: "Facebook",
    hint: "Deixe vazio se não usar.",
    kind: "url",
  },
};

const GROUPS: { title: string; description: string; keys: string[] }[] = [
  {
    title: "Identidade",
    description: "Como a clínica se apresenta no topo do site e nos resultados de busca.",
    keys: ["clinic_name", "clinic_tagline"],
  },
  {
    title: "Contato",
    description: "Rodapé, página de contato e todos os botões de WhatsApp.",
    keys: ["phone", "whatsapp", "email"],
  },
  {
    title: "Endereço e mapa",
    description: "Ficha de localização da Home, do Sobre e do Contato.",
    keys: ["address", "maps_url", "maps_embed_url"],
  },
  {
    title: "Atendimento",
    description: "Horário, convênio e pagamento — aparecem no hero e na ficha prática.",
    keys: ["opening_hours", "insurance", "payment_methods"],
  },
  {
    title: "Redes sociais",
    description: "Links do rodapé.",
    keys: ["instagram_url", "facebook_url"],
  },
];

interface SiteSettingsFormProps {
  settings: SiteSetting[];
  action: (
    state: AdminSiteSettingsState,
    formData: FormData,
  ) => Promise<AdminSiteSettingsState>;
}

/**
 * Um formulario so para todas as chaves de `site_settings` (mesmo POST de
 * sempre), agora agrupadas por assunto e com a dica de onde cada valor
 * aparece no site. Chave que nao esta em nenhum grupo cai em "Outros" —
 * nada some se o banco ganhar uma configuracao nova.
 */
export function SiteSettingsForm({ settings, action }: SiteSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialAdminSiteSettingsState);
  const byKey = new Map(settings.map((setting) => [setting.key, setting]));
  const grouped = new Set(GROUPS.flatMap((group) => group.keys));
  const others = settings.filter((setting) => !grouped.has(setting.key));

  function renderField(setting: SiteSetting) {
    const meta = META[setting.key] ?? { label: setting.key, hint: "" };
    const error = state.errors[setting.key];
    const hasHint = meta.hint.length > 0;
    const shared = {
      id: setting.key,
      name: setting.key,
      defaultValue: setting.value,
      className: inputClasses,
      "aria-invalid": Boolean(error),
      "aria-describedby": describedBy(setting.key, Boolean(error), hasHint),
    };
    return (
      <Field key={setting.key} id={setting.key} label={meta.label} hint={meta.hint} error={error}>
        {meta.kind === "textarea" ? (
          <textarea {...shared} rows={3} className={`${inputClasses} font-mono text-xs leading-relaxed`} />
        ) : (
          <input {...shared} type={meta.kind ?? "text"} />
        )}
      </Field>
    );
  }

  return (
    <form action={formAction} noValidate className="grid gap-6">
      {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}
      {state.status === "success" && state.message && <Notice tone="success">{state.message}</Notice>}

      {GROUPS.map((group) => {
        const fields = group.keys.map((key) => byKey.get(key)).filter((s): s is SiteSetting => Boolean(s));
        if (fields.length === 0) return null;
        return (
          <FormSection key={group.title} title={group.title} description={group.description}>
            {fields.map(renderField)}
          </FormSection>
        );
      })}

      {others.length > 0 && (
        <FormSection title="Outros" description="Configurações sem grupo definido.">
          {others.map(renderField)}
        </FormSection>
      )}

      <FormActions submitLabel="Salvar configurações" pending={isPending} />
    </form>
  );
}

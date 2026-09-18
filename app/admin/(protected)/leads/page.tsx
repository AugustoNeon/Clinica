import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AutoSubmitSelect } from "@/components/admin/AutoSubmitSelect";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge, type BadgeTone } from "@/components/admin/StatusBadge";
import { inputClasses } from "@/components/admin/form";
import { IconInbox, IconMail, IconPhone, IconWhatsApp } from "@/components/ui/icons";
import { getLeads } from "@/lib/data/leads";
import { getAllServices } from "@/lib/data/services";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { formatDateTime, relativeDay } from "@/lib/utils/dates";
import { contactLeadStatusLabels, contactLeadStatusValues } from "@/lib/validation/adminLead";
import type { ContactLeadStatus } from "@/types";
import { updateLeadStatusAction } from "./actions";

export const metadata: Metadata = {
  title: "Mensagens",
  robots: { index: false, follow: false },
};

interface LeadsPageProps {
  searchParams: Promise<{ status?: string }>;
}

const TONES: Record<ContactLeadStatus, BadgeTone> = {
  novo: "warning",
  em_atendimento: "info",
  concluido: "success",
  descartado: "neutral",
};

function isStatus(value: string | undefined): value is ContactLeadStatus {
  return (contactLeadStatusValues as readonly string[]).includes(value ?? "");
}

/**
 * Mensagens do formulario de contato (dado pessoal, LGPD): visiveis so
 * aqui, nome/telefone/e-mail/mensagem read-only; so o status muda. Nada
 * desta tela e logado.
 */
export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const { status } = await searchParams;
  const filter = isStatus(status) ? status : null;
  const [leads, services] = await Promise.all([getLeads(), getAllServices()]);
  const serviceBySlug = new Map(services.map((service) => [service.slug, service.title]));

  const sorted = [...leads].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const visible = filter ? sorted.filter((lead) => lead.status === filter) : sorted;
  const counts = Object.fromEntries(
    contactLeadStatusValues.map((value) => [value, leads.filter((lead) => lead.status === value).length]),
  ) as Record<ContactLeadStatus, number>;

  const tabs: { value: ContactLeadStatus | null; label: string; count: number }[] = [
    { value: null, label: "Todas", count: leads.length },
    ...contactLeadStatusValues.map((value) => ({
      value,
      label: contactLeadStatusLabels[value],
      count: counts[value],
    })),
  ];

  return (
    <div>
      <AdminPageHeader
        title="Mensagens"
        description="Quem escreveu pelo formulário do site. Responda pelo WhatsApp ou telefone e marque em que pé está cada contato."
      />

      <nav aria-label="Filtrar por status" className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.value === filter;
          return (
            <Link
              key={tab.label}
              href={tab.value ? `/admin/leads?status=${tab.value}` : "/admin/leads"}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ease-out ${
                active
                  ? "border-blue-dark bg-blue-dark text-white"
                  : "border-ink/15 bg-surface text-ink hover:border-blue hover:bg-surface-tint"
              }`}
            >
              {tab.label}
              <span className={active ? "text-white/80" : "text-ink-muted"}>{tab.count}</span>
            </Link>
          );
        })}
      </nav>

      {visible.length === 0 ? (
        <AdminPanel flush>
          <EmptyState
            icon={<IconInbox />}
            title={filter ? "Nenhuma mensagem com esse status" : "Nenhuma mensagem recebida ainda"}
            text={
              filter
                ? "Troque o filtro acima para ver as outras."
                : "Quando alguém enviar o formulário de contato do site, a mensagem aparece aqui."
            }
          />
        </AdminPanel>
      ) : (
        <ul className="grid gap-4">
          {visible.map((lead) => {
            const updateStatusWithId = updateLeadStatusAction.bind(null, lead.id);
            const firstName = lead.name.trim().split(/\s+/)[0];
            const whatsappHref = buildWhatsAppUrl(
              lead.phone,
              `Olá, ${firstName}! Aqui é a Dra. Ariane. Recebi sua mensagem pelo site.`,
            );
            const serviceTitle = lead.preferred_service
              ? (serviceBySlug.get(lead.preferred_service) ?? lead.preferred_service)
              : null;

            return (
              <li key={lead.id}>
                <article className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm shadow-ink/5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-lg font-medium">{lead.name}</h2>
                      <p className="text-sm text-ink-muted">
                        <time dateTime={lead.created_at} title={formatDateTime(lead.created_at)}>
                          {relativeDay(lead.created_at)}
                        </time>
                        {serviceTitle && <> · interesse em {serviceTitle}</>}
                      </p>
                    </div>
                    <StatusBadge tone={TONES[lead.status]}>{contactLeadStatusLabels[lead.status]}</StatusBadge>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed">{lead.message}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-4">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-dark px-3 py-2 text-sm font-medium text-white transition ease-out hover:brightness-90"
                    >
                      <IconWhatsApp width={16} height={16} />
                      Responder no WhatsApp
                    </a>
                    <a
                      href={`tel:${lead.phone.replace(/\D/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 px-3 py-2 text-sm font-medium text-ink transition-colors ease-out hover:border-blue hover:bg-surface-tint"
                    >
                      <IconPhone width={16} height={16} />
                      {lead.phone}
                    </a>
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 px-3 py-2 text-sm font-medium text-ink transition-colors ease-out hover:border-blue hover:bg-surface-tint"
                      >
                        <IconMail width={16} height={16} />
                        {lead.email}
                      </a>
                    )}

                    <form action={updateStatusWithId} className="ml-auto flex items-center gap-2">
                      <label htmlFor={`status-${lead.id}`} className="text-sm text-ink-muted">
                        Status
                      </label>
                      <AutoSubmitSelect
                        id={`status-${lead.id}`}
                        name="status"
                        defaultValue={lead.status}
                        className={`${inputClasses} w-auto py-1.5 text-sm`}
                      >
                        {contactLeadStatusValues.map((value) => (
                          <option key={value} value={value}>
                            {contactLeadStatusLabels[value]}
                          </option>
                        ))}
                      </AutoSubmitSelect>
                      <noscript>
                        <button type="submit" className="text-sm underline underline-offset-4">
                          Atualizar
                        </button>
                      </noscript>
                    </form>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

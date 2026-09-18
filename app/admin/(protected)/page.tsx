import type { Metadata } from "next";
import Link from "next/link";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buttonClasses } from "@/components/ui/Button";
import { IconArrowRight, IconCalendar, IconExternal, IconPen, IconPlus, IconUsers } from "@/components/ui/icons";
import { adminNavGroups } from "@/lib/config/adminNav";
import { getTotpStatus } from "@/lib/data/adminSecurity";
import { getAppointmentsForMonth } from "@/lib/data/appointments";
import { getAllBlogPosts } from "@/lib/data/blogPosts";
import { getConnectionStatus } from "@/lib/data/googleCalendar";
import { getLeads } from "@/lib/data/leads";
import { getAllPatients } from "@/lib/data/patients";
import { getAllServices } from "@/lib/data/services";
import { getAllTeamMembers } from "@/lib/data/team";
import { getAllTestimonials } from "@/lib/data/testimonials";
import { appointmentStatusLabels } from "@/lib/validation/adminAppointment";
import { contactLeadStatusLabels } from "@/lib/validation/adminLead";
import {
  addDays,
  formatShortDate,
  hourInClinicTimeZone,
  relativeDay,
  todayInClinicTimeZone,
} from "@/lib/utils/dates";

export const metadata: Metadata = {
  title: "Início",
  robots: { index: false, follow: false },
};

const RECENT_LIMIT = 5;

function greeting(hour: number): string {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

interface Pending {
  title: string;
  text: string;
  href: string;
  tone: "warning" | "info";
}

/**
 * Inicio do painel (issue #67): o que precisa de atencao hoje, numeros
 * reais (nada decorativo), proximas consultas, mensagens recentes e a
 * lista de pendencias do site calculada a partir do banco — o mesmo
 * checklist de `docs/checklist-pre-lancamento.md`, so que vivo.
 */
export default async function AdminDashboardPage() {
  const today = todayInClinicTimeZone();
  const weekEnd = addDays(today, 7);
  const [year, month] = today.split("-").map(Number);
  const [endYear, endMonth] = weekEnd.split("-").map(Number);
  const needsNextMonth = endYear !== year || endMonth !== month;

  const [team, leads, services, posts, testimonials, patients, totp, googleConnected, thisMonth, nextMonth] =
    await Promise.all([
      getAllTeamMembers(),
      getLeads().catch(() => []),
      getAllServices(),
      getAllBlogPosts(),
      getAllTestimonials(),
      getAllPatients(),
      getTotpStatus().catch(() => null),
      getConnectionStatus().catch(() => false),
      getAppointmentsForMonth(year, month),
      needsNextMonth ? getAppointmentsForMonth(endYear, endMonth) : Promise.resolve([]),
    ]);

  const professional = team[0] ?? null;
  const firstName = professional ? professional.name.replace(/^Dra?\.\s*/i, "").split(" ")[0] : null;
  const patientById = new Map(patients.map((patient) => [patient.id, patient]));
  const serviceById = new Map(services.map((service) => [service.id, service]));

  const active = [...thisMonth, ...nextMonth].filter((appointment) => appointment.status === "confirmada");
  const todayAppointments = active.filter((appointment) => appointment.date === today);
  const upcoming = active
    .filter((appointment) => appointment.date >= today && appointment.date <= weekEnd)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const newLeads = leads.filter((lead) => lead.status === "novo");
  const recentLeads = [...leads]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, RECENT_LIMIT);

  const publishedServices = services.filter((service) => service.published).length;
  const publishedPosts = posts.filter((post) => post.status === "published").length;
  const publishedTestimonials = testimonials.filter(
    (testimonial) => testimonial.published && testimonial.consent_confirmed,
  ).length;

  const pending: Pending[] = [];
  if (professional && !professional.cro_number) {
    pending.push({
      title: "Cadastrar o número do CRO",
      text: "Obrigatório na divulgação de profissional. Enquanto falta, a página da equipe mostra um aviso.",
      href: `/admin/equipe/${professional.id}/editar`,
      tone: "warning",
    });
  }
  if (professional && /placeholder/i.test(professional.bio)) {
    pending.push({
      title: "Escrever a sua biografia",
      text: "A bio ainda é o texto provisório. O site usa um texto genérico no lugar até você trocar.",
      href: `/admin/equipe/${professional.id}/editar`,
      tone: "warning",
    });
  }
  const placeholderTestimonials = testimonials.filter(
    (testimonial) => testimonial.published && /placeholder/i.test(testimonial.patient_name),
  );
  if (placeholderTestimonials.length > 0) {
    pending.push({
      title: `Trocar ${placeholderTestimonials.length} depoimento(s) de exemplo`,
      text: "Estão publicados com o rótulo de exemplo. Substitua por reais (com consentimento) ou despublique.",
      href: "/admin/depoimentos",
      tone: "warning",
    });
  }
  const placeholderPosts = posts.filter(
    (post) => post.status === "published" && /placeholder/i.test(post.title),
  );
  if (placeholderPosts.length > 0) {
    pending.push({
      title: "Despublicar o post de exemplo",
      text: "Ele aparece no blog do site. Arquive ou escreva o primeiro post real no lugar.",
      href: "/admin/blog",
      tone: "warning",
    });
  }
  if (totp && !totp.enabled) {
    pending.push({
      title: "Ativar a verificação em duas etapas",
      text: "Protege o painel (que guarda dados de pacientes) mesmo se a senha vazar. Leva 2 minutos com o celular.",
      href: "/admin/seguranca",
      tone: "info",
    });
  }
  if (!googleConnected) {
    pending.push({
      title: "Conectar o Google Calendar",
      text: "Sem isso a agenda não mostra os horários livres cruzando com a sua agenda pessoal.",
      href: "/admin/agenda",
      tone: "info",
    });
  }

  const stats = [
    {
      label: "Mensagens novas",
      value: newLeads.length,
      href: "/admin/leads?status=novo",
      hint: newLeads.length === 0 ? "Tudo respondido" : "Aguardando retorno",
    },
    {
      label: "Consultas hoje",
      value: todayAppointments.length,
      href: `/admin/agenda?mes=${today.slice(0, 7)}`,
      hint: formatShortDate(today),
    },
    {
      label: "Próximos 7 dias",
      value: upcoming.length,
      href: "/admin/agenda",
      hint: "consultas confirmadas",
    },
    {
      label: "Pacientes",
      value: patients.length,
      href: "/admin/pacientes",
      hint: "cadastrados",
    },
  ];

  return (
    <div className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted">{formatShortDate(today)}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            {greeting(hourInClinicTimeZone())}
            {firstName ? `, ${firstName}` : ""}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/agenda/consultas/nova" className={buttonClasses("primary")}>
            <IconPlus width={18} height={18} />
            Nova consulta
          </Link>
          <Link href="/admin/pacientes/novo" className={buttonClasses("secondary")}>
            <IconUsers width={18} height={18} />
            Novo paciente
          </Link>
          <Link href="/admin/blog/novo" className={buttonClasses("secondary")}>
            <IconPen width={18} height={18} />
            Novo post
          </Link>
        </div>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className="block rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm shadow-ink/5 transition ease-out hover:border-blue hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
            >
              <p className="text-sm font-medium text-ink-muted">{stat.label}</p>
              <p className="mt-2 font-display text-4xl font-semibold leading-none">{stat.value}</p>
              <p className="mt-2 text-xs text-ink-muted">{stat.hint}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid gap-6">
          <AdminPanel
            title="Próximas consultas"
            description="Confirmadas nos próximos 7 dias."
            action={
              <Link href="/admin/agenda" className="text-sm font-medium text-blue-dark underline-offset-4 hover:underline">
                Abrir agenda
              </Link>
            }
            flush
          >
            {upcoming.length === 0 ? (
              <p className="px-5 py-8 text-sm text-ink-muted">
                Nenhuma consulta confirmada para os próximos dias.
              </p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {upcoming.slice(0, RECENT_LIMIT).map((appointment) => {
                  const patient = patientById.get(appointment.patient_id);
                  const service = appointment.service_id ? serviceById.get(appointment.service_id) : null;
                  return (
                    <li key={appointment.id}>
                      <Link
                        href={`/admin/agenda/consultas/${appointment.id}/editar`}
                        className="flex items-center gap-4 px-5 py-3.5 transition-colors ease-out hover:bg-surface-sunken"
                      >
                        <div className="w-24 shrink-0">
                          <p className="text-sm font-medium">
                            {appointment.date === today ? "Hoje" : formatShortDate(appointment.date)}
                          </p>
                          <p className="text-xs text-ink-muted">{appointment.time}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{patient?.name ?? "Paciente removido"}</p>
                          <p className="truncate text-sm text-ink-muted">
                            {service?.title ?? "Sem serviço definido"}
                          </p>
                        </div>
                        <StatusBadge tone="success">{appointmentStatusLabels[appointment.status]}</StatusBadge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdminPanel>

          <AdminPanel
            title="Mensagens recentes"
            description="Pelo formulário de contato do site."
            action={
              <Link href="/admin/leads" className="text-sm font-medium text-blue-dark underline-offset-4 hover:underline">
                Ver todas
              </Link>
            }
            flush
          >
            {recentLeads.length === 0 ? (
              <p className="px-5 py-8 text-sm text-ink-muted">Nenhuma mensagem recebida ainda.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {recentLeads.map((lead) => (
                  <li key={lead.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{lead.name}</p>
                      <p className="truncate text-sm text-ink-muted">{lead.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge tone={lead.status === "novo" ? "warning" : lead.status === "em_atendimento" ? "info" : "neutral"}>
                        {contactLeadStatusLabels[lead.status]}
                      </StatusBadge>
                      <span className="text-xs text-ink-muted">{relativeDay(lead.created_at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        </div>

        <div className="grid content-start gap-6">
          <AdminPanel title="Pendências do site" description="Calculadas a partir do que está no banco agora." flush>
            {pending.length === 0 ? (
              <p className="px-5 py-8 text-sm text-ink-muted">Nada pendente. O site está redondo.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {pending.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="group flex items-start gap-3 px-5 py-4 transition-colors ease-out hover:bg-surface-sunken"
                    >
                      <span
                        aria-hidden
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.tone === "warning" ? "bg-terracotta" : "bg-blue"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium group-hover:text-blue-dark">{item.title}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">{item.text}</span>
                      </span>
                      <IconArrowRight width={16} height={16} className="mt-1 shrink-0 text-ink-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>

          <AdminPanel title="O site hoje" flush>
            <dl className="divide-y divide-ink/10 text-sm">
              <div className="flex items-center justify-between px-5 py-3">
                <dt className="text-ink-muted">Serviços publicados</dt>
                <dd className="font-medium">
                  {publishedServices} de {services.length}
                </dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <dt className="text-ink-muted">Posts publicados</dt>
                <dd className="font-medium">{publishedPosts}</dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <dt className="text-ink-muted">Depoimentos no ar</dt>
                <dd className="font-medium">{publishedTestimonials}</dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <dt className="text-ink-muted">Google Calendar</dt>
                <dd>
                  <StatusBadge tone={googleConnected ? "success" : "neutral"}>
                    {googleConnected ? "Conectado" : "Não conectado"}
                  </StatusBadge>
                </dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <dt className="text-ink-muted">Duas etapas (MFA)</dt>
                <dd>
                  <StatusBadge tone={totp?.enabled ? "success" : "warning"}>
                    {totp?.enabled ? "Ativa" : "Desativada"}
                  </StatusBadge>
                </dd>
              </div>
            </dl>
            <div className="border-t border-ink/10 px-5 py-3">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-dark underline-offset-4 hover:underline"
              >
                <IconExternal width={16} height={16} />
                Abrir o site em outra aba
              </Link>
            </div>
          </AdminPanel>
        </div>
      </div>

      <section aria-labelledby="atalhos">
        <h2 id="atalhos" className="font-display text-lg font-medium">
          Todas as áreas
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adminNavGroups.flatMap((group) => group.items).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full items-start gap-3 rounded-2xl border border-ink/10 bg-surface p-4 transition ease-out hover:border-blue hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-tint text-blue-dark">
                  <IconCalendar width={18} height={18} className={item.icon === "calendar" ? "" : "hidden"} />
                  {item.icon !== "calendar" && <IconArrowRight width={18} height={18} />}
                </span>
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">{item.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

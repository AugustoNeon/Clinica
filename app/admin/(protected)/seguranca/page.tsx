import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Notice } from "@/components/admin/Notice";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TotpDisableForm } from "@/components/sections/TotpDisableForm";
import { TotpEnrollForm } from "@/components/sections/TotpEnrollForm";
import { INACTIVITY_TIMEOUT_MS, SESSION_TIMEBOX_MS } from "@/lib/adminAuth/constants";
import { generateTotpEnrollment } from "@/lib/adminAuth/totp";
import { getTotpStatus } from "@/lib/data/adminSecurity";

export const metadata: Metadata = {
  title: "Segurança",
  robots: { index: false, follow: false },
};

interface SegurancaPageProps {
  searchParams: Promise<{ ativado?: string; desativado?: string }>;
}

export default async function SegurancaPage({ searchParams }: SegurancaPageProps) {
  const totp = await getTotpStatus();
  const { ativado, desativado } = await searchParams;
  const inactivityMinutes = Math.round(INACTIVITY_TIMEOUT_MS / 60_000);
  const timeboxHours = Math.round(SESSION_TIMEBOX_MS / 3_600_000);

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Segurança"
        description="O painel guarda dados de pacientes. Estas proteções valem para a sua conta."
      />

      {ativado && (
        <Notice tone="success" className="mb-6">
          Verificação em duas etapas ativada. A partir do próximo login o código do celular será pedido.
        </Notice>
      )}
      {desativado && (
        <Notice tone="warning" className="mb-6">
          Verificação em duas etapas desativada. A conta fica protegida só pela senha.
        </Notice>
      )}

      <div className="grid gap-6">
        <AdminPanel
          title="Verificação em duas etapas"
          description="Um código de 6 dígitos do celular, além da senha, a cada login."
          action={
            <StatusBadge tone={totp?.enabled ? "success" : "warning"}>
              {totp?.enabled ? "Ativa" : "Desativada"}
            </StatusBadge>
          }
        >
          {totp?.enabled ? (
            <div className="grid gap-5">
              <p className="text-sm leading-relaxed text-ink-muted">
                Ativa para <strong className="text-ink">{totp.email}</strong>. Perdeu o celular?
                Desative com um código válido antes de trocar de aparelho, e ative de novo no
                aparelho novo.
              </p>
              <TotpDisableForm />
            </div>
          ) : (
            <EnrollSection email={totp?.email ?? ""} />
          )}
        </AdminPanel>

        <AdminPanel title="Sessão" description="Como o painel encerra o acesso sozinho.">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-surface-sunken p-4">
              <dt className="text-ink-muted">Sem atividade</dt>
              <dd className="mt-1 font-display text-2xl font-medium">{inactivityMinutes} min</dd>
              <dd className="mt-1 text-ink-muted">Depois disso, pede login de novo.</dd>
            </div>
            <div className="rounded-xl bg-surface-sunken p-4">
              <dt className="text-ink-muted">Duração máxima</dt>
              <dd className="mt-1 font-display text-2xl font-medium">{timeboxHours} h</dd>
              <dd className="mt-1 text-ink-muted">Mesmo em uso, a sessão expira e pede login.</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Em computador compartilhado, use “Sair” no menu ao terminar. A senha é trocada pelo
            responsável técnico do site; se precisar, peça.
          </p>
        </AdminPanel>
      </div>
    </div>
  );
}

async function EnrollSection({ email }: { email: string }) {
  const enrollment = await generateTotpEnrollment(email);

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
      {/* eslint-disable-next-line @next/next/no-img-element -- data: URI gerado no servidor, next/image nao ajuda aqui */}
      <img
        src={enrollment.qrDataUrl}
        alt="QR code para configurar a verificação em duas etapas"
        width={200}
        height={200}
        className="h-48 w-48 rounded-xl border border-ink/10 bg-surface p-2"
      />
      <div className="grid gap-4">
        <ol className="grid gap-2 text-sm leading-relaxed">
          <li className="flex gap-3">
            <span className="font-display text-lg font-semibold text-blue">1</span>
            <span>
              Instale um aplicativo autenticador no celular (Google Authenticator, Microsoft
              Authenticator ou Authy).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-lg font-semibold text-blue">2</span>
            <span>No aplicativo, toque em adicionar conta e escaneie o QR code ao lado.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-lg font-semibold text-blue">3</span>
            <span>Digite abaixo o código de 6 dígitos que o aplicativo mostrar.</span>
          </li>
        </ol>
        <details className="text-sm text-ink-muted">
          <summary className="cursor-pointer font-medium text-blue-dark">Não consegue escanear?</summary>
          <p className="mt-2">
            Digite esta chave manualmente no aplicativo:{" "}
            <code className="break-all rounded bg-surface-sunken px-1.5 py-0.5 text-xs text-ink">
              {enrollment.secretBase32}
            </code>
          </p>
        </details>
        <TotpEnrollForm secret={enrollment.secretBase32} email={email} />
      </div>
    </div>
  );
}

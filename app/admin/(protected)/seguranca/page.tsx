import type { Metadata } from "next";
import { getTotpStatus } from "@/lib/data/adminSecurity";
import { generateTotpEnrollment } from "@/lib/adminAuth/totp";
import { TotpEnrollForm } from "@/components/sections/TotpEnrollForm";
import { TotpDisableForm } from "@/components/sections/TotpDisableForm";

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

  return (
    <div className="grid max-w-lg gap-6">
      <h1 className="text-2xl font-semibold">Segurança</h1>

      {ativado && (
        <p className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm">
          Verificação em duas etapas ativada.
        </p>
      )}
      {desativado && (
        <p className="rounded-lg border border-black/15 bg-black/5 p-3 text-sm dark:border-white/20 dark:bg-white/10">
          Verificação em duas etapas desativada.
        </p>
      )}

      {totp?.enabled ? (
        <section>
          <p className="mb-4 text-sm">
            Verificação em duas etapas está <strong>ativa</strong> nesta conta.
          </p>
          <TotpDisableForm />
        </section>
      ) : (
        <EnrollSection email={totp?.email ?? ""} />
      )}
    </div>
  );
}

async function EnrollSection({ email }: { email: string }) {
  const enrollment = await generateTotpEnrollment(email);

  return (
    <section className="grid gap-4">
      <p className="text-sm opacity-80">
        Escaneie o QR code com um aplicativo autenticador (Google Authenticator, Authy, etc.) e
        digite o código gerado pra confirmar.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element -- data: URI gerado no servidor, next/image nao ajuda aqui */}
      <img
        src={enrollment.qrDataUrl}
        alt="QR code para configurar a verificação em duas etapas"
        width={200}
        height={200}
        className="rounded-lg border border-black/10 dark:border-white/15"
      />
      <p className="break-all text-xs opacity-70">
        Não consegue escanear? Digite manualmente: <code>{enrollment.secretBase32}</code>
      </p>
      <TotpEnrollForm secret={enrollment.secretBase32} email={email} />
    </section>
  );
}

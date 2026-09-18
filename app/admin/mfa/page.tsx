import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { MfaChallengeForm } from "@/components/sections/MfaChallengeForm";
import { getTotpStatus } from "@/lib/data/adminSecurity";
import { getSupabaseServerComponentClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Verificação em duas etapas",
  robots: { index: false, follow: false },
};

interface MfaPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminMfaPage({ searchParams }: MfaPageProps) {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const totp = await getTotpStatus();
  if (!totp?.enabled) redirect("/admin");

  const { next } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/images/logo/icon-smile.png" alt="" width={512} height={512} className="h-11 w-11" />
          <div className="leading-tight">
            <h1 className="font-display text-2xl font-semibold">Verificação em duas etapas</h1>
            <p className="text-sm text-ink-muted">Falta só o código do celular.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm shadow-ink/5 sm:p-8">
          <p className="mb-5 text-sm leading-relaxed text-ink-muted">
            Abra o aplicativo autenticador (Google Authenticator, Authy…) e
            digite o código de 6 dígitos que aparece para esta conta.
          </p>
          <MfaChallengeForm next={next ?? "/admin"} />
        </div>

        <form action="/admin/logout" method="post" className="mt-6 text-center">
          <button
            type="submit"
            className="text-sm font-medium text-ink-muted underline-offset-4 hover:underline"
          >
            Sair e entrar com outra conta
          </button>
        </form>
      </div>
    </div>
  );
}

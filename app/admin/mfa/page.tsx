import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSupabaseServerComponentClient } from "@/lib/supabase/server";
import { getTotpStatus } from "@/lib/data/adminSecurity";
import { Container } from "@/components/ui/Container";
import { MfaChallengeForm } from "@/components/sections/MfaChallengeForm";

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
    <Container className="flex min-h-[70vh] max-w-md flex-col justify-center py-12">
      <h1 className="mb-2 text-2xl font-semibold">Verificação em duas etapas</h1>
      <p className="mb-6 text-sm opacity-80">
        Digite o código de 6 dígitos do seu aplicativo autenticador.
      </p>
      <MfaChallengeForm next={next ?? "/admin"} />
    </Container>
  );
}

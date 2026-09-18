import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdminLoginForm } from "@/components/sections/AdminLoginForm";
import { IconArrowLeft } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/images/logo/icon-smile.png" alt="" width={512} height={512} className="h-11 w-11" />
          <div className="leading-tight">
            <h1 className="font-display text-2xl font-semibold">Painel da clínica</h1>
            <p className="text-sm text-ink-muted">Dra. Ariane Vaz Storrer</p>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm shadow-ink/5 sm:p-8">
          <AdminLoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium text-blue-dark underline-offset-4 hover:underline"
          >
            <IconArrowLeft width={16} height={16} />
            Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
}

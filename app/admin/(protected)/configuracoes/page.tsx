import type { Metadata } from "next";
import { SiteSettingsForm } from "@/components/sections/SiteSettingsForm";
import { getSiteSettings } from "@/lib/data/siteSettings";
import { updateSiteSettingsAction } from "./actions";

export const metadata: Metadata = {
  title: "Configuracoes",
  robots: { index: false, follow: false },
};

export default async function AdminSiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Configuracoes</h1>
      <p className="mb-6 text-sm opacity-70">
        Dados institucionais (endereco, telefone, redes sociais etc.) usados nas paginas
        publicas do site.
      </p>
      <SiteSettingsForm settings={settings} action={updateSiteSettingsAction} />
    </div>
  );
}

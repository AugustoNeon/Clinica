import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SiteSettingsForm } from "@/components/sections/SiteSettingsForm";
import { buttonClasses } from "@/components/ui/Button";
import { IconExternal } from "@/components/ui/icons";
import { getSiteSettings } from "@/lib/data/siteSettings";
import { updateSiteSettingsAction } from "./actions";

export const metadata: Metadata = {
  title: "Configurações",
  robots: { index: false, follow: false },
};

export default async function AdminSiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Configurações do site"
        description="Dados fixos usados em todas as páginas: contato, endereço, horário, convênio e redes. Salvar aqui atualiza o site inteiro."
        actions={
          <Link href="/" target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary")}>
            <IconExternal width={18} height={18} />
            Ver o site
          </Link>
        }
      />
      <SiteSettingsForm settings={settings} action={updateSiteSettingsAction} />
    </div>
  );
}

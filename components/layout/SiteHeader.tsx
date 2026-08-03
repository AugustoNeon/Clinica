import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { mainNav } from "@/lib/config/navigation";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export async function SiteHeader() {
  const settings = await getSiteSettingsMap();

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {settings.clinic_name}
        </Link>

        <nav aria-label="Navegacao principal">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="opacity-80 hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/contato" className={buttonClasses("primary")}>
          Agendar avaliacao
        </Link>
      </Container>
    </header>
  );
}

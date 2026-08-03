import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav, mainNav } from "@/lib/config/navigation";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export async function SiteFooter() {
  const settings = await getSiteSettingsMap();

  return (
    <footer className="mt-auto border-t border-black/10 py-10 text-sm dark:border-white/15">
      <Container className="grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-semibold">{settings.clinic_name}</p>
          <p className="mt-2 opacity-80">{settings.address}</p>
          <p className="opacity-80">{settings.phone}</p>
          <p className="opacity-80">{settings.opening_hours}</p>
        </div>

        <nav aria-label="Navegacao do rodape">
          <p className="font-semibold">Paginas</p>
          <ul className="mt-2 space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="opacity-80 hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-semibold">Legal</p>
          <ul className="mt-2 space-y-1">
            {footerNav.map((item) => (
              <li key={item.href}>
                {/* LGPD: a politica de privacidade tem que estar linkada no rodape (PLANEJAMENTO.md secao 7). */}
                <Link href={item.href} className="opacity-80 hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

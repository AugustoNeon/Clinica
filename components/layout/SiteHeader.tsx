import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { mainNav } from "@/lib/config/navigation";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export async function SiteHeader() {
  const settings = await getSiteSettingsMap();

  return (
    <header className="border-b border-ink/10 bg-surface">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        {/*
          Versao colorida e horizontal, sem tagline (DESIGN.md → Logo → Header).
          O nome da clinica continua acessivel pelo `alt` — trocou a
          apresentacao, nao a informacao.
        */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo/logo-horizontal-color.png"
            alt={settings.clinic_name}
            width={1600}
            height={480}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav aria-label="Navegacao principal">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink-muted transition-colors ease-out hover:text-blue-dark"
                >
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

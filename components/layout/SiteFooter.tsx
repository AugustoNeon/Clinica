import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav, mainNav } from "@/lib/config/navigation";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export async function SiteFooter() {
  const settings = await getSiteSettingsMap();

  return (
    /*
      Fundo azul solido com o logo branco (DESIGN.md → Logo → Footer). O tom e
      `--blue-dark` e nao `--blue`: branco sobre `--blue` da 3.3:1, que a
      propria tabela do DESIGN.md marca como insuficiente para texto pequeno —
      e rodape e texto pequeno. Sobre `--blue-dark` o mesmo branco da 5.9:1
      (par documentado, invertido), dentro do alvo AA do PRODUCT.md.
    */
    <footer className="mt-auto bg-blue-dark py-10 text-sm text-white">
      <Container className="grid gap-8 sm:grid-cols-3">
        <div>
          <Image
            src="/images/logo/logo-horizontal-white.png"
            alt={settings.clinic_name}
            width={1600}
            height={480}
            className="h-10 w-auto"
          />
          <p className="mt-4 text-white/85">{settings.address}</p>
          <p className="text-white/85">{settings.phone}</p>
          <p className="text-white/85">{settings.opening_hours}</p>
        </div>

        <nav aria-label="Navegacao do rodape">
          <p className="font-semibold">Paginas</p>
          <ul className="mt-2 space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/85 transition-colors ease-out hover:text-white"
                >
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
                <Link
                  href={item.href}
                  className="text-white/85 transition-colors ease-out hover:text-white"
                >
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

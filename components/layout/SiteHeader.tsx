import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconWhatsApp } from "@/components/ui/icons";
import { mainNav } from "@/lib/config/navigation";
import { SITE_NAME } from "@/lib/config/site";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

/**
 * Header fixo no topo (sticky), com menu horizontal a partir de `lg` e
 * painel mobile abaixo disso.
 *
 * Tolerante a falha do banco: se `site_settings` nao carregar (ex.: projeto
 * Supabase pausado, 2026-09-18), o header renderiza com o nome fixo do site
 * e sem o CTA de WhatsApp em vez de derrubar a pagina inteira — assim o
 * `app/error.tsx` aparece dentro do layout normal, com menu e rodape.
 */
export async function SiteHeader() {
  const settings = await getSiteSettingsMap().catch(() => null);
  const clinicName = settings?.clinic_name ?? SITE_NAME;
  const whatsappHref = settings?.whatsapp
    ? buildWhatsAppUrl(settings.whatsapp, "Olá! Gostaria de agendar uma avaliação.")
    : null;

  return (
    <header className="sticky top-0 z-(--z-header) border-b border-ink/10 bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <Container className="flex items-center justify-between gap-4 py-3 sm:py-4">
        {/*
          Versao colorida e horizontal, sem tagline (DESIGN.md → Logo → Header).
          O nome da clinica continua acessivel pelo `alt` — trocou a
          apresentacao, nao a informacao.
        */}
        <Link
          href="/"
          className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-dark"
        >
          <Image
            src="/images/logo/logo-horizontal-color.png"
            alt={clinicName}
            width={1600}
            height={480}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <NavLinks items={mainNav} />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "max-sm:hidden")}
            >
              <IconWhatsApp width={18} height={18} />
              <span>Agendar pelo WhatsApp</span>
            </a>
          )}
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Agendar pelo WhatsApp"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-dark text-white transition ease-out hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark sm:hidden"
            >
              <IconWhatsApp width={22} height={22} />
            </a>
          )}
          {/*
           * `max-sm:hidden`/`max-lg:hidden` (variantes) e nao `hidden sm:inline-flex`:
           * `buttonClasses` ja traz `inline-flex`, e no CSS do Tailwind
           * `inline-flex` vence `hidden` (mesma camada, ordem alfabetica) —
           * o botao aparecia no celular por cima do menu.
           */}
          <Link href="/contato" className={buttonClasses("secondary", "max-lg:hidden")}>
            Enviar mensagem
          </Link>
          <MobileNav items={mainNav} whatsappHref={whatsappHref} />
        </div>
      </Container>
    </header>
  );
}

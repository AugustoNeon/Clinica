import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  IconClock,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsApp,
} from "@/components/ui/icons";
import { SmileDivider } from "@/components/ui/SmileDivider";
import { footerNav, mainNav } from "@/lib/config/navigation";
import { SITE_NAME } from "@/lib/config/site";
import { getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { getTeamMembers } from "@/lib/data/team";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

const FOOTER_SERVICE_LIMIT = 8;

/**
 * Rodape completo: marca + contato + paginas + servicos + linha legal.
 *
 * Azul profundo com o logo branco (DESIGN.md → Logo → Footer; tom
 * `--blue-deep` desde a issue #71, branco por cima da 11:1). O texto
 * secundario usa `white/85` (7.5:1). A borda superior e o divisor curvo,
 * puxado para cima com margem negativa: o rodape "morde" a secao anterior
 * com o arco do sorriso, seja ela azul, branca ou diluida.
 *
 * Tolerante a falha do banco, como o header: sem dado, mostra so marca,
 * paginas e legal.
 */
export async function SiteFooter() {
  const [settings, services, team] = await Promise.all([
    getSiteSettingsMap().catch(() => null),
    getServices().catch(() => []),
    getTeamMembers().catch(() => []),
  ]);
  const clinicName = settings?.clinic_name ?? SITE_NAME;
  const professional = team[0] ?? null;
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto text-sm text-white">
      <div className="relative z-10 -mt-8 sm:-mt-12 lg:-mt-[4.5rem]">
        <SmileDivider className="text-blue-deep" />
      </div>
      <div className="relative overflow-hidden bg-blue-deep">
        <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
        <Container className="relative grid gap-10 pb-14 pt-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-8 lg:pt-14">
          <div>
            <Image
              src="/images/logo/logo-horizontal-white.png"
              alt={clinicName}
              width={1600}
              height={480}
              className="h-11 w-auto"
            />
            {settings?.clinic_tagline && (
              <p className="mt-5 max-w-xs font-display text-2xl leading-snug text-white">
                {settings.clinic_tagline}
              </p>
            )}
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-white transition-colors ease-out hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <IconInstagram />
                <span>Instagram</span>
              </a>
            )}
          </div>

          <nav aria-label="Navegação do rodapé">
            <p className="font-display text-lg font-medium">Páginas</p>
            <ul className="mt-3 space-y-2">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-white/85 transition-colors ease-out hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {services.length > 0 && (
            <nav aria-label="Serviços">
              <p className="font-display text-lg font-medium">Serviços</p>
              <ul className="mt-3 space-y-2">
                {services.slice(0, FOOTER_SERVICE_LIMIT).map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/servicos/${service.slug}`}
                      className="inline-block py-1 text-white/85 transition-colors ease-out hover:text-white"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
                {services.length > FOOTER_SERVICE_LIMIT && (
                  <li>
                    <Link
                      href="/servicos"
                      className="inline-block py-1 font-medium text-white underline-offset-4 hover:underline"
                    >
                      Ver todos os serviços
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}

          {settings && (
            <address className="not-italic">
              <p className="font-display text-lg font-medium">Contato</p>
              <ul className="mt-3 space-y-3 text-white/85">
                {settings.address && (
                  <li className="flex gap-2.5">
                    <IconMapPin className="mt-0.5 shrink-0 text-terracotta-soft" />
                    <span>
                      {settings.address}
                      {settings.maps_url && (
                        <>
                          <br />
                          <a
                            href={settings.maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block py-1 font-medium text-white underline-offset-4 hover:underline"
                          >
                            Como chegar
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                )}
                {settings.phone && (
                  <li className="flex gap-2.5">
                    <IconPhone className="mt-0.5 shrink-0 text-terracotta-soft" />
                    <a
                      href={`tel:${settings.phone.replace(/\D/g, "")}`}
                      className="inline-block py-1 transition-colors ease-out hover:text-white"
                    >
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings.whatsapp && (
                  <li className="flex gap-2.5">
                    <IconWhatsApp className="mt-0.5 shrink-0 text-terracotta-soft" />
                    <a
                      href={buildWhatsAppUrl(settings.whatsapp, "Olá! Gostaria de agendar uma avaliação.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-1 transition-colors ease-out hover:text-white"
                    >
                      {settings.whatsapp}
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li className="flex gap-2.5">
                    <IconMail className="mt-0.5 shrink-0 text-terracotta-soft" />
                    <a
                      href={`mailto:${settings.email}`}
                      className="inline-block break-all py-1 transition-colors ease-out hover:text-white"
                    >
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.opening_hours && (
                  <li className="flex gap-2.5">
                    <IconClock className="mt-0.5 shrink-0 text-terracotta-soft" />
                    <span>{settings.opening_hours}</span>
                  </li>
                )}
              </ul>
            </address>
          )}
        </Container>

        <div className="relative border-t border-white/15">
          <Container className="flex flex-col gap-3 py-6 text-xs text-white/85 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {clinicName}.
              {/* Divulgacao de profissional de odontologia exige o numero do CRO (CFO). */}
              {professional?.cro_number && (
                <>
                  {" "}
                  Responsável técnica: {professional.name}, {professional.cro_number}.
                </>
              )}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {footerNav.map((item) => (
                <li key={item.href}>
                  {/* LGPD: a politica de privacidade tem que estar linkada no rodape (PLANEJAMENTO.md secao 7). */}
                  <Link
                    href={item.href}
                    className="inline-block py-1 transition-colors ease-out hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </div>
    </footer>
  );
}

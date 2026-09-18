import { Container } from "@/components/ui/Container";
import { IconClock, IconMail, IconMapPin, IconPhone, IconShield, IconWhatsApp } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { LocationMap } from "./LocationMap";

interface PracticalInfoProps {
  settings: Record<string, string>;
  title?: string;
  /** `true` na pagina de contato (que ja tem os canais em destaque): esconde a coluna de contato. */
  compact?: boolean;
}

/**
 * "Ficha" pratica da clinica: endereco (com link de rota), horario,
 * convenio/pagamento e canais — tudo de `site_settings`, nada fixo no
 * codigo — ao lado do mapa.
 */
export function PracticalInfo({ settings, title = "Onde e quando", compact = false }: PracticalInfoProps) {
  const whatsappHref = settings.whatsapp
    ? buildWhatsAppUrl(settings.whatsapp, "Olá! Gostaria de agendar uma avaliação.")
    : null;

  return (
    <section className="py-14 sm:py-20 lg:py-24" id="localizacao">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <dl className="mt-8 space-y-7">
            {settings.address && (
              <div className="flex gap-4">
                <IconMapPin className="mt-1 shrink-0 text-terracotta-text" width={22} height={22} />
                <div>
                  <dt className="text-sm font-medium text-ink-muted">Endereço</dt>
                  <dd className="mt-1 text-lg leading-snug">{settings.address}</dd>
                  {settings.maps_url && (
                    <dd className="mt-1.5">
                      <a
                        href={settings.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-dark underline-offset-4 hover:underline"
                      >
                        Abrir rota no Google Maps
                      </a>
                    </dd>
                  )}
                </div>
              </div>
            )}

            {settings.opening_hours && (
              <div className="flex gap-4">
                <IconClock className="mt-1 shrink-0 text-terracotta-text" width={22} height={22} />
                <div>
                  <dt className="text-sm font-medium text-ink-muted">Horário de atendimento</dt>
                  <dd className="mt-1 text-lg leading-snug">{settings.opening_hours}</dd>
                  <dd className="mt-1.5 text-sm text-ink-muted">
                    Urgências fora desse horário: direto pelo WhatsApp.
                  </dd>
                </div>
              </div>
            )}

            {(settings.insurance || settings.payment_methods) && (
              <div className="flex gap-4">
                <IconShield className="mt-1 shrink-0 text-terracotta-text" width={22} height={22} />
                <div>
                  <dt className="text-sm font-medium text-ink-muted">Convênio e pagamento</dt>
                  {settings.insurance && (
                    <dd className="mt-1 text-lg leading-snug">
                      Particular e convênio {settings.insurance}
                    </dd>
                  )}
                  {settings.payment_methods && (
                    <dd className="mt-1.5 text-sm text-ink-muted">{settings.payment_methods}</dd>
                  )}
                </div>
              </div>
            )}

            {!compact && (
              <div className="flex gap-4">
                <IconPhone className="mt-1 shrink-0 text-terracotta-text" width={22} height={22} />
                <div>
                  <dt className="text-sm font-medium text-ink-muted">Contato</dt>
                  <dd className="mt-1 flex flex-col gap-1 text-lg leading-snug">
                    {settings.phone && (
                      <a
                        href={`tel:${settings.phone.replace(/\D/g, "")}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {settings.phone}
                      </a>
                    )}
                    {whatsappHref && (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                      >
                        <IconWhatsApp width={18} height={18} className="text-blue-dark" />
                        {settings.whatsapp}
                      </a>
                    )}
                    {settings.email && (
                      <a
                        href={`mailto:${settings.email}`}
                        className="inline-flex items-center gap-2 break-all text-base underline-offset-4 hover:underline"
                      >
                        <IconMail width={18} height={18} className="text-blue-dark" />
                        {settings.email}
                      </a>
                    )}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-surface-tint">
          <LocationMap embedUrl={settings.maps_embed_url} />
        </div>
      </Container>
    </section>
  );
}

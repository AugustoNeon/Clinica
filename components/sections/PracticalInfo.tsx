import type { ReactNode } from "react";
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

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-3xl bg-surface p-5">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta-tint text-terracotta-text">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-sm font-medium text-ink-muted">{label}</dt>
        {children}
      </div>
    </div>
  );
}

/**
 * "Ficha" pratica da clinica: endereco (com link de rota), horario,
 * convenio/pagamento e canais — tudo de `site_settings`, nada fixo no
 * codigo — ao lado do mapa. Camada rica (issue #71): fundo azul diluido
 * com a textura da marca, cada dado num bloco branco com icone terracota,
 * e o mapa emoldurado.
 */
export function PracticalInfo({ settings, title = "Onde e quando", compact = false }: PracticalInfoProps) {
  const whatsappHref = settings.whatsapp
    ? buildWhatsAppUrl(settings.whatsapp, "Olá! Gostaria de agendar uma avaliação.")
    : null;

  return (
    <section className="relative overflow-hidden bg-surface-tint py-16 sm:py-20 lg:py-24" id="localizacao">
      <Container className="relative grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div>
          <h2 className="text-4xl font-bold sm:text-5xl">{title}</h2>
          <dl className="reveal mt-8 grid gap-2">
            {settings.address && (
              <InfoRow icon={<IconMapPin width={22} height={22} />} label="Endereço">
                <dd className="mt-1 text-lg leading-snug">{settings.address}</dd>
                {settings.maps_url && (
                  <dd className="mt-1.5">
                    <a
                      href={settings.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-sm font-medium text-blue-dark underline-offset-4 hover:underline"
                    >
                      Abrir rota no Google Maps
                    </a>
                  </dd>
                )}
              </InfoRow>
            )}

            {settings.opening_hours && (
              <InfoRow icon={<IconClock width={22} height={22} />} label="Horário de atendimento">
                <dd className="mt-1 text-lg leading-snug">{settings.opening_hours}</dd>
                <dd className="mt-1.5 text-sm text-ink-muted">
                  Urgências fora desse horário: direto pelo WhatsApp.
                </dd>
              </InfoRow>
            )}

            {(settings.insurance || settings.payment_methods) && (
              <InfoRow icon={<IconShield width={22} height={22} />} label="Convênio e pagamento">
                {settings.insurance && (
                  <dd className="mt-1 text-lg leading-snug">Particular e convênio {settings.insurance}</dd>
                )}
                {settings.payment_methods && (
                  <dd className="mt-1.5 text-sm text-ink-muted">{settings.payment_methods}</dd>
                )}
              </InfoRow>
            )}

            {!compact && (
              <InfoRow icon={<IconPhone width={22} height={22} />} label="Contato">
                <dd className="mt-1 flex flex-col gap-1 text-lg leading-snug">
                  {settings.phone && (
                    <a
                      href={`tel:${settings.phone.replace(/\D/g, "")}`}
                      className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                    >
                      {settings.phone}
                    </a>
                  )}
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline"
                    >
                      <IconWhatsApp width={18} height={18} className="text-blue-dark" />
                      {settings.whatsapp}
                    </a>
                  )}
                  {settings.email && (
                    <a
                      href={`mailto:${settings.email}`}
                      className="inline-flex min-h-11 items-center gap-2 break-all text-base underline-offset-4 hover:underline"
                    >
                      <IconMail width={18} height={18} className="text-blue-dark" />
                      {settings.email}
                    </a>
                  )}
                </dd>
              </InfoRow>
            )}
          </dl>
        </div>

        <div className="reveal-photo flex flex-col overflow-hidden rounded-3xl bg-surface">
          <div className="flex-1 overflow-hidden">
            <LocationMap embedUrl={settings.maps_embed_url} />
          </div>
        </div>
      </Container>
    </section>
  );
}

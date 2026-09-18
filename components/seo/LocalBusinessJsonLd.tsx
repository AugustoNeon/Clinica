import { SITE_URL } from "@/lib/config/site";

interface LocalBusinessJsonLdProps {
  settings: Record<string, string>;
  /** Nome/URL das especialidades publicadas, para `availableService`. */
  services: { title: string; slug: string }[];
}

/**
 * Dados estruturados schema.org `Dentist` (subtipo de LocalBusiness) para
 * a Home. Tudo vem de `site_settings` — mesma fonte do rodape — nada e
 * fixo no codigo alem do formato.
 *
 * `openingHoursSpecification` usa a regra padrao de dias uteis de
 * `lib/data/scheduleExceptions.ts` (segunda a sexta) + o horario de
 * `opening_hours`; se o texto do horario nao estiver no formato
 * "09h00 às 19h00", o campo simplesmente fica de fora (nunca chuta).
 */
export function LocalBusinessJsonLd({ settings, services }: LocalBusinessJsonLdProps) {
  const [streetAddress, cityState] = (settings.address ?? "")
    .split("—")
    .map((part) => part.trim());
  const [addressLocality, addressRegion] = (cityState ?? "")
    .split(",")
    .map((part) => part.trim());

  const hours = /(\d{1,2})h(\d{2}).*?(\d{1,2})h(\d{2})/.exec(settings.opening_hours ?? "");
  const openingHoursSpecification = hours
    ? [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: `${hours[1].padStart(2, "0")}:${hours[2]}`,
          closes: `${hours[3].padStart(2, "0")}:${hours[4]}`,
        },
      ]
    : undefined;

  const phoneDigits = (settings.phone ?? "").replace(/\D/g, "");
  const sameAs = [settings.instagram_url, settings.facebook_url].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#clinica`,
    name: settings.clinic_name,
    slogan: settings.clinic_tagline,
    url: SITE_URL,
    image: `${SITE_URL}/images/logo/logo-stacked-color.png`,
    logo: `${SITE_URL}/images/logo/logo-stacked-color.png`,
    telephone: phoneDigits ? `+55${phoneDigits}` : undefined,
    email: settings.email || undefined,
    address: streetAddress
      ? {
          "@type": "PostalAddress",
          streetAddress,
          addressLocality: addressLocality || undefined,
          addressRegion: addressRegion || undefined,
          addressCountry: "BR",
        }
      : undefined,
    hasMap: settings.maps_url || undefined,
    openingHoursSpecification,
    paymentAccepted: settings.payment_methods || undefined,
    currenciesAccepted: "BRL",
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    availableService: services.map((service) => ({
      "@type": "MedicalProcedure",
      name: service.title,
      url: `${SITE_URL}/servicos/${service.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // `<` escapado: JSON dentro de <script> nao pode fechar a tag por engano.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

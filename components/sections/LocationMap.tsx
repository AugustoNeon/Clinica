interface LocationMapProps {
  /** URL de embed do Google Maps — vem de `settings.maps_embed_url`. */
  embedUrl: string;
}

/**
 * Mapa da clinica embutido do Google Maps.
 *
 * O iframe so carrega porque `next.config.ts` libera
 * `frame-src https://www.google.com` no CSP — mexer num sem o outro quebra
 * o mapa em producao sem erro visivel no build.
 *
 * `loading="lazy"` porque o mapa aparece abaixo da dobra nas duas paginas que
 * o usam (Home e Contato) e e o unico terceiro carregado no site.
 */
export function LocationMap({ embedUrl }: LocationMapProps) {
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      title="Localização da clínica no Google Maps"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ border: 0 }}
      className="h-[320px] w-full rounded-2xl sm:h-[380px]"
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { IconPhone, IconWhatsApp } from "@/components/ui/icons";

interface MobileActionBarProps {
  whatsappHref: string | null;
  phone?: string | null;
}

/** Quanto rolar (px) antes de a barra aparecer: o hero ja tem os mesmos botoes. */
const SHOW_AFTER = 560;

/**
 * Barra de contato na zona do polegar, so no celular e tablet (issue #71,
 * pesquisa de mobile com as skills tailwindcss-mobile-first e
 * responsive-design): WhatsApp e ligacao sempre ao alcance depois que o
 * hero sai da tela — em pagina longa, o CTA do topo fica a varias
 * rolagens de distancia.
 *
 * - `env(safe-area-inset-bottom)` com piso de 0.75rem: nao encosta na barra
 *   de gestos do iPhone.
 * - Escondida: `inert` + `aria-hidden`, para o foco de teclado e o leitor
 *   de tela nao pararem em botoes invisiveis.
 * - O layout do site reserva o espaco no fim da pagina (`pb-20 lg:pb-0`),
 *   entao o rodape nunca fica coberto.
 * - Entra deslizando de baixo; com `prefers-reduced-motion` a troca e
 *   instantanea (regra global de globals.css).
 */
export function MobileActionBar({ whatsappHref, phone }: MobileActionBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      setVisible(window.scrollY > SHOW_AFTER);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!whatsappHref && !phone) return null;

  const telHref = phone ? `tel:${phone.replace(/\D/g, "")}` : null;

  return (
    <nav
      aria-label="Contato rápido"
      aria-hidden={!visible || undefined}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-(--z-header) border-t border-ink/10 bg-surface/95 px-4 pt-3 shadow-[0_-8px_24px_rgb(18_63_92/0.12)] backdrop-blur transition-transform duration-300 ease-out lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md gap-3">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-dark px-4 text-base font-medium text-white shadow-sm shadow-blue-dark/20 transition active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
          >
            <IconWhatsApp width={20} height={20} />
            Agendar
          </a>
        )}
        {telHref && (
          <a
            href={telHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/20 bg-surface px-5 text-base font-medium text-ink transition active:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
          >
            <IconPhone width={20} height={20} />
            Ligar
          </a>
        )}
      </div>
    </nav>
  );
}

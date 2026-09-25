"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { IconClose, IconMenu, IconWhatsApp } from "@/components/ui/icons";
import type { NavItem } from "@/lib/config/navigation";
import { NavLinks } from "./NavLinks";

interface MobileNavProps {
  items: NavItem[];
  /** Link `wa.me` pronto (montado no servidor). `null` quando o numero nao carregou. */
  whatsappHref: string | null;
}

/**
 * Menu do celular: botao "hamburguer" que abre um painel de tela cheia com
 * os links grandes e os dois CTAs. Fecha com Escape, ao navegar ou pelo
 * botao de fechar; o scroll do fundo trava enquanto esta aberto.
 *
 * Antes desta issue (#65) o header simplesmente quebrava linha no celular
 * (menu + dois botoes empilhados, ~200px de altura antes do conteudo).
 */
export function MobileNav({ items, whatsappHref }: MobileNavProps) {
  const pathname = usePathname();
  // Guarda EM QUAL rota o menu foi aberto: navegou, `open` vira false sozinho
  // (sem efeito nem setState em cascata).
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpenedAt(null);
  }

  useEffect(() => {
    if (!open) return;

    const openButton = openButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenedAt(null);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      openButton?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setOpenedAt(pathname)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label="Abrir menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors ease-out hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
      >
        <IconMenu width={24} height={24} />
      </button>

      {open && (
        <div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="fixed inset-0 z-(--z-overlay) flex flex-col overflow-y-auto overscroll-contain bg-surface px-4 pb-8 pt-4 sm:px-6"
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-medium">Menu</p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Fechar menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors ease-out hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
            >
              <IconClose width={24} height={24} />
            </button>
          </div>

          <nav aria-label="Navegação principal" className="mt-6 flex-1 overflow-y-auto">
            <NavLinks items={items} layout="stack" onNavigate={close} />
          </nav>

          <div className="mt-6 grid gap-3">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "", "lg")}
              >
                <IconWhatsApp width={20} height={20} />
                Agendar pelo WhatsApp
              </a>
            )}
            <Link href="/contato" onClick={close} className={buttonClasses("secondary", "", "lg")}>
              Enviar mensagem
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

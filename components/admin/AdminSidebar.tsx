"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconClose, IconExternal, IconHome, IconLogout, IconMenu } from "@/components/ui/icons";
import { adminNavGroups } from "@/lib/config/adminNav";
import { ADMIN_ICONS } from "./adminIcons";

interface AdminSidebarProps {
  email: string;
  /** Contadores para os badges da navegacao (ex.: mensagens novas). */
  badges?: Partial<Record<string, number>>;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const LINK_BASE =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const LINK_ACTIVE = "bg-surface font-medium text-blue-deep shadow-sm";
const LINK_IDLE = "text-white/85 hover:bg-white/10 hover:text-white";

/**
 * Barra lateral do painel (issue #67): fixa a partir de `lg`, gaveta no
 * celular (botao no topo). Componente de cliente por causa do estado da
 * gaveta e do `usePathname` — o conteudo (grupos/links) e estatico, de
 * `lib/config/adminNav.ts`.
 *
 * Azul profundo com a textura da marca (issue #71): a barra e o unico
 * lugar do painel em que a cor da marca ocupa uma superficie inteira — o
 * item ativo vira uma pilula branca, o resto e branco a 85% (7.5:1).
 *
 * Links com `prefetch={false}` (issue #69): os 11 prefetches automaticos
 * passavam pelo middleware de sessao ao mesmo tempo e disputavam a
 * renovacao do token do Supabase — a sessao caia no meio do uso. Painel
 * de 1 pessoa nao precisa de prefetch.
 */
export function AdminSidebar({ email, badges = {} }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
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
    };
  }, [open]);

  const nav = (
    <nav aria-label="Navegação do painel" className="relative flex-1 overflow-y-auto px-3 py-4">
      <Link
        href="/admin"
        prefetch={false}
        aria-current={isActive(pathname, "/admin") ? "page" : undefined}
        onClick={() => setOpenedAt(null)}
        className={`${LINK_BASE} ${isActive(pathname, "/admin") ? LINK_ACTIVE : LINK_IDLE}`}
      >
        <IconHome className="shrink-0" />
        Início
      </Link>

      {adminNavGroups.map((group) => (
        <div key={group.label} className="mt-6">
          <p className="px-3 text-xs font-semibold text-blue-glow">{group.label}</p>
          <ul className="mt-1.5 space-y-0.5">
            {group.items.map((item) => {
              const Icon = ADMIN_ICONS[item.icon];
              const active = isActive(pathname, item.href);
              const badge = badges[item.href];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenedAt(null)}
                    className={`${LINK_BASE} ${active ? LINK_ACTIVE : LINK_IDLE}`}
                  >
                    <Icon className="shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {badge ? (
                      <span
                        className="inline-flex min-w-6 items-center justify-center rounded-full bg-terracotta px-1.5 text-xs font-semibold text-ink"
                        aria-label={`${badge} ${badge === 1 ? "pendente" : "pendentes"}`}
                      >
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="relative border-t border-white/15 px-4 py-4">
      <p className="truncate text-xs text-white/85" title={email}>
        {email}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/30 px-3 py-2 text-sm font-medium text-white transition-colors ease-out hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <IconExternal width={16} height={16} />
          Ver o site
        </Link>
        <form action="/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/85 transition-colors ease-out hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <IconLogout width={16} height={16} />
            Sair
          </button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <div className="relative flex items-center gap-3 px-5 py-5">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface">
        <Image src="/images/logo/icon-smile.png" alt="" width={512} height={512} className="h-8 w-8" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-base font-medium text-white">Painel da clínica</p>
        <p className="text-xs text-white/85">Dra. Ariane Vaz Storrer</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Barra do topo — so no celular/tablet. */}
      <div className="sticky top-0 z-(--z-header) flex items-center justify-between bg-blue-deep px-4 py-3 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface">
            <Image src="/images/logo/icon-smile.png" alt="" width={512} height={512} className="h-7 w-7" />
          </span>
          <span className="font-display text-base font-medium">Painel</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpenedAt(pathname)}
          aria-expanded={open}
          aria-controls="menu-painel"
          aria-label="Abrir menu do painel"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors ease-out hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <IconMenu width={24} height={24} />
        </button>
      </div>

      {/* Barra lateral fixa — desktop. */}
      <aside className="fixed inset-y-0 left-0 z-(--z-header) hidden w-64 flex-col overflow-hidden bg-blue-deep text-white lg:flex">
        <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
        {brand}
        {nav}
        {footer}
      </aside>

      {/* Gaveta — celular/tablet. */}
      {open && (
        <div className="fixed inset-0 z-(--z-overlay) lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpenedAt(null)}
            className="absolute inset-0 bg-ink/50"
          />
          <div
            id="menu-painel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu do painel"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col overflow-hidden overscroll-contain bg-blue-deep text-white shadow-2xl"
          >
            <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
            <div className="relative flex items-center justify-between pr-3">
              {brand}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpenedAt(null)}
                aria-label="Fechar menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors ease-out hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <IconClose width={22} height={22} />
              </button>
            </div>
            {nav}
            {footer}
          </div>
        </div>
      )}
    </>
  );
}

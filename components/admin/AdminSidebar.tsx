"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import {
  IconCalendar,
  IconClose,
  IconExternal,
  IconHome,
  IconInbox,
  IconList,
  IconLock,
  IconLogout,
  IconMenu,
  IconPen,
  IconQuote,
  IconSettings,
  IconUser,
  IconUsers,
} from "@/components/ui/icons";
import { adminNavGroups, type AdminIconName } from "@/lib/config/adminNav";

const ICONS: Record<AdminIconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  home: IconHome,
  list: IconList,
  user: IconUser,
  pen: IconPen,
  quote: IconQuote,
  settings: IconSettings,
  inbox: IconInbox,
  users: IconUsers,
  calendar: IconCalendar,
  lock: IconLock,
};

interface AdminSidebarProps {
  email: string;
  /** Contadores para os badges da navegacao (ex.: mensagens novas). */
  badges?: Partial<Record<string, number>>;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Barra lateral do painel (issue #67): fixa a partir de `lg`, gaveta no
 * celular (botao no topo). Componente de cliente por causa do estado da
 * gaveta e do `usePathname` — o conteudo (grupos/links) e estatico, de
 * `lib/config/adminNav.ts`.
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
    <nav aria-label="Navegação do painel" className="flex-1 overflow-y-auto px-3 py-4">
      <Link
        href="/admin"
        aria-current={isActive(pathname, "/admin") ? "page" : undefined}
        onClick={() => setOpenedAt(null)}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ease-out ${
          isActive(pathname, "/admin")
            ? "bg-surface-tint text-blue-dark"
            : "text-ink hover:bg-surface-sunken"
        }`}
      >
        <IconHome className="shrink-0" />
        Início
      </Link>

      {adminNavGroups.map((group) => (
        <div key={group.label} className="mt-6">
          <p className="px-3 text-xs font-medium text-ink-muted">{group.label}</p>
          <ul className="mt-1.5 space-y-0.5">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon];
              const active = isActive(pathname, item.href);
              const badge = badges[item.href];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenedAt(null)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark ${
                      active
                        ? "bg-surface-tint font-medium text-blue-dark"
                        : "text-ink hover:bg-surface-sunken"
                    }`}
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
    <div className="border-t border-ink/10 px-4 py-4">
      <p className="truncate text-xs text-ink-muted" title={email}>
        {email}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-ink/15 px-3 py-2 text-sm font-medium text-ink transition-colors ease-out hover:border-blue hover:bg-surface-tint"
        >
          <IconExternal width={16} height={16} />
          Ver o site
        </Link>
        <form action="/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-muted transition-colors ease-out hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
          >
            <IconLogout width={16} height={16} />
            Sair
          </button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <div className="flex items-center gap-3 px-5 py-5">
      <Image src="/images/logo/icon-smile.png" alt="" width={512} height={512} className="h-9 w-9" />
      <div className="leading-tight">
        <p className="font-display text-base font-medium">Painel da clínica</p>
        <p className="text-xs text-ink-muted">Dra. Ariane Vaz Storrer</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Barra do topo — so no celular/tablet. */}
      <div className="sticky top-0 z-(--z-header) flex items-center justify-between border-b border-ink/10 bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image src="/images/logo/icon-smile.png" alt="" width={512} height={512} className="h-8 w-8" />
          <span className="font-display text-base font-medium">Painel</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpenedAt(pathname)}
          aria-expanded={open}
          aria-controls="menu-painel"
          aria-label="Abrir menu do painel"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors ease-out hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
        >
          <IconMenu width={24} height={24} />
        </button>
      </div>

      {/* Barra lateral fixa — desktop. */}
      <aside className="fixed inset-y-0 left-0 z-(--z-header) hidden w-64 flex-col border-r border-ink/10 bg-surface lg:flex">
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
            className="absolute inset-0 bg-ink/40"
          />
          <div
            id="menu-painel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu do painel"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between pr-3">
              {brand}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpenedAt(null)}
                aria-label="Fechar menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors ease-out hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
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

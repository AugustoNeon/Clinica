"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/config/navigation";

interface NavLinksProps {
  items: NavItem[];
  /** `bar` = menu horizontal do desktop; `stack` = lista do painel mobile. */
  layout?: "bar" | "stack";
  onNavigate?: () => void;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Links do menu com estado ativo (`aria-current="page"`): a pagina atual
 * fica em tinta cheia com um traco terracota embaixo. Componente de cliente
 * so por causa do `usePathname` — o resto do header continua no servidor.
 */
export function NavLinks({ items, layout = "bar", onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  if (layout === "stack") {
    return (
      <ul className="flex flex-col">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between border-b border-ink/10 py-4 font-display text-2xl font-medium transition-colors ease-out hover:text-blue-dark ${
                  active ? "text-blue-dark" : "text-ink"
                }`}
              >
                {item.label}
                {active && <span className="h-2 w-2 rounded-full bg-terracotta" aria-hidden />}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative inline-flex rounded-lg px-3 py-2 text-sm font-medium transition-colors ease-out hover:text-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-terracotta after:transition-transform after:duration-200 after:ease-out ${
                active
                  ? "text-ink after:scale-x-100"
                  : "text-ink-muted after:scale-x-0 hover:after:scale-x-100"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

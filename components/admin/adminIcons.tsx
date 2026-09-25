import type { ComponentType, SVGProps } from "react";
import {
  IconCalendar,
  IconHome,
  IconInbox,
  IconList,
  IconLock,
  IconPen,
  IconQuote,
  IconSettings,
  IconUser,
  IconUsers,
} from "@/components/ui/icons";
import type { AdminIconName } from "@/lib/config/adminNav";

/**
 * Icone de cada area do painel, pelo nome declarado em
 * `lib/config/adminNav.ts`. Fonte unica para a barra lateral e para os
 * atalhos da tela inicial (antes cada um resolvia por conta propria).
 */
export const ADMIN_ICONS: Record<AdminIconName, ComponentType<SVGProps<SVGSVGElement>>> = {
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

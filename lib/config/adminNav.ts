/**
 * Navegacao do painel (issue #67), em grupos por intencao de uso. Fonte
 * unica para a barra lateral (`components/admin/AdminSidebar.tsx`) e para
 * os atalhos do dashboard (`app/admin/(protected)/page.tsx`).
 *
 * `icon` e o nome de um icone de `components/ui/icons.tsx` — string, e nao
 * o componente, para este arquivo continuar sem React e ser importavel de
 * qualquer lado.
 */
export type AdminIconName =
  | "home"
  | "list"
  | "user"
  | "pen"
  | "quote"
  | "settings"
  | "inbox"
  | "users"
  | "calendar"
  | "lock";

export interface AdminNavItem {
  href: string;
  label: string;
  description: string;
  icon: AdminIconName;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Atendimento",
    items: [
      {
        href: "/admin/leads",
        label: "Mensagens",
        description: "Quem escreveu pelo formulário do site e em que pé está cada contato.",
        icon: "inbox",
      },
      {
        href: "/admin/agenda",
        label: "Agenda",
        description: "Dias de atendimento, consultas marcadas e horários livres.",
        icon: "calendar",
      },
      {
        href: "/admin/pacientes",
        label: "Pacientes",
        description: "Cadastro de quem já é atendido pela clínica.",
        icon: "users",
      },
    ],
  },
  {
    label: "Conteúdo do site",
    items: [
      {
        href: "/admin/servicos",
        label: "Serviços",
        description: "Especialidades e procedimentos divulgados no site.",
        icon: "list",
      },
      {
        href: "/admin/equipe",
        label: "Equipe",
        description: "Nome, cargo, CRO, bio e foto da profissional.",
        icon: "user",
      },
      {
        href: "/admin/blog",
        label: "Blog",
        description: "Posts: escrever, publicar e arquivar.",
        icon: "pen",
      },
      {
        href: "/admin/depoimentos",
        label: "Depoimentos",
        description: "Depoimentos de pacientes, sempre com consentimento.",
        icon: "quote",
      },
      {
        href: "/admin/configuracoes",
        label: "Configurações",
        description: "Endereço, telefone, horário, convênio, redes sociais.",
        icon: "settings",
      },
    ],
  },
  {
    label: "Conta",
    items: [
      {
        href: "/admin/seguranca",
        label: "Segurança",
        description: "Verificação em duas etapas e sessão.",
        icon: "lock",
      },
    ],
  },
];

/** Lista plana, para lookups por rota. */
export const adminNavItems: AdminNavItem[] = adminNavGroups.flatMap((group) => group.items);

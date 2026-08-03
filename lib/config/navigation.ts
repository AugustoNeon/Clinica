import { FEATURES } from "./features";

export interface NavItem {
  href: string;
  label: string;
}

/**
 * Itens do menu principal. O blog entra so quando `FEATURES.blog` for
 * ligado — nada aqui pode assumir que a rota `/blog` vai a producao.
 */
export const mainNav: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Servicos" },
  { href: "/equipe", label: "Equipe" },
  ...(FEATURES.blog ? [{ href: "/blog", label: "Blog" }] : []),
  { href: "/contato", label: "Contato" },
];

/** Itens do rodape: institucional obrigatorio (LGPD) fora do menu principal. */
export const footerNav: NavItem[] = [{ href: "/privacidade", label: "Politica de Privacidade" }];

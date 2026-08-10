export interface NavItem {
  href: string;
  label: string;
}

/**
 * Itens do menu principal. O blog e escopo confirmado desde 2026-08-04
 * (pergunta 22 do questionario respondida "sim"), entao o link e fixo —
 * nao ha mais flag controlando a presenca dele.
 */
export const mainNav: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Servicos" },
  { href: "/equipe", label: "Equipe" },
  { href: "/resultados", label: "Resultados" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

/** Itens do rodape: institucional obrigatorio (LGPD) fora do menu principal. */
export const footerNav: NavItem[] = [{ href: "/privacidade", label: "Politica de Privacidade" }];

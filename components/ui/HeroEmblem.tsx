import type { ReactNode } from "react";

interface HeroEmblemProps {
  children: ReactNode;
  /** `photo`: o conteudo e uma imagem que preenche o disco (retrato). */
  variant?: "icon" | "photo";
}

/**
 * Emblema do `PageHero` das paginas internas (issue #71; parado desde a
 * #73): disco marinho com anel coral, a direita do titulo. Da a cada pagina
 * interna uma imagem propria — icone ilustrado do servico, retrato da
 * doutora, glifo do logo — sem repetir o hero de foto da Home. So aparece
 * a partir de `lg` (o `PageHero` esconde o slot `visual` no celular).
 */
export function HeroEmblem({ children, variant = "icon" }: HeroEmblemProps) {
  return (
    <div className="flex justify-center lg:justify-end">
      <span
        className={`relative inline-flex h-56 w-56 items-center justify-center rounded-full bg-blue-deep ${
          variant === "photo" ? "" : "text-white"
        }`}
      >
        <span aria-hidden className="absolute -inset-4 rounded-full border-[3px] border-terracotta" />
        {variant === "photo" ? (
          <span className="relative block h-full w-full overflow-hidden rounded-full">{children}</span>
        ) : (
          children
        )}
      </span>
    </div>
  );
}

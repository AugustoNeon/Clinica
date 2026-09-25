"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { IconTooth } from "@/components/ui/serviceIcons";

// three.js so no navegador e so quando o dente chega perto da tela.
const ToothCanvas = dynamic(() => import("./ToothCanvas"), { ssr: false });

interface Tooth3DProps {
  /** Classes do palco (tamanho e posicao ficam com quem usa). */
  className?: string;
  /** Arrastar para girar (mouse e toque). Desligado, o dente so segue mouse e rolagem. */
  draggable?: boolean;
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * Dente 3D da marca (issue #73, pedido do usuario): um molar com tres raizes,
 * esmalte branco acetinado e raiz marfim, no formato do modelo de referencia
 * que o usuario mandou. Entra girando uma vez, vira conforme a pagina rola,
 * olha para o mouse e, onde `draggable`, gira com o dedo ou o mouse.
 *
 * Sem botao de pausa (o usuario achou feio): por isso nada aqui se mexe
 * sozinho por mais de 2 s. Depois da entrada, todo movimento vem de um gesto
 * da pessoa, o que dispensa o controle de pausa (WCAG 2.2.2).
 *
 * Camadas de seguranca:
 * - antes do 3D carregar (e se o WebGL faltar), aparece o icone do dente
 *   desenhado, no mesmo lugar: nada fica em branco;
 * - three.js so e baixado quando o palco chega a 300 px da tela;
 * - `prefers-reduced-motion`: sem giro de entrada, sem seguir mouse nem
 *   rolagem; arrastar continua funcionando, porque e a pessoa que move;
 * - decorativo para leitor de tela (`aria-hidden`);
 * - no toque, `touch-action: pan-y`: rolar a pagina na vertical continua
 *   livre, so o arrasto horizontal gira o dente.
 */
export function Tooth3D({ className = "", draggable = false }: Tooth3DProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden
      className={`relative ${draggable ? "cursor-grab touch-pan-y select-none active:cursor-grabbing" : ""} ${className}`}
    >
      {/* Reserva: o icone do dente, ate o 3D desenhar o primeiro quadro. */}
      <IconTooth
        className={`absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 text-white transition-opacity duration-500 ease-out ${
          ready && !failed ? "opacity-0" : "opacity-100"
        }`}
      />
      {near && !failed && (
        <div className={`absolute inset-0 transition-opacity duration-700 ease-out ${ready ? "opacity-100" : "opacity-0"}`}>
          <ToothCanvas
            reducedMotion={reducedMotion}
            draggable={draggable}
            onReady={() => setReady(true)}
            onError={() => setFailed(true)}
          />
        </div>
      )}
    </div>
  );
}

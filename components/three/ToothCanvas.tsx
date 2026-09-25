"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createToothGeometry } from "./toothGeometry";

export interface ToothCanvasProps {
  /** `prefers-reduced-motion`: sem giro de entrada, sem seguir mouse nem rolagem. */
  reducedMotion: boolean;
  /** Arrastar para girar (mouse e toque). Sem isso, so segue o mouse. */
  draggable: boolean;
  /** Chamado depois do primeiro quadro desenhado (troca o desenho reserva pelo 3D). */
  onReady: () => void;
  /** WebGL indisponivel ou erro: o `Tooth3D` mantem o desenho reserva. */
  onError: () => void;
}

/** Angulo de repouso: tres quartos, as duas raizes da frente e a de tras aparecem. */
const REST_Y = -0.55;
/** Quanto o dente gira enquanto atravessa a tela na rolagem (radianos). */
const SCROLL_TURN = 1.6;

/**
 * Cena three.js do dente (issue #73). Carregada so quando o `Tooth3D` chega
 * perto da tela (import dinamico, sem SSR): quem nao rola ate ele nao baixa
 * o three.js.
 *
 * Nada gira sozinho sem parar (por isso nao ha botao de pausa, que o
 * usuario achou feio): o dente entra girando uma vez (< 2 s), depois so se
 * mexe quando a pessoa mexe. Rolando a pagina ele vira, com o mouse em cima
 * ele olha para o ponteiro, e arrastando (onde `draggable`) ele gira.
 *
 * Custo sob controle: um objeto, luz de ambiente gerada (RoomEnvironment,
 * sem textura para baixar), pixel ratio limitado a 2, e o laco de desenho
 * so roda enquanto algo se mexe E o canvas esta visivel. Parado, nao gasta
 * nada. Tudo e descartado ao sair da pagina (`dispose`).
 */
export default function ToothCanvas({ reducedMotion, draggable, onReady, onError }: ToothCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Props vivas para o laco de animacao sem recriar a cena a cada mudanca.
  const live = useRef({ reducedMotion, draggable });
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    live.current = { reducedMotion, draggable };
    wake.current();
  }, [reducedMotion, draggable]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Canvas novo a cada montagem: um canvas cujo contexto ja foi descartado
    // nao volta (e o StrictMode do React monta duas vezes em desenvolvimento).
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "block h-full w-full";
    host.appendChild(canvas);

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      canvas.remove();
      onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = NeutralToneMapping;
    renderer.toneMappingExposure = 0.95;

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    // Com o ambiente na cena, a intensidade vem daqui (o `envMapIntensity` do
    // material so vale para `material.envMap`). Baixa: o volume vem da luz chave.
    scene.environmentIntensity = 0.45;

    const camera = new PerspectiveCamera(28, 1, 0.1, 20);
    camera.position.set(0, 0.2, 4.8);
    camera.lookAt(0, 0, 0);

    // Luz: chave branca de cima/esquerda, preenchimento ceu por baixo (sombra
    // azulada, casa com o fundo) e contraluz ceu na borda. Contraluz coral foi
    // testada e saiu: no esmalte parecia mancha rosada.
    scene.add(new AmbientLight("#cbeeff", 0.04));
    const key = new DirectionalLight("#ffffff", 2);
    key.position.set(-3.2, 2.6, 2.2);
    scene.add(key);
    const fill = new DirectionalLight("#9fd8ff", 0.35);
    fill.position.set(-1.5, -2.5, 2);
    scene.add(fill);
    const rim = new DirectionalLight("#cbeeff", 0.9);
    rim.position.set(3, 1, -2.2);
    scene.add(rim);

    const geometry = createToothGeometry();
    // Esmalte acetinado: brilho suave, como o modelo de referencia (nao plastico).
    const material = new MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.42,
      metalness: 0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      sheen: 0.2,
      sheenColor: "#ffffff",
    });
    const tooth = new Mesh(geometry, material);
    // Inclinado para frente: as cuspides aparecem, como numa foto de cima.
    const pivot = new Group();
    pivot.rotation.x = 0.36;
    pivot.add(tooth);
    scene.add(pivot);

    // Estado do movimento. O giro de entrada so comeca quando o dente aparece.
    const introFrom = REST_Y - Math.PI * 1.2;
    const state = {
      rotY: live.current.reducedMotion ? REST_Y : introFrom,
      velocity: 0,
      tiltX: 0,
      tiltY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      scroll: 0,
      targetScroll: 0,
      introPending: !live.current.reducedMotion,
      introStart: -1,
      dragging: false,
      lastX: 0,
      lastMoveTime: 0,
    };
    const INTRO_MS = 1600;

    let visible = true;
    let frame = 0;
    let last = performance.now();
    let readySent = false;

    function resize() {
      const width = host!.clientWidth;
      const height = host!.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function settled() {
      return (
        !state.dragging &&
        !state.introPending &&
        state.introStart < 0 &&
        Math.abs(state.velocity) < 0.001 &&
        Math.abs(state.targetTiltX - state.tiltX) < 0.001 &&
        Math.abs(state.targetTiltY - state.tiltY) < 0.001 &&
        Math.abs(state.targetScroll - state.scroll) < 0.001
      );
    }

    // Rolagem: posicao do centro do dente em relacao ao centro da tela (-1..1).
    function readScroll() {
      if (live.current.reducedMotion) {
        state.targetScroll = 0;
        return;
      }
      const rect = host!.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      state.targetScroll = Math.max(-1, Math.min(1, offset)) * SCROLL_TURN;
    }

    function tick(now: number) {
      frame = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (state.introPending) {
        state.introPending = false;
        state.introStart = now;
      }

      if (state.introStart >= 0) {
        // Giro de entrada: uma volta e pouco, desacelerando (ease-out expo). Dura < 2 s.
        const t = Math.min(1, (now - state.introStart) / INTRO_MS);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        state.rotY = introFrom + (REST_Y - introFrom) * eased;
        if (t === 1) state.introStart = -1;
      } else {
        state.rotY += state.velocity * dt;
        state.velocity *= Math.pow(0.04, dt);
        if (Math.abs(state.velocity) < 0.001) state.velocity = 0;
      }

      const follow = 1 - Math.pow(0.002, dt);
      state.tiltX += (state.targetTiltX - state.tiltX) * follow;
      state.tiltY += (state.targetTiltY - state.tiltY) * follow;
      state.scroll += (state.targetScroll - state.scroll) * follow;

      tooth.rotation.y = state.rotY + state.tiltY + state.scroll;
      pivot.rotation.x = 0.36 + state.tiltX;
      renderer.render(scene, camera);

      if (!readySent) {
        readySent = true;
        onReady();
      }

      if (visible && !settled()) frame = requestAnimationFrame(tick);
    }

    function requestFrame() {
      if (frame || !visible) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
    wake.current = requestFrame;

    // Segue o mouse: o dente vira um pouco na direcao do ponteiro.
    function onPointerMove(event: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      if (state.dragging) {
        const now = performance.now();
        const dx = event.clientX - state.lastX;
        const delta = dx * 0.012;
        state.rotY += delta;
        const elapsed = Math.max(1, now - state.lastMoveTime) / 1000;
        state.velocity = delta / elapsed;
        state.lastX = event.clientX;
        state.lastMoveTime = now;
      } else if (event.pointerType === "mouse" && !live.current.reducedMotion) {
        state.targetTiltY = x * 0.7;
        state.targetTiltX = y * 0.45;
      }
      requestFrame();
    }

    function onPointerLeave() {
      state.targetTiltX = 0;
      state.targetTiltY = 0;
      requestFrame();
    }

    function onPointerDown(event: PointerEvent) {
      if (!live.current.draggable) return;
      state.dragging = true;
      state.introStart = -1;
      state.velocity = 0;
      state.lastX = event.clientX;
      state.lastMoveTime = performance.now();
      host!.setPointerCapture(event.pointerId);
      requestFrame();
    }

    function onPointerUp(event: PointerEvent) {
      if (!state.dragging) return;
      state.dragging = false;
      if (performance.now() - state.lastMoveTime > 80) state.velocity = 0;
      if (host!.hasPointerCapture(event.pointerId)) host!.releasePointerCapture(event.pointerId);
      requestFrame();
    }

    function onScroll() {
      if (!visible) return;
      readScroll();
      requestFrame();
    }

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      resize();
      requestFrame();
    });
    resizeObserver.observe(host);

    // Fora da tela (ou aba escondida), o laco para.
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible";
      if (visible) {
        readScroll();
        // Entra ja no angulo da rolagem, sem "pular" ate ele.
        state.scroll = state.targetScroll;
        requestFrame();
      }
    });
    intersection.observe(host);
    function onVisibility() {
      visible = document.visibilityState === "visible";
      if (visible) requestFrame();
    }
    document.addEventListener("visibilitychange", onVisibility);

    function onContextLost(event: Event) {
      event.preventDefault();
      onError();
    }
    canvas.addEventListener("webglcontextlost", onContextLost);

    resize();
    readScroll();
    state.scroll = state.targetScroll;
    requestFrame();

    return () => {
      wake.current = () => {};
      if (frame) cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      resizeObserver.disconnect();
      intersection.disconnect();
      geometry.dispose();
      material.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
    // A cena e criada uma vez; as props mudam pelo `live`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={hostRef} className="h-full w-full" />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { IconTrash } from "@/components/ui/icons";

interface ConfirmActionProps {
  /** Server Action ja com o id vinculado (`action.bind(null, id)`). */
  action: (formData: FormData) => void | Promise<void>;
  /** Rotulo do botao inicial, ex.: "Excluir serviço". */
  label: string;
  /** Pergunta de confirmacao, ex.: "Excluir o serviço Ortodontia? Ele some do site na hora." */
  question: string;
  confirmLabel?: string;
  tone?: "danger" | "neutral";
  /** `true` mostra so o icone de lixeira no botao inicial (listas apertadas). */
  compact?: boolean;
}

/**
 * Botao destrutivo com confirmacao em dois passos, sem `window.confirm`
 * (bloqueia a aba e nao da para estilizar). O segundo passo aparece no
 * lugar do botao, com foco no "Cancelar" — o caminho seguro e o padrao.
 *
 * Antes desta issue (#67) excluir servico/post/depoimento/consulta era um
 * clique so, sem pergunta — contra o "zero operacao destrutiva sem
 * confirmacao" do AGENTS.md.
 */
export function ConfirmAction({
  action,
  label,
  question,
  confirmLabel = "Sim, excluir",
  tone = "danger",
  compact = false,
}: ConfirmActionProps) {
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) cancelRef.current?.focus();
  }, [confirming]);

  const dangerClasses =
    tone === "danger"
      ? "bg-red-700 text-white hover:bg-red-800 focus-visible:outline-red-700"
      : "bg-blue-dark text-white hover:brightness-90 focus-visible:outline-blue-dark";

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={compact ? label : undefined}
        title={compact ? label : undefined}
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ease-out focus-visible:outline-2 focus-visible:outline-offset-2 ${
          tone === "danger"
            ? "text-red-700 hover:bg-red-50 focus-visible:outline-red-700"
            : "text-ink-muted hover:bg-surface-sunken hover:text-ink focus-visible:outline-blue-dark"
        }`}
      >
        {tone === "danger" && <IconTrash width={16} height={16} />}
        {!compact && label}
      </button>
    );
  }

  return (
    <form
      action={action}
      role="group"
      aria-label={question}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-ink/15 bg-surface-sunken px-3 py-2"
    >
      <p className="text-sm">{question}</p>
      <button
        ref={cancelRef}
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink transition-colors ease-out hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ease-out focus-visible:outline-2 focus-visible:outline-offset-2 ${dangerClasses}`}
      >
        {confirmLabel}
      </button>
    </form>
  );
}

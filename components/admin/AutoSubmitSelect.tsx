"use client";

import type { SelectHTMLAttributes } from "react";

/**
 * `<select>` que envia o proprio formulario ao mudar — troca de status sem
 * botao "Atualizar". O `<noscript>` do formulario pai continua oferecendo
 * o botao para quem estiver sem JavaScript.
 */
export function AutoSubmitSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      onChange={(event) => {
        props.onChange?.(event);
        event.currentTarget.form?.requestSubmit();
      }}
    />
  );
}

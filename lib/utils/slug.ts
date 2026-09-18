/** "Clínico Geral" → "clinico-geral": sugestao de slug a partir do titulo (so no cliente, a validacao real e o schema Zod). */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

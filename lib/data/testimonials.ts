import type { Testimonial } from "@/types";

/**
 * Camada de dados de `testimonials`.
 *
 * IMPLEMENTACAO ATUAL: dados de PLACEHOLDER em memoria — ver o comentario
 * de cabecalho de `lib/data/services.ts` para o contrato de substituicao.
 *
 * LGPD: depoimento de paciente so vai ao ar com consentimento por escrito
 * (PLANEJAMENTO.md secao 7). `getTestimonials()` filtra por
 * `consent_confirmed` ALEM de `published` de proposito — publicar sem
 * consentimento nao pode depender de alguem lembrar de marcar a flag certa.
 */

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "tst-placeholder-1",
    patient_name: "Paciente Exemplo 1 (placeholder)",
    content:
      "Depoimento de placeholder. Substituir por depoimento real apenas com consentimento por escrito do paciente.",
    rating: 5,
    photo_url: null,
    consent_confirmed: true,
    published: true,
  },
  {
    id: "tst-placeholder-2",
    patient_name: "Paciente Exemplo 2 (placeholder)",
    content:
      "Depoimento de placeholder. Substituir por depoimento real apenas com consentimento por escrito do paciente.",
    rating: 5,
    photo_url: null,
    consent_confirmed: true,
    published: true,
  },
];

/** Depoimentos publicados E com consentimento confirmado. */
export async function getTestimonials(): Promise<Testimonial[]> {
  return PLACEHOLDER_TESTIMONIALS.filter(
    (testimonial) => testimonial.published && testimonial.consent_confirmed,
  );
}

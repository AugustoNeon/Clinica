import type { Service } from "@/types";

/**
 * Camada de dados de `services`.
 *
 * IMPLEMENTACAO ATUAL: dados de PLACEHOLDER em memoria. Nao existe projeto
 * Supabase ainda e o conteudo real so chega com as respostas do questionario
 * da cliente. As assinaturas ja sao assincronas e retornam exatamente o que
 * uma query do Supabase retornaria, para que trocar o corpo destas funcoes
 * (ver `lib/supabase/server.ts`) nao toque em nenhuma pagina ou componente.
 *
 * Troca futura, por exemplo:
 *   const supabase = getSupabaseServerClient();
 *   const { data, error } = await supabase
 *     .from("services").select("*").eq("published", true).order("order");
 */

const PLACEHOLDER_SERVICES: Service[] = [
  {
    id: "svc-placeholder-1",
    slug: "servico-exemplo-1",
    title: "Servico Exemplo 1 (placeholder)",
    description:
      "Descricao de placeholder do Servico Exemplo 1. Texto substituido pelo conteudo real apos as respostas do questionario da cliente.",
    category: "Categoria Exemplo (placeholder)",
    image_url: null,
    order: 1,
    published: true,
  },
  {
    id: "svc-placeholder-2",
    slug: "servico-exemplo-2",
    title: "Servico Exemplo 2 (placeholder)",
    description:
      "Descricao de placeholder do Servico Exemplo 2. Texto substituido pelo conteudo real apos as respostas do questionario da cliente.",
    category: "Categoria Exemplo (placeholder)",
    image_url: null,
    order: 2,
    published: true,
  },
  {
    id: "svc-placeholder-3",
    slug: "servico-exemplo-3",
    title: "Servico Exemplo 3 (placeholder)",
    description:
      "Descricao de placeholder do Servico Exemplo 3. Texto substituido pelo conteudo real apos as respostas do questionario da cliente.",
    category: "Categoria Exemplo (placeholder)",
    image_url: null,
    order: 3,
    published: false,
  },
];

/** Servicos publicados, ja ordenados por `order`. */
export async function getServices(): Promise<Service[]> {
  return PLACEHOLDER_SERVICES.filter((service) => service.published).sort(
    (a, b) => a.order - b.order,
  );
}

/** Um servico publicado pelo slug, ou `null` se nao existir. */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

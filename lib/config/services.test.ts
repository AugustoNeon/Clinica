import { describe, expect, it } from "vitest";
import type { Service } from "@/types";
import { FEATURED_SERVICE_SLUGS, groupServices, pickFeatured } from "./services";

function service(slug: string, order: number): Service {
  return {
    id: `id-${slug}`,
    slug,
    title: slug,
    description: "",
    long_description: null,
    category: null,
    image_url: null,
    order,
    published: true,
  };
}

describe("groupServices", () => {
  it("agrupa pelos slugs conhecidos, na ordem dos grupos, e some com grupo vazio", () => {
    const groups = groupServices([
      service("ortodontia", 1),
      service("clinico-geral", 2),
      service("facetas", 3),
    ]);

    expect(groups.map((group) => group.title)).toEqual([
      "Rotina e prevenção",
      "Estética do sorriso",
      "Tratamentos e cirurgias",
    ]);
    expect(groups[0].services.map((item) => item.slug)).toEqual(["clinico-geral"]);
  });

  it("manda slug desconhecido para 'Outras especialidades', no fim", () => {
    const groups = groupServices([service("novo-servico", 1), service("endodontia", 2)]);

    expect(groups.at(-1)?.title).toBe("Outras especialidades");
    expect(groups.at(-1)?.services.map((item) => item.slug)).toEqual(["novo-servico"]);
  });

  it("nunca perde nem duplica servico", () => {
    const input = [
      service("implantodontia", 1),
      service("x", 2),
      service("y", 3),
      service("clareamento-dental", 4),
    ];
    const all = groupServices(input).flatMap((group) => group.services.map((item) => item.slug));

    expect([...all].sort()).toEqual(input.map((item) => item.slug).sort());
  });

  it("lista vazia vira nenhum grupo", () => {
    expect(groupServices([])).toEqual([]);
  });
});

describe("pickFeatured", () => {
  it("usa a ordem de FEATURED_SERVICE_SLUGS e devolve o resto separado", () => {
    const input = [
      service("facetas", 1),
      service("clinico-geral", 2),
      service("protese", 3),
      service("ortodontia", 4),
    ];
    const { featured, rest } = pickFeatured(input);

    expect(featured.map((item) => item.slug)).toEqual(["clinico-geral", "ortodontia", "facetas"]);
    expect(rest.map((item) => item.slug)).toEqual(["protese"]);
  });

  it("cai nos primeiros por ordem quando nenhum slug em destaque existe", () => {
    const input = Array.from({ length: 8 }, (_, index) => service(`s${index}`, index));
    const { featured, rest } = pickFeatured(input);

    expect(featured).toHaveLength(FEATURED_SERVICE_SLUGS.length);
    expect(featured[0].slug).toBe("s0");
    expect(rest).toHaveLength(8 - FEATURED_SERVICE_SLUGS.length);
  });

  it("respeita o limite informado", () => {
    const input = FEATURED_SERVICE_SLUGS.map((slug, index) => service(slug, index));
    expect(pickFeatured(input, 2).featured).toHaveLength(2);
  });
});

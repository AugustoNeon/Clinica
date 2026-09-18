import { describe, expect, it } from "vitest";
import { excerpt, formatDate } from "./text";

describe("excerpt", () => {
  it("devolve o texto inteiro quando cabe", () => {
    expect(excerpt("Texto curto.", 50)).toBe("Texto curto.");
  });

  it("corta em palavra inteira e sinaliza com reticências", () => {
    expect(excerpt("Consulta de rotina com limpeza profissional", 20)).toBe("Consulta de rotina…");
  });

  it("normaliza espaços e quebras de linha", () => {
    expect(excerpt("Linha um.\n\n  Linha   dois.", 100)).toBe("Linha um. Linha dois.");
  });
});

describe("formatDate", () => {
  it("formata ISO em pt-BR sem deslocar o dia por fuso", () => {
    expect(formatDate("2026-01-01T00:00:00.000Z")).toBe("1 de janeiro de 2026");
  });

  it("devolve só a data crua quando a string não é uma data", () => {
    expect(formatDate("não-é-data")).toBe("não-é-data");
  });
});

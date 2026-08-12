import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Cobre a regra de nao permitir 2 consultas ATIVAS no mesmo dia+hora
 * (issue #50). O cliente Supabase e mockado de proposito: nao existe
 * projeto Supabase de teste separado do de producao, e gravar consulta
 * fake no banco real (mesmo com limpeza) arrisca deixar lixo em cima de
 * dado real de paciente. Isso testa a camada de guarda em
 * `lib/data/appointments.ts` (o que decide se tenta o insert/update); a
 * garantia final contra corrida e o indice unico parcial do Postgres
 * (migration 0013), que ja foi validado manualmente uma vez (ver
 * historico da issue #37 revisada) e nao tem como ser exercitado sem um
 * banco de teste dedicado — fora de escopo aqui.
 */

const singleMock = vi.fn();
const insertMock = vi.fn();
const updateMock = vi.fn();
const selectAfterWriteMock = vi.fn(() => ({ single: singleMock }));

/** Builder encadeavel que resolve pro resultado configurado em `queryResult`. */
function createQueryBuilder(queryResult: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  const chain = ["select", "eq", "neq", "limit", "order", "gte", "lte"];
  for (const method of chain) {
    builder[method] = vi.fn(() => builder);
  }
  builder.then = (resolve: (value: { data: unknown; error: unknown }) => void) =>
    Promise.resolve(queryResult).then(resolve);
  return builder;
}

let isSlotTakenResult: { data: unknown; error: unknown };

const fromMock = vi.fn((table: string) => {
  if (table !== "appointments") throw new Error(`Tabela inesperada no mock: ${table}`);
  return {
    ...createQueryBuilder(isSlotTakenResult),
    insert: insertMock,
    update: updateMock,
  };
});

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerComponentClient: vi.fn(async () => ({ from: fromMock })),
}));

const { createAppointment, updateAppointment, isSlotTaken } = await import("./appointments");

const baseInput = {
  patient_id: "patient-1",
  service_id: null,
  date: "2026-09-01",
  time: "09:00",
  notes: "",
};

const createdAppointment = {
  id: "appt-1",
  patient_id: "patient-1",
  service_id: null,
  date: "2026-09-01",
  time: "09:00:00",
  status: "confirmada",
  notes: "",
};

beforeEach(() => {
  vi.clearAllMocks();
  isSlotTakenResult = { data: [], error: null };
  insertMock.mockReturnValue({ select: selectAfterWriteMock });
  updateMock.mockReturnValue({ eq: vi.fn(() => ({ select: selectAfterWriteMock })) });
  singleMock.mockResolvedValue({ data: createdAppointment, error: null });
});

describe("isSlotTaken", () => {
  it("retorna false quando nao ha consulta ativa no horario", async () => {
    isSlotTakenResult = { data: [], error: null };
    await expect(isSlotTaken("2026-09-01", "09:00")).resolves.toBe(false);
  });

  it("retorna true quando ja existe consulta ativa no horario", async () => {
    isSlotTakenResult = { data: [{ id: "appt-existente" }], error: null };
    await expect(isSlotTaken("2026-09-01", "09:00")).resolves.toBe(true);
  });
});

describe("createAppointment", () => {
  it("cria a consulta quando o horario esta livre", async () => {
    isSlotTakenResult = { data: [], error: null };

    const result = await createAppointment(baseInput);

    expect(result.id).toBe("appt-1");
    expect(insertMock).toHaveBeenCalledWith({ ...baseInput, status: "confirmada" });
  });

  it("bloqueia com mensagem amigavel quando ja existe consulta ativa no mesmo horario", async () => {
    isSlotTakenResult = { data: [{ id: "appt-existente" }], error: null };

    await expect(createAppointment(baseInput)).rejects.toThrow(
      "Ja existe uma consulta ativa nesse dia e horario.",
    );
    expect(insertMock).not.toHaveBeenCalled();
  });
});

describe("updateAppointment", () => {
  it("permite editar para o mesmo horario sem colidir consigo mesma (excludeId)", async () => {
    isSlotTakenResult = { data: [], error: null };

    await updateAppointment("appt-1", baseInput, "confirmada");

    expect(fromMock).toHaveBeenCalledWith("appointments");
  });

  it("bloqueia atualizar para um horario ja ocupado por OUTRA consulta ativa", async () => {
    isSlotTakenResult = { data: [{ id: "appt-outra" }], error: null };

    await expect(updateAppointment("appt-1", baseInput, "confirmada")).rejects.toThrow(
      "Ja existe uma consulta ativa nesse dia e horario.",
    );
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("cancelar sempre passa, mesmo se o horario 'colidiria' (cancelar libera o slot)", async () => {
    isSlotTakenResult = { data: [{ id: "outra-consulta-no-mesmo-horario" }], error: null };

    await updateAppointment("appt-1", baseInput, "cancelada");

    expect(updateMock).toHaveBeenCalledWith({ ...baseInput, status: "cancelada" });
  });
});

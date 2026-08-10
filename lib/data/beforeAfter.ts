/**
 * Camada de dados de casos de "antes e depois".
 *
 * IMPLEMENTACAO: array estatico, nao Supabase (tabela) — diferente do resto
 * de `lib/data/*` desde a Fase 5. Curadoria manual de 7 casos (de 19
 * autorizados pela clinica), sem CRUD no admin ainda (escopo pequeno nao
 * justifica a infra de RLS/migration das outras entidades — ver demanda
 * #31). Assinatura assincrona por convencao do projeto (2026-08-03), pra
 * nao mudar consumidor se isso virar tabela real depois.
 *
 * As IMAGENS (nao os dados) ficam no bucket publico `resultados` do
 * Supabase Storage, nao em `public/images/` nem no git — sao foto real de
 * paciente (dado de saude), e o repositorio e publico. Ver decisao
 * 2026-08-10 no CLAUDE.md.
 */

const SUPABASE_STORAGE_BASE = "https://rjqeideajodwacumfiel.supabase.co/storage/v1/object/public/resultados";

export interface BeforeAfterCase {
  id: string;
  imageUrl: string;
  procedure: string;
  order: number;
}

const cases: BeforeAfterCase[] = [
  {
    id: "reabilitacao-oral-01",
    imageUrl: `${SUPABASE_STORAGE_BASE}/reabilitacao-oral-01.jpg`,
    procedure: "Reabilitação Oral",
    order: 1,
  },
  {
    id: "clareamento-dental-01",
    imageUrl: `${SUPABASE_STORAGE_BASE}/clareamento-dental-01.jpg`,
    procedure: "Clareamento Dental",
    order: 2,
  },
  {
    id: "harmonizacao-facial-01",
    imageUrl: `${SUPABASE_STORAGE_BASE}/harmonizacao-facial-01.jpg`,
    procedure: "Harmonização Facial",
    order: 3,
  },
  {
    id: "coroas-01",
    imageUrl: `${SUPABASE_STORAGE_BASE}/coroas-01.jpg`,
    procedure: "Coroas",
    order: 4,
  },
  {
    id: "reabilitacao-oral-02",
    imageUrl: `${SUPABASE_STORAGE_BASE}/reabilitacao-oral-02.jpg`,
    procedure: "Reabilitação Oral",
    order: 5,
  },
  {
    id: "dentistica-01",
    imageUrl: `${SUPABASE_STORAGE_BASE}/dentistica-01.jpg`,
    procedure: "Dentística",
    order: 6,
  },
  {
    id: "harmonizacao-facial-02",
    imageUrl: `${SUPABASE_STORAGE_BASE}/harmonizacao-facial-02.jpg`,
    procedure: "Harmonização Facial",
    order: 7,
  },
];

/** Casos de antes/depois publicados, ja ordenados. */
export async function getBeforeAfterCases(): Promise<BeforeAfterCase[]> {
  return [...cases].sort((a, b) => a.order - b.order);
}

import { z } from "zod";

/**
 * Data de uma excecao de agenda (Fase B, issue #35) — unico dado que entra
 * pela borda publica desta entidade (o resto e calculado no servidor: se
 * ja existe excecao pra data, e se o dia e padrao util ou nao). Mesmo
 * padrao minimo de `adminLead.ts`: sem formulario de texto livre aqui.
 */

export const adminScheduleExceptionDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data invalida.")
  .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()), "Data invalida.");

import { z } from "zod";
import type { ContactLeadStatus } from "@/types";

/**
 * Status de `contact_leads` editavel no painel admin — unico campo mutavel
 * desta entidade (o resto e read-only, e o que o paciente enviou no
 * formulario de contato). Sem schema de formulario completo como as
 * outras entidades: nao ha criar/editar texto livre aqui.
 */

export const contactLeadStatusValues = [
  "novo",
  "em_atendimento",
  "concluido",
  "descartado",
] as const satisfies readonly ContactLeadStatus[];

export const contactLeadStatusLabels: Record<ContactLeadStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  concluido: "Concluido",
  descartado: "Descartado",
};

export const adminLeadStatusSchema = z.enum(contactLeadStatusValues);

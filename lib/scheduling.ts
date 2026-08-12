/**
 * Constantes de horario comercial (issue #37 revisada) — modulo sem
 * dependencia de servidor de proposito, pra poder ser importado tanto por
 * `lib/data/appointments.ts` (server) quanto por
 * `components/sections/AppointmentForm.tsx` ("use client").
 *
 * Duplicado de `lib/data/googleCalendar.ts` (Fase C) por decisao —
 * desacoplar esta fase da Fase C, que fica parada.
 */

const SCHEDULING_START_HOUR = 9;
const SCHEDULING_END_HOUR = 19;

export const HOURLY_SLOTS = Array.from(
  { length: SCHEDULING_END_HOUR - SCHEDULING_START_HOUR },
  (_, index) => `${String(SCHEDULING_START_HOUR + index).padStart(2, "0")}:00`,
);

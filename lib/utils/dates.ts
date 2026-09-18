const CLINIC_TIME_ZONE = "America/Sao_Paulo";

/** Data de hoje no fuso da clinica, no formato YYYY-MM-DD usado por `appointments`. */
export function todayInClinicTimeZone(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CLINIC_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Hora (0-23) no fuso da clinica — para a saudacao do painel. */
export function hourInClinicTimeZone(now = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: CLINIC_TIME_ZONE,
    hour: "numeric",
    hour12: false,
  }).format(now);
  return Number(hour) % 24;
}

/** Soma dias a uma data YYYY-MM-DD sem passar por fuso local (aritmetica em UTC). */
export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

/** "seg., 21 de set." a partir de YYYY-MM-DD, sem deslocar o dia. */
export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** "21/09/2026, 14:05" a partir de ISO, no fuso da clinica. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: CLINIC_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** "há 3 dias" / "hoje" / "ontem", relativo ao dia da clinica. */
export function relativeDay(iso: string, now = new Date()): string {
  const target = todayInClinicTimeZone(new Date(iso));
  const today = todayInClinicTimeZone(now);
  if (target === today) return "hoje";
  if (target === addDays(today, -1)) return "ontem";
  const diff = Math.round(
    (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${target}T00:00:00Z`)) / 86_400_000,
  );
  if (diff > 1 && diff < 30) return `há ${diff} dias`;
  return formatDateTime(iso).slice(0, 10);
}

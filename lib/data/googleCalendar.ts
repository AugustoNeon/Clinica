import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { isDateAvailable } from "@/lib/data/scheduleExceptions";
import type { GoogleCalendarTokens } from "@/types";

/**
 * Camada de dados da integracao com o Google Calendar PESSOAL da doutora
 * (Fase C, issue #36) — token OAuth (`google_calendar_tokens`, singleton),
 * calculo de horario livre cruzando a Fase B (dias de trabalho) com a
 * Freebusy API do Google.
 *
 * SEM biblioteca `googleapis`: fetch() direto pros endpoints REST (decisao
 * do /plan — SDK oficial e pesado pra runtime Node.js completo, o deploy
 * real e Cloudflare Workers).
 *
 * Horario comercial HARDCODED aqui (nao em `site_settings`): o formulario
 * generico de `/admin/configuracoes` nao valida formato por chave, entao
 * guardar isso la reabriria exatamente a fragilidade que motivou nao usar
 * texto livre. Mesmo padrao ja aceito pra DEFAULT_WORKDAYS na Fase B.
 */

const SCHEDULING_START_HOUR = 9;
const SCHEDULING_END_HOUR = 19;

/** America/Sao_Paulo e UTC-3 o ano inteiro desde que o Brasil aboliu o
 * horario de verao em 2019 — offset fixo em vez de timezone database. Se
 * essa decisao politica for revertida um dia, este offset fica errado. */
const BRAZIL_UTC_OFFSET = "-03:00";

const GOOGLE_CALENDAR_READONLY_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";
const REFRESH_BUFFER_MS = 60_000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variavel de ambiente ausente: ${name}. Copie .env.example para .env.local e preencha.`,
    );
  }
  return value;
}

function brazilTimeToIso(dateStr: string, hour: number): string {
  return `${dateStr}T${String(hour).padStart(2, "0")}:00:00${BRAZIL_UTC_OFFSET}`;
}

/** URL de autorizacao do Google — `access_type=offline&prompt=consent` garante refresh_token toda vez. */
export function buildGoogleAuthorizationUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_CALENDAR_READONLY_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

const googleTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
  scope: z.string().optional(),
});

type GoogleTokenResponse = z.infer<typeof googleTokenResponseSchema>;

async function requestGoogleToken(params: Record<string, string>): Promise<GoogleTokenResponse> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });

  if (!response.ok) {
    throw new Error(`Falha na autenticacao com o Google: ${response.status}`);
  }

  const parsed = googleTokenResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Resposta inesperada do Google na troca de token.");
  }
  return parsed.data;
}

async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<GoogleTokenResponse> {
  return requestGoogleToken({
    code,
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
}

async function refreshAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
  return requestGoogleToken({
    refresh_token: refreshToken,
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
    grant_type: "refresh_token",
  });
}

interface PersistTokensInput {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  scope: string;
}

async function persistTokens(input: PersistTokensInput): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const expiresAt = new Date(Date.now() + input.expiresIn * 1000).toISOString();
  const { error } = await supabase.from("google_calendar_tokens").upsert(
    {
      id: true,
      access_token: input.accessToken,
      refresh_token: input.refreshToken,
      expires_at: expiresAt,
      scope: input.scope,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(`Falha ao salvar token do Google: ${error.message}`);
}

/** Troca o `code` do callback OAuth por tokens e persiste. Chamado 1x por autorizacao. */
export async function saveTokensFromAuthorizationCode(
  code: string,
  redirectUri: string,
): Promise<void> {
  const tokens = await exchangeCodeForTokens(code, redirectUri);
  if (!tokens.refresh_token) {
    throw new Error("Google nao devolveu refresh_token — reautorize (prompt=consent deveria evitar isso).");
  }

  await persistTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in,
    scope: tokens.scope ?? GOOGLE_CALENDAR_READONLY_SCOPE,
  });
}

/** `true` se ja existe uma conexao (linha na tabela singleton). Nao valida se o token ainda e valido. */
export async function getConnectionStatus(): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("google_calendar_tokens")
    .select("id")
    .eq("id", true)
    .maybeSingle();

  if (error) throw new Error(`Falha ao verificar conexao com o Google: ${error.message}`);
  return Boolean(data);
}

/**
 * Access token valido — renova sozinho via refresh_token se estiver
 * perto de expirar. Google nao devolve um refresh_token novo no grant de
 * refresh, entao o antigo e preservado.
 */
export async function getValidAccessToken(): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("google_calendar_tokens")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar token do Google: ${error.message}`);
  if (!data) throw new Error("Google Calendar nao conectado.");

  const row = data as GoogleCalendarTokens;
  const expiresAt = new Date(row.expires_at).getTime();
  if (expiresAt - Date.now() > REFRESH_BUFFER_MS) {
    return row.access_token;
  }

  const refreshed = await refreshAccessToken(row.refresh_token);
  await persistTokens({
    accessToken: refreshed.access_token,
    refreshToken: row.refresh_token,
    expiresIn: refreshed.expires_in,
    scope: refreshed.scope ?? row.scope,
  });
  return refreshed.access_token;
}

const freeBusyResponseSchema = z.object({
  calendars: z.object({
    primary: z.object({
      busy: z.array(z.object({ start: z.string(), end: z.string() })),
    }),
  }),
});

/**
 * Horarios livres (formato "HH:mm", de hora em hora) pra uma data —
 * critério de aceite da issue #36. `[]` se o dia nao e de trabalho (Fase
 * B) — nem chama o Google nesse caso, economiza a chamada de API.
 */
export async function getFreeSlotsForDate(dateStr: string): Promise<string[]> {
  const available = await isDateAvailable(dateStr);
  if (!available) return [];

  const accessToken = await getValidAccessToken();

  const timeMin = brazilTimeToIso(dateStr, SCHEDULING_START_HOUR);
  const timeMax = brazilTimeToIso(dateStr, SCHEDULING_END_HOUR);

  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: "primary" }] }),
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar disponibilidade no Google Calendar: ${response.status}`);
  }

  const parsed = freeBusyResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Resposta inesperada do Google Calendar.");
  }

  const busyBlocks = parsed.data.calendars.primary.busy.map((block) => ({
    start: new Date(block.start).getTime(),
    end: new Date(block.end).getTime(),
  }));

  const freeSlots: string[] = [];
  for (let hour = SCHEDULING_START_HOUR; hour < SCHEDULING_END_HOUR; hour += 1) {
    const slotStart = new Date(brazilTimeToIso(dateStr, hour)).getTime();
    const slotEnd = new Date(brazilTimeToIso(dateStr, hour + 1)).getTime();
    const overlaps = busyBlocks.some((block) => slotStart < block.end && slotEnd > block.start);
    if (!overlaps) freeSlots.push(`${String(hour).padStart(2, "0")}:00`);
  }

  return freeSlots;
}

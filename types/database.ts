/**
 * Interfaces compartilhadas espelhando o rascunho de schema do banco
 * (PLANEJAMENTO.md, secao 5 — "Modelagem de dados").
 *
 * Estado: RASCUNHO. O schema final so fecha depois das respostas do
 * questionario da cliente. Os nomes de campo usam snake_case de proposito:
 * sao os nomes de coluna do Postgres/Supabase, de modo que a troca de
 * `lib/data/*` (hoje mock) por queries reais nao mude nenhum consumidor.
 *
 * Campos de data/hora chegam do Supabase como string ISO 8601 (timestamptz),
 * por isso `string` e nao `Date`.
 */

/** Tabela `services`. */
export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Texto mais longo pra pagina individual do servico — descricao generica da especialidade, nao especifica desta clinica. */
  long_description: string | null;
  category: string | null;
  image_url: string | null;
  /** Coluna `order` — ordem de exibicao na listagem. */
  order: number;
  published: boolean;
}

/** Tabela `team_members`. */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Registro no Conselho Regional de Odontologia. Obrigatorio por norma do CFO na divulgacao de profissional. */
  cro_number: string | null;
  bio: string;
  photo_url: string | null;
  order: number;
  published: boolean;
}

export type BlogPostStatus = "draft" | "published" | "archived";

/** Tabela `blog_posts`. */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  /** FK para o usuario do Supabase Auth que assina o post. */
  author_id: string | null;
  status: BlogPostStatus;
  /** ISO 8601. `null` enquanto o post nao foi publicado. */
  published_at: string | null;
}

/** Tabela `testimonials`. */
export interface Testimonial {
  id: string;
  patient_name: string;
  content: string;
  /** 1 a 5. */
  rating: number;
  photo_url: string | null;
  /** LGPD: so publica com consentimento por escrito do paciente (PLANEJAMENTO.md secao 7). */
  consent_confirmed: boolean;
  published: boolean;
}

export type ContactLeadStatus = "novo" | "em_atendimento" | "concluido" | "descartado";

/**
 * Tabela `contact_leads`. Guarda DADO PESSOAL de paciente em potencial:
 * acesso restrito ao painel admin autenticado (RLS), nunca exposto em rota
 * publica, com politica de retencao definida (PLANEJAMENTO.md secao 7).
 */
export interface ContactLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferred_service: string | null;
  status: ContactLeadStatus;
  /** ISO 8601. */
  created_at: string;
  /**
   * LACUNA CONHECIDA DO RASCUNHO: a secao 5 do PLANEJAMENTO.md nao lista
   * esta coluna, mas a secao 7 exige consentimento explicito registrado.
   * O schema final precisa persistir o aceite (e idealmente a versao da
   * politica aceita) — mantido aqui para o formulario nao perder o dado.
   */
  lgpd_consent: boolean;
}

/** Payload de criacao: o banco gera `id`/`created_at` e `status` tem default. */
export type NewContactLead = Omit<ContactLead, "id" | "created_at" | "status">;

/** Tabela `site_settings` — endereco, telefone, horario, redes sociais. */
export interface SiteSetting {
  key: string;
  value: string;
}

/**
 * Tabela `schedule_exceptions` (Fase B, issue #35) — excecoes ao padrao de
 * dias de trabalho (segunda a sexta, constante em
 * `lib/data/scheduleExceptions.ts`, nao coluna do banco). Um dia SEM linha
 * aqui segue o padrao; uma linha aqui SEMPRE inverte o padrao daquele dia.
 */
export interface ScheduleException {
  id: string;
  /** formato YYYY-MM-DD. */
  date: string;
  /** true = disponibilidade extra (ex.: sabado); false = folga num dia util. */
  is_available: boolean;
  /** ISO 8601. */
  created_at: string;
}

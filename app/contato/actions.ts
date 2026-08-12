"use server";

import { createLead } from "@/lib/data/leads";
import { notifyNewLead } from "@/lib/email/notifyLead";
import {
  contactFormInputFromFormData,
  validateContactForm,
  type ContactFormState,
} from "@/lib/validation/contact";

/**
 * Server Action do formulario de contato.
 *
 * O QUE JA VALE AQUI:
 * - Validacao de SERVIDOR com o mesmo schema Zod do cliente. A validacao
 *   do browser e conveniencia; esta e a barreira (PLANEJAMENTO.md secao 6).
 * - Nenhum dado pessoal em log. Falha inesperada vira mensagem generica
 *   para o usuario — sem stack trace, sem eco do payload.
 * - NOTIFICACAO POR E-MAIL (issue #49, `lib/email/notifyLead.ts`): liga
 *   sozinho quando RESEND_API_KEY/CONTACT_NOTIFICATION_FROM/
 *   CONTACT_NOTIFICATION_TO existirem. `notifyNewLead` nunca lanca — o
 *   lead ja foi salvo antes dela ser chamada, uma falha de e-mail nao
 *   pode fazer a submissao parecer que falhou pro paciente.
 *
 * O QUE FALTA (nao da para fazer nesta fase):
 *
 * 1. TURNSTILE (anti-bot). Nao ha site key nem secret key ainda: o projeto
 *    Cloudflare Turnstile so e criado quando o dominio da clinica existir.
 *    Quando existir, o widget injeta o campo `cf-turnstile-response` no
 *    formulario e a verificacao entra AQUI, antes de qualquer gravacao:
 *
 *      const token = formData.get("cf-turnstile-response");
 *      const verify = await fetch(
 *        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
 *        { method: "POST", body: new URLSearchParams({
 *            secret: process.env.TURNSTILE_SECRET_KEY ?? "",
 *            response: String(token ?? ""),
 *          }) },
 *      );
 *      // token invalido => devolve erro generico e NAO grava o lead.
 *
 *    Lembrar de liberar `challenges.cloudflare.com` no CSP (next.config.ts).
 *
 * 2. RATE LIMITING. Falta e nao esta coberto por Turnstile. Server Action
 *    e um endpoint POST publico: sem limite, um script grava lead em loop.
 *    O limite tem que morar na camada de API/borda de verdade (middleware
 *    do Next, ou regra de rate limit da hospedagem/Cloudflare), com chave
 *    por IP + janela curta. Contador em memoria NAO serve: nao sobrevive a
 *    ambiente serverless com varias instancias.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const input = contactFormInputFromFormData(formData);
  const result = validateContactForm(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      errors: result.errors,
    };
  }

  try {
    await createLead({
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email,
      message: result.data.message,
      preferred_service: result.data.preferred_service,
      lgpd_consent: result.data.lgpd_consent,
    });

    await notifyNewLead({
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email,
      message: result.data.message,
      preferredService: result.data.preferred_service,
    });

    return {
      status: "success",
      message: "Mensagem recebida. A clinica entrara em contato pelos dados informados.",
      errors: {},
    };
  } catch {
    // Erro nao pode vazar detalhe interno para o usuario final
    // (PLANEJAMENTO.md secao 6). Observabilidade real entra na Fase 7.
    return {
      status: "error",
      message: "Nao foi possivel enviar sua mensagem agora. Tente novamente em instantes.",
      errors: {},
    };
  }
}

"use server";

import { headers } from "next/headers";
import { createLead } from "@/lib/data/leads";
import { hashIp, isRateLimited } from "@/lib/data/rateLimit";
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
 * - RATE LIMITING por IP (issue #51, `lib/data/rateLimit.ts`): 5
 *   submissoes por 10 minutos, guardado em Postgres (nao em memoria — o
 *   Worker roda em varias instancias de borda, contador local nao
 *   sobreviveria). Roda ANTES da validacao Zod, pra bloquear tambem
 *   payload invalido em loop.
 * - TURNSTILE (issue #51): verificado se `TURNSTILE_SECRET_KEY` estiver
 *   setada — liga sozinho quando a env var existir, sem precisar editar
 *   codigo. Sem a env var (dev local, ou enquanto a chave nao foi criada
 *   no Cloudflare), a verificacao e pulada e o formulario segue
 *   funcionando normalmente.
 * - NOTIFICACAO POR E-MAIL (issue #49, `lib/email/notifyLead.ts`): liga
 *   sozinho quando RESEND_API_KEY/CONTACT_NOTIFICATION_FROM/
 *   CONTACT_NOTIFICATION_TO existirem. `notifyNewLead` nunca lanca — o
 *   lead ja foi salvo antes dela ser chamada, uma falha de e-mail nao
 *   pode fazer a submissao parecer que falhou pro paciente.
 */

/** Cloudflare injeta o IP real do cliente neste header; `x-forwarded-for` cobre outros proxies/dev local. */
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const cfIp = headerList.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

/** `false` se o token for invalido. Pulada (retorna `true`) se a secret key nao estiver configurada. */
async function verifyTurnstile(formData: FormData): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const token = formData.get("cf-turnstile-response");
  if (!token) return false;

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({ secret, response: String(token) }),
    },
  );
  const result = (await response.json()) as { success: boolean };
  return result.success;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const genericError: ContactFormState = {
    status: "error",
    message: "Nao foi possivel enviar sua mensagem agora. Tente novamente em instantes.",
    errors: {},
  };

  // Falha aqui (ex.: migration da tabela ainda nao aplicada) NAO pode
  // derrubar o formulario publico -- rate limit fecha em ABERTO (permite
  // a tentativa) em vez de quebrar o unico canal de contato do site.
  try {
    const ipHash = await hashIp(await getClientIp());
    if (await isRateLimited(ipHash)) {
      return {
        status: "error",
        message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
        errors: {},
      };
    }
  } catch {
    // Sem log de erro aqui de proposito: sem observabilidade real ainda
    // (issue #54), console.error so viraria ruido sem consumidor.
  }

  if (!(await verifyTurnstile(formData))) {
    return genericError;
  }

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
    return genericError;
  }
}

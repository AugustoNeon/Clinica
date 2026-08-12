import "server-only";

/**
 * Notificacao por e-mail de novo lead (issue #49).
 *
 * Liga sozinho quando as 3 env vars existirem (RESEND_API_KEY,
 * CONTACT_NOTIFICATION_FROM, CONTACT_NOTIFICATION_TO, ja previstas em
 * `.env.example`) -- sem elas, `notifyNewLead` e um no-op silencioso e o
 * formulario de contato segue funcionando normal (so nao avisa ninguem).
 *
 * NUNCA logar o conteudo do lead (nome/telefone/e-mail/mensagem sao dado
 * pessoal) -- o unico lugar que essas strings aparecem e no corpo do
 * e-mail enviado pra clinica, nunca em console.*.
 */

interface NewLeadNotificationInput {
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferredService: string | null;
}

/** Nunca lanca: falha no envio de e-mail nao pode impedir o lead de ja ter sido salvo no banco. */
export async function notifyNewLead(input: NewLeadNotificationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_NOTIFICATION_FROM;
  const to = process.env.CONTACT_NOTIFICATION_TO;
  if (!apiKey || !from || !to) return;

  const subject = input.preferredService
    ? `Novo contato pelo site — ${input.preferredService}`
    : "Novo contato pelo site";

  const text = [
    `Nome: ${input.name}`,
    `Telefone: ${input.phone}`,
    `E-mail: ${input.email || "nao informado"}`,
    `Servico de interesse: ${input.preferredService ?? "nao informado"}`,
    "",
    "Mensagem:",
    input.message,
  ].join("\n");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
  } catch {
    // Falha de rede/Resend nao pode derrubar a submissao do formulario
    // (o lead ja foi gravado antes desta chamada). Sem log de proposito:
    // sem observabilidade real ainda (issue #54).
  }
}

import { Container } from "@/components/ui/Container";
import { IconWhatsApp } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface UrgencyBarProps {
  whatsapp: string;
}

/**
 * Faixa coral logo abaixo do hero (issue #73). Substitui a faixa de fatos em
 * movimento: aquela era uma "tira de estatisticas" com marquee, padrao que
 * as skills de revisao anti-IA apontam, e repetia o que a pagina ja diz. Esta
 * carrega UMA informacao que o paciente usa de verdade — urgencia fora do
 * horario vai direto pelo WhatsApp (questionario da clinica) — com o numero
 * e o link. Parada, sem controle de pausa necessario.
 *
 * Coral cheio com tinta por cima (6.1:1).
 */
export function UrgencyBar({ whatsapp }: UrgencyBarProps) {
  if (!whatsapp) return null;
  const href = buildWhatsAppUrl(whatsapp, "Olá! Estou com uma urgência odontológica.");

  return (
    <div className="bg-terracotta text-ink">
      <Container className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="font-display text-lg font-semibold leading-snug sm:text-xl">
          Dor ou urgência fora do horário? Fale direto com a Dra. Ariane.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 text-base font-semibold text-surface transition-colors ease-out hover:bg-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:self-auto"
        >
          <IconWhatsApp width={20} height={20} />
          {whatsapp}
        </a>
      </Container>
    </div>
  );
}

import { Container } from "@/components/ui/Container";

interface TrustStripProps {
  insurance: string;
  serviceCount: number;
}

/**
 * Faixa de confianca logo abaixo do hero. Cada item e um FATO confirmado
 * pela clinica (questionario 2026-08-04/05 e AGENTS.md), nunca numero
 * inflado — "mostrar, nao prometer" (PRODUCT.md, principio 2).
 */
export function TrustStrip({ insurance, serviceCount }: TrustStripProps) {
  const items = [
    {
      title: "Uma profissional, do início ao fim",
      text: "Quem avalia é quem trata: a Dra. Ariane acompanha cada etapa pessoalmente.",
    },
    {
      title: `${serviceCount} especialidades em um só lugar`,
      text: "Da limpeza de rotina ao implante, sem precisar peregrinar entre clínicas.",
    },
    {
      title: "Urgência pelo WhatsApp",
      text: "Fora do horário comum, casos de urgência são atendidos direto pelo WhatsApp.",
    },
    {
      title: insurance ? `Particular e ${insurance}` : "Atendimento particular",
      text: "Pagamento em dinheiro, Pix ou cartão de débito e crédito.",
    },
  ];

  return (
    <div className="border-b border-ink/10 bg-surface">
      <Container>
        <ul className="grid gap-x-8 gap-y-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {items.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
              <div>
                <p className="font-display text-lg font-medium leading-snug">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

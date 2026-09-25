import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconWhatsApp } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface CtaBandProps {
  whatsapp: string;
  phone?: string;
  title?: string;
  text?: string;
  /** Mensagem pre-preenchida no WhatsApp (ex.: cita o servico da pagina). */
  whatsappMessage?: string;
}

/**
 * Faixa final de conversao, azul com texto branco (estrategia "committed":
 * a cor da marca carrega a secao inteira). Camada rica (issue #71): a
 * textura de arcos por cima do azul e a foto real da doutora encostada na
 * base da faixa — a pessoa que vai atender aparece no momento de decidir.
 */
export function CtaBand({
  whatsapp,
  phone,
  title = "Vamos cuidar do seu sorriso?",
  text = "Conte o que você está sentindo ou o que quer mudar. A avaliação define o próximo passo — e você decide com calma.",
  whatsappMessage = "Olá! Gostaria de agendar uma avaliação.",
}: CtaBandProps) {
  const whatsappHref = buildWhatsAppUrl(whatsapp, whatsappMessage);

  return (
    <section className="relative overflow-hidden bg-blue-dark text-white">
      <div aria-hidden className="pattern-arcs pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue/40 blur-3xl"
      />
      <Container className="relative grid items-end gap-10 pt-16 sm:pt-20 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16 lg:pt-0">
        <div className="reveal max-w-2xl pb-16 sm:pb-20 lg:py-28">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/90 sm:text-xl">{text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("inverse", "", "lg")}
            >
              <IconWhatsApp width={20} height={20} />
              Agendar pelo WhatsApp
            </a>
            <Link href="/contato" className={buttonClasses("outline-inverse", "", "lg")}>
              Enviar mensagem
            </Link>
          </div>
          {phone && (
            <p className="mt-6 text-sm text-white/90">
              Ou ligue:{" "}
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="inline-flex min-h-11 items-center font-medium text-white underline-offset-4 hover:underline"
              >
                {phone}
              </a>
            </p>
          )}
        </div>

        {/* Foto encostada na base da faixa: arco em cima, reta embaixo. */}
        <div className="relative mx-auto w-56 self-end sm:w-72 lg:w-full lg:max-w-sm lg:justify-self-end">
          <div
            aria-hidden
            className="absolute -inset-x-6 bottom-0 top-10 rounded-t-[999px] bg-blue-deep/50"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px]">
            <Image
              src="/images/team/ariane-04-jaleco-retrato.jpg"
              alt="Dra. Ariane Vaz Storrer de jaleco"
              fill
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 18rem, 14rem"
              className="object-cover object-top"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

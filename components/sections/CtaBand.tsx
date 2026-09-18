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
 * Faixa final de conversao, azul solido com texto branco (estrategia
 * "committed": a cor da marca carrega a secao inteira). O glifo do
 * sorriso do logo entra como marca-d'agua — assinatura, nao enfeite.
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
      <Image
        src="/images/logo/icon-smile.png"
        alt=""
        width={512}
        height={512}
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-72 opacity-10 brightness-0 invert sm:h-96 sm:w-96 lg:-right-4 lg:h-[30rem] lg:w-[30rem]"
      />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="reveal max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/90">{text}</p>
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
            <Link
              href="/contato"
              className={buttonClasses(
                "ghost",
                "text-white hover:bg-white/10 focus-visible:outline-white",
                "lg",
              )}
            >
              Enviar mensagem
            </Link>
          </div>
          {phone && (
            <p className="mt-6 text-sm text-white/90">
              Ou ligue:{" "}
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="inline-block py-1 font-medium text-white underline-offset-4 hover:underline"
              >
                {phone}
              </a>
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

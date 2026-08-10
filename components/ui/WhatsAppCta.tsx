import type { ReactNode } from "react";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { buttonClasses, type ButtonVariant } from "./Button";

interface WhatsAppCtaProps {
  whatsapp: string;
  message?: string;
  variant?: ButtonVariant;
  className?: string;
  children?: ReactNode;
}

/** CTA de agendamento via WhatsApp — ao lado do formulário de contato, não no lugar dele. */
export function WhatsAppCta({
  whatsapp,
  message = "Olá! Gostaria de agendar uma avaliação.",
  variant = "secondary",
  className = "",
  children = "Agendar pelo WhatsApp",
}: WhatsAppCtaProps) {
  return (
    <a
      href={buildWhatsAppUrl(whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses(variant, className)}
    >
      {children}
    </a>
  );
}

import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { PracticalInfo } from "@/components/sections/PracticalInfo";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroEmblem } from "@/components/ui/HeroEmblem";
import { IconClock, IconMail, IconPhone, IconWhatsApp } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { getServices } from "@/lib/data/services";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export const metadata: Metadata = {
  title: "Contato e agendamento",
  description:
    "Agende uma avaliação com a Dra. Ariane Vaz Storrer em Araucária (PR): WhatsApp, telefone ou formulário de contato.",
};

export default async function ContatoPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettingsMap()]);
  const whatsappHref = buildWhatsAppUrl(settings.whatsapp, "Olá! Gostaria de agendar uma avaliação.");

  return (
    <>
      <PageHero
        title="Vamos conversar?"
        lead="O caminho mais rápido é o WhatsApp. Se preferir, ligue ou deixe uma mensagem pelo formulário — a clínica responde no horário de atendimento."
        visual={
          <HeroEmblem>
            <IconWhatsApp width={112} height={112} />
          </HeroEmblem>
        }
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("inverse", "", "lg")}
        >
          <IconWhatsApp width={20} height={20} />
          Chamar no WhatsApp
        </a>
        {settings.phone && (
          <a
            href={`tel:${settings.phone.replace(/\D/g, "")}`}
            className={buttonClasses("outline-inverse", "", "lg")}
          >
            <IconPhone width={20} height={20} />
            {settings.phone}
          </a>
        )}
      </PageHero>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Deixe uma mensagem</h2>
            <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-muted">
              Conte o que você está sentindo ou o que gostaria de mudar. Não
              precisa saber o nome do procedimento — isso a avaliação descobre.
            </p>
            <div className="mt-8">
              <ContactForm services={services} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-surface-tint p-6 sm:p-8">
              <h2 className="font-display text-xl font-medium">Outros canais</h2>
              <ul className="mt-5 space-y-5">
                <li className="flex gap-3">
                  <IconWhatsApp className="mt-0.5 shrink-0 text-blue-dark" width={22} height={22} />
                  <div>
                    <p className="text-sm font-medium text-ink-muted">WhatsApp</p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-lg font-medium text-ink underline-offset-4 hover:underline"
                    >
                      {settings.whatsapp}
                    </a>
                    <p className="mt-0.5 text-sm text-ink-muted">Urgências também por aqui.</p>
                  </div>
                </li>
                {settings.phone && (
                  <li className="flex gap-3">
                    <IconPhone className="mt-0.5 shrink-0 text-blue-dark" width={22} height={22} />
                    <div>
                      <p className="text-sm font-medium text-ink-muted">Telefone</p>
                      <a
                        href={`tel:${settings.phone.replace(/\D/g, "")}`}
                        className="inline-flex min-h-11 items-center text-lg font-medium text-ink underline-offset-4 hover:underline"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </li>
                )}
                {settings.email && (
                  <li className="flex gap-3">
                    <IconMail className="mt-0.5 shrink-0 text-blue-dark" width={22} height={22} />
                    <div>
                      <p className="text-sm font-medium text-ink-muted">E-mail</p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="inline-block break-all py-1 text-base font-medium text-ink underline-offset-4 hover:underline"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </li>
                )}
                {settings.opening_hours && (
                  <li className="flex gap-3">
                    <IconClock className="mt-0.5 shrink-0 text-blue-dark" width={22} height={22} />
                    <div>
                      <p className="text-sm font-medium text-ink-muted">Horário de atendimento</p>
                      <p className="text-lg font-medium">{settings.opening_hours}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </Container>
      </section>

      <PracticalInfo settings={settings} title="Como chegar" compact />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";
import { getTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Equipe",
};

export default async function EquipePage() {
  const [members, settings] = await Promise.all([getTeamMembers(), getSiteSettingsMap()]);
  /*
   * A clinica tem UMA profissional (PRODUCT.md) — por isso esta pagina nao usa
   * o `TeamGrid`: uma grade de um card so parece lista incompleta. O layout
   * abaixo e uso unico e mora aqui mesmo, sem virar componente.
   */
  const professional = members[0] ?? null;

  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          O nome e a foto da Dra. Ariane já são reais. CRO e biografia ainda não
          foram enviados pela clínica — continuam placeholder até lá.
        </PlaceholderNotice>
      </Container>

      <Section
        title="Sobre a profissional"
        description="A Dra. Ariane Vaz Storrer é a única profissional da clínica."
      >
        {professional === null ? (
          <p className="text-ink-muted">Nenhum profissional cadastrado ainda.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-[14rem_minmax(0,1fr)] sm:items-start">
            {/* `photo_url` e `null` hoje: sem foto, o bloco simplesmente nao renderiza. */}
            {professional.photo_url && (
              <Image
                src={professional.photo_url}
                alt={professional.name}
                width={224}
                height={280}
                className="w-full rounded-2xl object-cover"
              />
            )}

            <div className={professional.photo_url ? "" : "sm:col-span-2 max-w-2xl"}>
              <h3 className="text-2xl font-semibold tracking-tight">{professional.name}</h3>
              <p className="mt-1 text-sm text-ink-muted">{professional.role}</p>
              {/* Divulgacao de profissional de odontologia exige o numero do CRO. */}
              {professional.cro_number && (
                <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
                  {professional.cro_number}
                </p>
              )}

              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                {professional.bio}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contato" className={buttonClasses("primary")}>
                  Agendar avaliação
                </Link>
                <WhatsAppCta whatsapp={settings.whatsapp} />
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

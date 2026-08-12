import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { adminSections } from "./layout";

export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

const sectionDescriptions: Record<string, string> = {
  "/admin/servicos": "Editar as especialidades e procedimentos divulgados no site.",
  "/admin/equipe": "Editar nome, cargo, CRO, bio e foto da profissional.",
  "/admin/blog": "Criar, editar e publicar posts do blog.",
  "/admin/depoimentos": "Gerenciar depoimentos de pacientes (com consentimento).",
  "/admin/pacientes": "Cadastro de pacientes da clínica.",
  "/admin/agenda": "Dias de trabalho, consultas marcadas e horários livres.",
  "/admin/configuracoes": "Endereço, telefone, horário, redes sociais e outros dados fixos.",
  "/admin/leads": "Ver e atualizar o status das mensagens recebidas pelo formulário de contato.",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Bem-vinda</h1>
      <p className="mt-2 text-sm opacity-80">
        Escolha o que você quer editar.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <li key={section.href}>
            <Link href={section.href} className="block h-full">
              <Card className="h-full transition ease-out hover:border-blue hover:bg-surface-tint">
                <CardTitle>{section.label}</CardTitle>
                <p className="mt-2 text-sm text-ink-muted">
                  {sectionDescriptions[section.href]}
                </p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

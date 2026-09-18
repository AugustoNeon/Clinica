import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { ListRow } from "@/components/admin/ListRow";
import { inputClasses } from "@/components/admin/form";
import { buttonClasses } from "@/components/ui/Button";
import { IconCalendar, IconPlus, IconSearch, IconUsers } from "@/components/ui/icons";
import { getAllPatients } from "@/lib/data/patients";
import { excerpt } from "@/lib/utils/text";

export const metadata: Metadata = {
  title: "Pacientes",
  robots: { index: false, follow: false },
};

interface PatientsPageProps {
  searchParams: Promise<{ q?: string }>;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Cadastro de pacientes (dado pessoal — nada desta tela e logado). Busca por nome ou telefone. */
export default async function AdminPatientsPage({ searchParams }: PatientsPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const patients = await getAllPatients();
  const needle = normalize(query);
  const digits = query.replace(/\D/g, "");
  const visible = query
    ? patients.filter(
        (patient) =>
          normalize(patient.name).includes(needle) ||
          (digits.length > 0 && patient.phone.replace(/\D/g, "").includes(digits)),
      )
    : patients;

  return (
    <div>
      <AdminPageHeader
        title="Pacientes"
        description={`${patients.length} ${patients.length === 1 ? "paciente cadastrado" : "pacientes cadastrados"}. Pessoas que já são atendidas pela clínica — diferente das mensagens do site.`}
        actions={
          <Link href="/admin/pacientes/novo" className={buttonClasses("primary")}>
            <IconPlus width={18} height={18} />
            Novo paciente
          </Link>
        }
      />

      <form method="get" role="search" className="mb-4 flex max-w-md items-center gap-2">
        <label htmlFor="q" className="sr-only">
          Buscar por nome ou telefone
        </label>
        <div className="relative flex-1">
          <IconSearch
            width={18}
            height={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Buscar por nome ou telefone"
            className={`${inputClasses} pl-10`}
          />
        </div>
        <button type="submit" className={buttonClasses("secondary")}>
          Buscar
        </button>
      </form>

      <AdminPanel flush>
        {visible.length === 0 ? (
          <EmptyState
            icon={<IconUsers />}
            title={query ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            text={
              query
                ? `Nada bate com "${query}". Tente só o primeiro nome ou parte do telefone.`
                : "Cadastre quem já é atendido pela clínica para marcar consultas na agenda."
            }
            action={
              query ? (
                <Link href="/admin/pacientes" className={buttonClasses("secondary")}>
                  Limpar busca
                </Link>
              ) : (
                <Link href="/admin/pacientes/novo" className={buttonClasses("primary")}>
                  Cadastrar o primeiro
                </Link>
              )
            }
          />
        ) : (
          <ul className="divide-y divide-ink/10">
            {visible.map((patient) => (
              <ListRow
                key={patient.id}
                href={`/admin/pacientes/${patient.id}/editar`}
                title={patient.name}
                meta={
                  <>
                    {patient.phone}
                    {patient.email ? ` · ${patient.email}` : ""}
                    {patient.notes ? <span className="block">{excerpt(patient.notes, 90)}</span> : null}
                  </>
                }
                actions={
                  <Link
                    href={`/admin/agenda/consultas/nova?paciente=${patient.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-dark transition-colors ease-out hover:bg-surface-tint"
                  >
                    <IconCalendar width={16} height={16} />
                    <span className="hidden sm:inline">Marcar consulta</span>
                  </Link>
                }
              />
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}

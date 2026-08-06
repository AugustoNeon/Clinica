import type { Metadata } from "next";
import { getLeads } from "@/lib/data/leads";
import { contactLeadStatusLabels, contactLeadStatusValues } from "@/lib/validation/adminLead";
import { updateLeadStatusAction } from "./actions";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

const selectClasses =
  "rounded-lg border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Leads</h1>
      <p className="mt-2 text-sm opacity-70">
        Mensagens recebidas pelo formulario de contato. Dado pessoal (LGPD) — visivel so aqui,
        nome/telefone/e-mail/mensagem sao read-only (o que o paciente enviou); so o status pode
        ser alterado.
      </p>

      {leads.length === 0 ? (
        <p className="mt-6 text-sm opacity-70">Nenhum lead recebido ainda.</p>
      ) : (
        <ul className="mt-6 divide-y divide-black/10 dark:divide-white/15">
          {leads.map((lead) => {
            const updateStatusWithId = updateLeadStatusAction.bind(null, lead.id);

            return (
              <li key={lead.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm opacity-70">
                      {lead.phone}
                      {lead.email ? ` — ${lead.email}` : ""}
                    </p>
                    {lead.preferred_service && (
                      <p className="text-sm opacity-70">
                        Servico de interesse: {lead.preferred_service}
                      </p>
                    )}
                    <p className="mt-2 text-sm">{lead.message}</p>
                    <p className="mt-2 text-xs opacity-60">
                      {new Date(lead.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>

                  <form action={updateStatusWithId} className="flex items-center gap-2">
                    <select name="status" defaultValue={lead.status} className={selectClasses}>
                      {contactLeadStatusValues.map((value) => (
                        <option key={value} value={value}>
                          {contactLeadStatusLabels[value]}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="text-sm underline underline-offset-2">
                      Atualizar
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

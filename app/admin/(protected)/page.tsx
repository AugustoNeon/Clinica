import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Bem-vinda</h1>
      <p className="mt-2 text-sm opacity-80">
        Login funcionando. As telas de gerenciamento de conteudo (servicos, equipe, blog,
        depoimentos, dados institucionais e mensagens recebidas) entram no proximo PR.
      </p>
    </div>
  );
}

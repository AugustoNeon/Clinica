import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Politica de Privacidade (placeholder)",
};

/**
 * Politica de privacidade — OBRIGATORIA por causa da LGPD, independente do
 * que a cliente responder (PLANEJAMENTO.md secao 7).
 *
 * O texto abaixo e ESQUELETO DE PLACEHOLDER: marca quais secoes a politica
 * precisa ter. NAO e texto juridico e nao pode ir para producao como esta —
 * a versao final precisa dos dados reais do controlador (razao social, CNPJ,
 * encarregado/DPO, canal de titular) e de revisao juridica.
 */
export default function PrivacidadePage() {
  return (
    <>
      <Container className="pt-8">
        <PlaceholderNotice>
          Este texto e um ESQUELETO, nao uma politica de privacidade valida.
          Ele lista as secoes exigidas pela LGPD e precisa ser preenchido com
          os dados reais do controlador e revisado juridicamente antes do
          lancamento.
        </PlaceholderNotice>
      </Container>

      <Section title="Politica de Privacidade (placeholder)">
        <div className="max-w-2xl space-y-6 text-base leading-relaxed opacity-90">
          <div>
            <h3 className="text-lg font-medium">1. Quem e o controlador (placeholder)</h3>
            <p className="mt-2">
              Razao social, CNPJ, endereco e canal de contato do controlador dos
              dados. Preencher com os dados reais da clinica.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">2. Quais dados sao coletados (placeholder)</h3>
            <p className="mt-2">
              Dados informados no formulario de contato: nome, telefone, e-mail
              (opcional), servico de interesse e mensagem. Descrever tambem
              dados de navegacao, se houver analytics.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">3. Finalidade e base legal (placeholder)</h3>
            <p className="mt-2">
              Para que os dados sao usados (responder ao contato e agendar
              atendimento) e sob qual base legal da LGPD — consentimento, no
              caso do formulario.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">4. Compartilhamento (placeholder)</h3>
            <p className="mt-2">
              Com quem os dados sao compartilhados: provedor de hospedagem,
              provedor de banco de dados e servico de envio de e-mail.
              Preencher com os fornecedores efetivamente contratados.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">5. Retencao e exclusao (placeholder)</h3>
            <p className="mt-2">
              Prazo de guarda das mensagens recebidas e criterio de exclusao ou
              anonimizacao. Prazo ainda A DEFINIR com a clinica.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">6. Direitos do titular (placeholder)</h3>
            <p className="mt-2">
              Como o titular pede acesso, correcao, portabilidade ou exclusao
              dos dados, e por qual canal. Definir o canal de atendimento ao
              titular e o encarregado (DPO).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">7. Seguranca (placeholder)</h3>
            <p className="mt-2">
              Medidas tecnicas e organizacionais adotadas: HTTPS, acesso
              restrito e autenticado ao painel administrativo, backups.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">8. Cookies (placeholder)</h3>
            <p className="mt-2">
              Quais cookies o site usa e para que. Hoje o site nao usa cookie de
              rastreamento; revisar quando entrar analytics.
            </p>
          </div>

          <p className="text-sm opacity-70">
            Ultima atualizacao: (placeholder — preencher na publicacao)
          </p>
        </div>
      </Section>
    </>
  );
}

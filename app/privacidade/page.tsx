import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { getSiteSettingsMap } from "@/lib/data/siteSettings";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

/**
 * Política de privacidade — OBRIGATÓRIA por causa da LGPD (PLANEJAMENTO.md
 * seção 7). Texto real desde 2026-08-12 (issue #48): respostas do usuário
 * sobre CNPJ/pessoa física, prazo de retenção, dado de agendamento e canal
 * de contato do titular.
 *
 * Endereço/telefone/e-mail vêm de `site_settings` (mesma fonte do rodapé) em
 * vez de hardcoded, pra não duplicar dado que já existe em um lugar só.
 *
 * Ainda não é revisão jurídica formal — recomendado (não bloqueante, ver
 * issue #48) antes de ativar agendamento real pelo site.
 */
export default async function PrivacidadePage() {
  const settings = await getSiteSettingsMap();

  return (
    <Section title="Política de Privacidade">
      <div className="max-w-2xl space-y-6 text-base leading-relaxed opacity-90">
        <div>
          <h3 className="text-lg font-medium">1. Quem é o controlador</h3>
          <p className="mt-2">
            {settings.clinic_name} ainda não tem CNPJ constituído — o
            faturamento não justifica hoje a abertura de pessoa jurídica, e a
            Dra. Ariane Vaz Storrer atua como profissional autônoma (pessoa
            física). A LGPD (art. 5º, inciso VI) trata pessoa física e
            jurídica igualmente como possível controladora de dados, então
            isso não reduz nenhuma obrigação — só muda como o controlador é
            identificado aqui: nome completo da profissional e dados de
            contato abaixo, não o CNPJ (que não existe) nem o CPF (que é dado
            pessoal sensível e não é publicado nesta página).
          </p>
          <p className="mt-2">
            Endereço: {settings.address}. Telefone: {settings.phone}. E-mail:{" "}
            {settings.email}.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">2. Quais dados são coletados</h3>
          <p className="mt-2">
            Pelo formulário de contato (<code>/contato</code>): nome,
            telefone, e-mail (opcional), serviço de interesse e mensagem. O
            envio passa por verificação anti-spam (Cloudflare Turnstile), que
            processa sinais técnicos do navegador para confirmar que quem
            enviou não é um robô.
          </p>
          <p className="mt-2">
            O site ainda não tem formulário de agendamento público. Quando
            existir, ele também vai poder coletar o tipo de procedimento
            desejado — escolhido entre os serviços já listados no site ou
            escrito livremente pela pessoa. Esse dado pode ser considerado
            dado de saúde (LGPD art. 11, categoria sensível) e vai exigir
            consentimento específico, além do consentimento geral de contato
            já usado hoje.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">3. Finalidade e base legal</h3>
          <p className="mt-2">
            Os dados são usados para responder à mensagem enviada e, quando
            aplicável, organizar o agendamento de consulta. A base legal é o
            consentimento do titular (LGPD art. 7º, I), coletado pelo
            checkbox de consentimento no próprio formulário de contato.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">4. Compartilhamento</h3>
          <p className="mt-2">
            Os dados são processados pelos seguintes fornecedores, contratados
            para operar o site: Cloudflare (hospedagem do site e verificação
            anti-spam do formulário), Supabase (banco de dados) e Resend
            (envio do e-mail de aviso de novo contato para a clínica). Nenhum
            dado é vendido ou compartilhado para fins de marketing de
            terceiros.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">5. Retenção e exclusão</h3>
          <p className="mt-2">
            Mensagens recebidas pelo formulário de contato que não avançam
            para atendimento são mantidas por até 12 meses, após os quais são
            excluídas ou anonimizadas.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">6. Direitos do titular</h3>
          <p className="mt-2">
            Qualquer pessoa pode solicitar acesso, correção, portabilidade,
            exclusão ou anonimização dos próprios dados a qualquer momento,
            pelo e-mail{" "}
            <a href="mailto:augustoneonvazryba@gmail.com" className="underline">
              augustoneonvazryba@gmail.com
            </a>{" "}
            — canal provisório enquanto um e-mail dedicado não é criado (ver
            issue de acompanhamento no repositório).
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">7. Segurança</h3>
          <p className="mt-2">
            O site é servido inteiramente por HTTPS. O acesso ao painel
            administrativo, onde os dados de contato ficam visíveis, é
            restrito por login (Supabase Auth) com autenticação de dois
            fatores (TOTP) disponível e encerramento automático de sessão por
            inatividade. Backups do banco de dados são geridos pela
            infraestrutura do Supabase.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">8. Cookies</h3>
          <p className="mt-2">
            O site usa cookies apenas para manter a sessão de login do painel
            administrativo e controlar o tempo de inatividade dessa sessão —
            não são cookies de rastreamento nem de publicidade, e não afetam
            quem visita o site público. Hoje não há cookies de analytics.
          </p>
        </div>

        <p className="text-sm opacity-70">Última atualização: 12 de agosto de 2026.</p>
      </div>
    </Section>
  );
}

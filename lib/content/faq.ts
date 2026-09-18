/**
 * Perguntas frequentes GENERICAS de consultorio odontologico — conhecimento
 * padrao da area, dentro da excecao de 2026-08-05 das "Regras de conteudo"
 * (AGENTS.md): nada especifico desta clinica, nenhum preco, prazo,
 * estatistica ou promessa de resultado. Toda resposta termina apontando
 * para a avaliacao individual, porque e ela que decide de fato.
 *
 * A doutora pode trocar/adicionar perguntas depois; enquanto nao houver
 * tela no admin para isso, o conteudo mora aqui.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Com que frequência devo ir ao dentista?",
    answer:
      "A recomendação geral é uma consulta de rotina a cada seis meses, com exame clínico e limpeza profissional. Quem tem gengiva sensível, usa aparelho ou tem histórico de cárie pode precisar de um intervalo menor — isso é definido na avaliação.",
  },
  {
    question: "A primeira consulta já inclui algum procedimento?",
    answer:
      "A primeira consulta é uma avaliação: conversa sobre a queixa ou o objetivo, exame clínico e, quando necessário, pedido de exames de imagem. A partir daí é montado o plano de tratamento, explicado etapa por etapa antes de qualquer procedimento.",
  },
  {
    question: "Clareamento dental estraga os dentes?",
    answer:
      "Feito com acompanhamento profissional e com os dentes saudáveis, o clareamento não danifica o esmalte. Sensibilidade passageira pode acontecer e é controlada durante o tratamento. Cárie, restauração antiga ou gengiva inflamada precisam ser resolvidas antes — por isso a avaliação vem primeiro.",
  },
  {
    question: "Existe idade máxima para usar aparelho?",
    answer:
      "Não. Dentes podem ser movimentados em qualquer idade, desde que osso e gengiva estejam saudáveis. Em adultos, o planejamento costuma considerar restaurações, próteses e desgastes já existentes, e há opções mais discretas, como alinhadores transparentes.",
  },
  {
    question: "Tratamento de canal dói?",
    answer:
      "O procedimento é feito com anestesia local, e o objetivo dele é justamente eliminar a dor causada pela inflamação ou infecção da polpa. Algum desconforto nos dias seguintes é comum e costuma ser leve; a orientação pós-consulta cobre o que fazer nesse período.",
  },
  {
    question: "A partir de que idade levar a criança ao dentista?",
    answer:
      "A orientação é começar ainda no primeiro ano de vida, com o nascimento dos primeiros dentes. As consultas iniciais são curtas e servem para orientar a higiene, acompanhar o desenvolvimento e acostumar a criança ao consultório sem medo.",
  },
];

export const FAQS_PT = [
  {
    title: "Qual o prazo de instalacao?",
    content: "O prazo pode variar conforme a demanda, mas trabalhamos com agendamento e respeitamos seu tempo. Consulte-nos sobre as datas disponiveis.",
  },
  {
    title: "Qual a vantagem de utilizar a AccessNet?",
    content: "Somos uma empresa com 12 anos de experiencia e 200 profissionais especializados. Oferecemos internet fibra optica 100% real com download e upload simetricos, suporte 24h e a melhor tecnologia do mercado.",
  },
  {
    title: "Como funciona a fibra optica?",
    content: "A fibra optica utiliza um cabo com filamento de vidro muito fino. O sinal da internet trafega atraves da luz em altissima velocidade, garantindo muito mais estabilidade e velocidade que outras tecnologias.",
  },
  {
    title: "O WiFi ja vem incluso no plano?",
    content: "Sim! Todos os planos incluem roteador WiFi Premium (WiFi 5G nos planos Start e Ultra, WiFi 6 nos planos Streaming e Game) sem custo adicional.",
  },
  {
    title: "Posso gerenciar meu plano pelo celular?",
    content: "Sim! Temos aplicativo disponivel para Android e iOS. Voce pode emitir 2a via de boleto, alterar plano, abrir chamados e muito mais.",
  },
  {
    title: "Quais cidades a AccessNet atende?",
    content: "Atendemos 13 cidades no Maranhao: Pinheiro, Bequimao, Goiabal Alcantara, Peri Mirim, Palmeirandia, Sao Bento, Santa Helena, Turilandia, Gov. Nunes Freire, Maracacume, Central do Maranhao, Cururupu e Pres. Sarney.",
  },
  {
    title: "Como entro em contato com a AccessNet?",
    content: "Ligue ou envie mensagem para o nosso 0800 449 1021. Atendemos por telefone e WhatsApp. Horario: Seg-Sex 8h-18h, Sab 8h-12h e 14h-17h, Dom 9h-12h.",
  },
];

interface FAQSCollection {
  [key: `FAQS_${string}`]: {
    title: string;
    content: string;
  }[];
}

export const ALL_FAQS: FAQSCollection = {
  FAQS_PT,
};

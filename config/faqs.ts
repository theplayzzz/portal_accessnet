export const FAQS_PT = [
  {
    title: "Qual o prazo de instalação?",
    content: "O prazo pode variar conforme a demanda, mas trabalhamos com agendamento e respeitamos seu tempo. Consulte-nos sobre as datas disponíveis.",
  },
  {
    title: "Qual a vantagem de utilizar a AccessNet?",
    content: "Somos uma empresa com 12 anos de experiência e 200 profissionais especializados. Oferecemos internet fibra óptica 100% real com download e upload simétricos, suporte 24h e a melhor tecnologia do mercado.",
  },
  {
    title: "Como funciona a fibra óptica?",
    content: "A fibra óptica utiliza um cabo com filamento de vidro muito fino. O sinal da internet trafega através da luz em altíssima velocidade, garantindo muito mais estabilidade e velocidade que outras tecnologias.",
  },
  {
    title: "O WiFi já vem incluso no plano?",
    content: "Sim! Todos os planos incluem roteador WiFi Premium (WiFi 5G nos planos Start e Ultra, WiFi 6 nos planos Streaming e Game) sem custo adicional.",
  },
  {
    title: "Posso gerenciar meu plano pelo celular?",
    content: "Sim! Temos aplicativo disponível para Android e iOS. Você pode emitir 2a via de boleto, alterar plano, abrir chamados e muito mais.",
  },
  {
    title: "Quais cidades a AccessNet atende?",
    content: "Atendemos 13 cidades no Maranhão: Pinheiro, Bequimão, Goiabal Alcântara, Peri Mirim, Palmeirândia, São Bento, Santa Helena, Turilândia, Gov. Nunes Freire, Maracaçumé, Central do Maranhão, Cururupu e Pres. Sarney.",
  },
  {
    title: "Como entro em contato com a AccessNet?",
    content: "Ligue ou envie mensagem para o nosso 0800 449 1021. Atendemos por telefone e WhatsApp. Horário: Seg-Sex 8h-18h, Sáb 8h-12h e 14h-17h, Dom 9h-12h.",
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

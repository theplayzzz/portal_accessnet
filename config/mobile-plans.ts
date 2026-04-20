export type MobilePlan = {
  key: string;
  gb: string;
  title: string;
  price: string;
  priceSuffix: string;
  baseData: string;
  bonusData?: string;
  highlights: string[];
  href: string;
  mostPopular?: boolean;
};

export const MOBILE_PLANS_PT: MobilePlan[] = [
  {
    key: "m16",
    gb: "16",
    title: "Essencial",
    price: "R$ 39,90",
    priceSuffix: "/mês",
    baseData: "10GB de internet base",
    bonusData: "+5GB exclusivos YouTube + 1GB bônus (7 dias)",
    highlights: [
      "16GB totais de internet",
      "Chamadas e SMS ilimitados (código 15)",
      "WhatsApp, Waze e Moovit ilimitados",
      "Cobertura nacional 5G Vivo",
      "Chip grátis",
    ],
    href: "https://wa.me/5508004491021?text=Quero%20contratar%20o%20plano%20celular%2016GB",
  },
  {
    key: "m21",
    gb: "21",
    title: "Avançado",
    price: "R$ 54,90",
    priceSuffix: "/mês",
    baseData: "20GB de internet base",
    bonusData: "+1GB bônus (7 dias)",
    mostPopular: true,
    highlights: [
      "21GB totais de internet",
      "Chamadas e SMS ilimitados (código 15)",
      "WhatsApp, Waze e Moovit ilimitados",
      "Cobertura nacional 5G Vivo",
      "Chip grátis",
    ],
    href: "https://wa.me/5508004491021?text=Quero%20contratar%20o%20plano%20celular%2021GB",
  },
  {
    key: "m26",
    gb: "26",
    title: "Premium",
    price: "R$ 64,90",
    priceSuffix: "/mês",
    baseData: "25GB de internet base",
    bonusData: "+1GB bônus (7 dias)",
    highlights: [
      "26GB totais de internet",
      "Chamadas e SMS ilimitados (código 15)",
      "WhatsApp, Waze e Moovit ilimitados",
      "Cobertura nacional 5G Vivo",
      "Chip grátis",
    ],
    href: "https://wa.me/5508004491021?text=Quero%20contratar%20o%20plano%20celular%2026GB",
  },
];

export const MOBILE_FAQS_PT = [
  {
    title: "Quais apps são ilimitados no plano?",
    content:
      "WhatsApp, Waze e Moovit funcionam sem descontar da sua franquia de internet. Use à vontade para se comunicar, navegar e se locomover.",
  },
  {
    title: "Como funciona a cobertura 5G?",
    content:
      "Nossos planos móveis utilizam a rede Vivo, com cobertura nacional e tecnologia 5G disponível nas regiões atendidas. A velocidade 5G ocorre nas áreas cobertas pela rede Vivo.",
  },
  {
    title: "O chip tem custo?",
    content:
      "Não. O chip é gratuito. Basta contratar pelo WhatsApp e nossa equipe orienta a retirada ou envio.",
  },
  {
    title: "Já sou cliente da internet. Tenho benefício?",
    content:
      "Sim! Clientes AccessNet fibra recebem atendimento prioritário. Fale com um consultor pelo WhatsApp para combinar o plano móvel com sua internet.",
  },
];

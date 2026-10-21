import { WHATSAPP_URL } from "./contact";
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
    key: "m20",
    gb: "20",
    title: "Essencial",
    price: "R$ 39,90",
    priceSuffix: "/mês",
    baseData: "15GB de franquia",
    bonusData: "+5GB exclusivos para YouTube + 1GB de bônus (válido por 7 dias)",
    highlights: [
      "20GB de franquia principal",
      "Chamadas e SMS ilimitados (código 15)",
      "WhatsApp, Waze e Moovit ilimitados",
      "Cobertura nacional 5G Vivo",
      "Chip grátis",
    ],
    href: WHATSAPP_URL,
  },
  {
    key: "m30",
    gb: "30",
    title: "Avançado",
    price: "R$ 54,90",
    priceSuffix: "/mês",
    baseData: "30GB de franquia",
    mostPopular: true,
    highlights: [
      "30GB de franquia principal",
      "Chamadas e SMS ilimitados (código 15)",
      "WhatsApp, Waze e Moovit ilimitados",
      "Cobertura nacional 5G Vivo",
      "Chip grátis",
    ],
    href: WHATSAPP_URL,
  },
  {
    key: "m40",
    gb: "40",
    title: "Premium",
    price: "R$ 64,90",
    priceSuffix: "/mês",
    baseData: "40GB de franquia",
    highlights: [
      "40GB de franquia principal",
      "Chamadas e SMS ilimitados (código 15)",
      "WhatsApp, Waze e Moovit ilimitados",
      "Cobertura nacional 5G Vivo",
      "Chip grátis",
    ],
    href: WHATSAPP_URL,
  },
];

export type MobileComboPlan = {
  key: string;
  internetSpeed: string;
  internetUnit: string;
  gb: string;
  title: string;
  price: string;
  priceSuffix: string;
  baseData: string;
  bonusData: string[];
  mostPopular?: boolean;
};

export const MOBILE_COMBOS_PT: MobileComboPlan[] = [
  {
    key: "c20",
    internetSpeed: "600",
    internetUnit: "MEGA",
    gb: "20GB",
    title: "Combo Essencial",
    price: "R$ 149,90",
    priceSuffix: "/mês",
    baseData: "15GB de franquia",
    bonusData: [
      "+5GB exclusivos para YouTube",
      "+1GB de bônus (válido por 7 dias)",
      "Chamadas e SMS ilimitados (com o Código 15)",
    ],
  },
  {
    key: "c30",
    internetSpeed: "800",
    internetUnit: "MEGA",
    gb: "30GB",
    title: "Combo Avançado",
    price: "R$ 184,90",
    priceSuffix: "/mês",
    baseData: "30GB de franquia",
    mostPopular: true,
    bonusData: [
      "Chamadas e SMS ilimitados (com o Código 15)",
    ],
  },
  {
    key: "c40",
    internetSpeed: "1",
    internetUnit: "GIGA",
    gb: "40GB",
    title: "Combo Premium",
    price: "R$ 264,90",
    priceSuffix: "/mês",
    baseData: "40GB de franquia",
    bonusData: [
      "Chamadas e SMS ilimitados (com o Código 15)",
    ],
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

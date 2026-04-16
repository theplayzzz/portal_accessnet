import { IconType } from "react-icons";
import { FaWifi, FaClock, FaShieldAlt, FaRocket, FaMobileAlt, FaHeadset } from "react-icons/fa";

export const FEATURES_PT = [
  {
    title: "Fibra Óptica Real",
    content: "Conexão 100% fibra até a sua casa. Download e upload na mesma velocidade, sem gargalos.",
    icon: FaRocket,
  },
  {
    title: "WiFi Premium Incluso",
    content: "Roteador WiFi 5G ou WiFi 6 incluso em todos os planos. Sinal forte em toda a casa.",
    icon: FaWifi,
  },
  {
    title: "Suporte 24 Horas",
    content: "Equipe técnica disponível 24h por dia, 7 dias por semana. Você nunca fica sem assistência.",
    icon: FaHeadset,
  },
  {
    title: "Instalação Rápida",
    content: "Agendamento flexível. Nossa equipe instala no melhor horário para você.",
    icon: FaClock,
  },
  {
    title: "App para Celular",
    content: "Gerencie seu plano, emita 2a via de boleto e resolva tudo pelo aplicativo.",
    icon: FaMobileAlt,
  },
  {
    title: "Estabilidade Garantida",
    content: "12 anos de experiência garantindo conexão estável sem quedas. +10.000 clientes confiam em nós.",
    icon: FaShieldAlt,
  },
];

interface FeaturesCollection {
  [key: `FEATURES_${string}`]: {
    title: string;
    content: string;
    icon: IconType;
  }[];
}

export const ALL_FEATURES: FeaturesCollection = {
  FEATURES_PT,
};

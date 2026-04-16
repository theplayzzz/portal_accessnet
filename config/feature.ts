import { IconType } from "react-icons";
import { FaWifi, FaClock, FaShieldAlt, FaRocket, FaMobileAlt, FaHeadset } from "react-icons/fa";

export const FEATURES_PT = [
  {
    title: "Fibra Optica Real",
    content: "Conexao 100% fibra ate a sua casa. Download e upload na mesma velocidade, sem gargalos.",
    icon: FaRocket,
  },
  {
    title: "WiFi Premium Incluso",
    content: "Roteador WiFi 5G ou WiFi 6 incluso em todos os planos. Sinal forte em toda a casa.",
    icon: FaWifi,
  },
  {
    title: "Suporte 24 Horas",
    content: "Equipe tecnica disponivel 24h por dia, 7 dias por semana. Voce nunca fica sem assistencia.",
    icon: FaHeadset,
  },
  {
    title: "Instalacao Rapida",
    content: "Agendamento flexivel. Nossa equipe instala no melhor horario para voce.",
    icon: FaClock,
  },
  {
    title: "App para Celular",
    content: "Gerencie seu plano, emita 2a via de boleto e resolva tudo pelo aplicativo.",
    icon: FaMobileAlt,
  },
  {
    title: "Estabilidade Garantida",
    content: "12 anos de experiencia garantindo conexao estavel sem quedas. +10.000 clientes confiam em nos.",
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

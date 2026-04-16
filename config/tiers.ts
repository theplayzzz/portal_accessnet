import { Tier, TiersEnum } from "@/types/pricing";

export const TIERS_PT: Array<Tier> = [
  {
    key: TiersEnum.Free,
    title: "START",
    price: "R$ 109,90",
    priceSuffix: "/mês",
    href: "https://wa.me/5508004491021?text=Quero%20contratar%20o%20plano%20START%20400Mbps",
    description: "Até 400 Mbps de download e upload",
    features: ["400 Mbps simétricos", "WiFi 5G Premium incluso", "Suporte 24h por dia", "Instalação rápida"],
    buttonText: "Contratar pelo WhatsApp",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Pro,
    title: "ULTRA",
    price: "R$ 129,90",
    priceSuffix: "/mês",
    href: "https://wa.me/5508004491021?text=Quero%20contratar%20o%20plano%20ULTRA%20600Mbps",
    description: "Até 600 Mbps de download e upload",
    features: ["600 Mbps simétricos", "WiFi 5G Premium incluso", "Suporte 24h por dia", "Instalação rápida"],
    buttonText: "Contratar pelo WhatsApp",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Team,
    title: "STREAMING",
    price: "R$ 169,90",
    priceSuffix: "/mês",
    href: "https://wa.me/5508004491021?text=Quero%20contratar%20o%20plano%20STREAMING%20700Mbps",
    description: "Até 700 Mbps de download e upload",
    mostPopular: true,
    features: ["700 Mbps simétricos", "WiFi 6 Premium incluso", "Suporte 24h por dia", "Ideal para streaming 4K"],
    buttonText: "Contratar pelo WhatsApp",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Customize,
    title: "GAME",
    price: "R$ 199,90",
    priceSuffix: "/mês",
    href: "https://wa.me/5508004491021?text=Quero%20contratar%20o%20plano%20GAME%20800Mbps",
    description: "Até 800 Mbps de download e upload",
    features: ["800 Mbps simétricos", "WiFi 6 Premium incluso", "Suporte 24h por dia", "Latência ultra-baixa para games"],
    buttonText: "Contratar pelo WhatsApp",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
];

interface TiersCollection {
  [key: `TIERS_${string}`]: Array<Tier>;
}

export const ALL_TIERS: TiersCollection = {
  TIERS_PT,
};

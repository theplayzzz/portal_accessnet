import { SiteConfig } from "@/types/siteConfig";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

const baseSiteConfig = {
  name: "AccessNet - Internet Fibra Óptica",
  description: "Internet fibra óptica de verdade no Maranhão. Planos a partir de R$ 109,90/mês. 13 cidades atendidas. WiFi Premium incluso. Suporte 24h.",
  url: "https://accessnet.com.br",
  ogImage: "https://accessnet.com.br/og.png",
  metadataBase: new URL("https://accessnet.com.br"),
  keywords: ["internet fibra óptica", "internet maranhão", "accessnet", "fibra óptica pinheiro", "internet rápida", "provedor internet maranhão", "wifi premium"],
  authors: [{ name: "AccessNet Telecomunicações", url: "https://accessnet.com.br" }],
  creator: "AccessNet",
  whatsappNumber: "5508004491021",
  phone: "0800 449 1021",
  themeColors: [{ media: "(prefers-color-scheme: light)", color: "#1E3A5F" }],
  nextThemeColor: "light",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  headerLinks: [
    { name: "instagram", href: "https://instagram.com/accessnet", icon: FaInstagram },
    { name: "facebook", href: "https://facebook.com/accessnettelecom", icon: FaFacebook },
    { name: "whatsapp", href: "https://wa.me/5508004491021", icon: FaWhatsapp },
  ],
  footerLinks: [
    { name: "instagram", href: "https://instagram.com/accessnet", icon: FaInstagram },
    { name: "facebook", href: "https://facebook.com/accessnettelecom", icon: FaFacebook },
    { name: "youtube", href: "https://youtube.com/@accessnetpho", icon: FaYoutube },
    { name: "whatsapp", href: "https://wa.me/5508004491021", icon: FaWhatsapp },
  ],
  footerProducts: [
    { url: "https://ixc.accessnet.com.br", name: "Central do Assinante" },
    { url: "https://ixc.accessnet.com.br", name: "2a Via de Boleto" },
    { url: "https://velocidade.accessnet.com.br", name: "Teste de Velocidade" },
    { url: "https://play.google.com/store/apps/details?id=br.com.accessnet.appclientes", name: "App Android" },
    { url: "https://apps.apple.com/br/app/accessnet/id6503640632", name: "App iOS" },
  ],
};

export const siteConfig: SiteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    images: [`${baseSiteConfig.url}/og.png`],
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    site: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/og.png`],
    creator: baseSiteConfig.creator,
  },
};

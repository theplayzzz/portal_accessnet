import MobileHero from "@/components/mobile/MobileHero";
import MobilePricing from "@/components/mobile/MobilePricing";
import MobileBenefits from "@/components/mobile/MobileBenefits";
import MobileFAQ from "@/components/mobile/MobileFAQ";
import MobileCTA from "@/components/mobile/MobileCTA";

export const metadata = {
  title: "Planos de Celular - Rede Móvel AccessNet",
  description:
    "Planos de celular AccessNet com alta franquia, WhatsApp, Waze e Moovit ilimitados, chamadas sem limite e cobertura nacional 5G na rede Vivo. Chip grátis.",
};

export default function RedeMovelPage() {
  return (
    <>
      <MobileHero />
      <MobilePricing />
      <MobileBenefits />
      <MobileFAQ />
      <MobileCTA />
    </>
  );
}

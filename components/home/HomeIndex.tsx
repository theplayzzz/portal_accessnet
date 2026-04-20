import CTA from "@/components/home/CTA";
import Coverage from "@/components/home/Coverage";
import FAQ from "@/components/home/FAQ";
import Feature from "@/components/home/Feature";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import SocialProof from "@/components/home/SocialProof";
import StoreCarousel from "@/components/home/StoreCarousel";
import AppShowcase from "@/components/home/AppShowcase";
import MobilePromo from "@/components/home/MobilePromo";
import Testimonials from "@/components/home/Testimonials";
import { getDictionary } from "@/lib/i18n";

export default async function HomeIndex({ lang }: { lang: string }) {
  const dict = await getDictionary("pt");

  return (
    <>
      {/* Hero Section */}
      <Hero locale={dict.Hero} CTALocale={dict.CTAButton} />
      <SocialProof locale={dict.SocialProof} />

      {/* Pricing FIRST (high intent traffic from ads) */}
      <Pricing id="Planos" locale={dict.Pricing} />

      {/* Benefits */}
      <Feature id="Beneficios" locale={dict.Feature} />

      {/* Coverage */}
      <Coverage id="Cobertura" locale={dict.Coverage} />

      {/* Our Stores */}
      <StoreCarousel locale={dict.Stores} />

      {/* App Showcase */}
      <AppShowcase locale={dict.AppShowcase} />

      {/* Social Proof */}
      <Testimonials id="Depoimentos" locale={dict.Testimonials} />

      {/* FAQ */}
      <FAQ id="Duvidas" locale={dict.FAQ} />

      {/* Mobile plans cross-promo */}
      <MobilePromo />

      {/* Final CTA */}
      <CTA locale={dict.CTA} />
    </>
  );
}

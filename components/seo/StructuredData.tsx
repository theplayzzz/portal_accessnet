import { siteConfig } from "@/config/site";
import { COVERAGE_CITIES } from "@/config/coverage";
import { STORES } from "@/config/stores";
import { TIERS_PT } from "@/config/tiers";

function priceToNumber(label: string): number | undefined {
  // "R$ 109,90" → 109.90
  const m = label.match(/[\d.,]+/);
  if (!m) return undefined;
  const cleaned = m[0].replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * JSON-LD para o Google entender que somos um provedor de internet (ISP)
 * com presença local em Maranhão, lojas físicas e ofertas (planos).
 *
 * Schemas combinados:
 *   - Organization (entidade)
 *   - LocalBusiness (lojas físicas)
 *   - WebSite (com SearchAction p/ sitelinks-search-box)
 *   - Service / OfferCatalog (planos de internet)
 */
export function StructuredData() {
  const baseUrl = siteConfig.url;

  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "TelecommunicationsCarrier"],
    "@id": `${baseUrl}/#organization`,
    name: siteConfig.creator,
    legalName: "AccessNet Telecomunicações",
    alternateName: siteConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/apple-touch-icon.png`,
    image: siteConfig.ogImage,
    description: siteConfig.description,
    telephone: `+55${siteConfig.whatsappNumber.replace(/\D/g, "")}`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressRegion: "MA",
      addressLocality: "Pinheiro",
    },
    areaServed: COVERAGE_CITIES.map((city) => ({
      "@type": "City",
      name: city.name,
      containedInPlace: {
        "@type": "State",
        name: "Maranhão",
        addressCountry: "BR",
      },
    })),
    sameAs: siteConfig.footerLinks
      .filter((l) => /^https?:/i.test(l.href))
      .map((l) => l.href),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "customer service",
        availableLanguage: ["Portuguese", "pt-BR"],
        areaServed: "BR",
      },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "pt-BR",
    publisher: { "@id": `${baseUrl}/#organization` },
  };

  const stores = STORES.map((s, i) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#store-${i}`,
    name: `AccessNet — ${s.name}`,
    parentOrganization: { "@id": `${baseUrl}/#organization` },
    image: s.image.startsWith("http") ? s.image : `${baseUrl}${s.image}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address,
      addressRegion: "MA",
      addressCountry: "BR",
    },
    telephone: siteConfig.phone,
  }));

  const offerCatalog = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/#service-fibra`,
    name: "Internet Fibra Óptica AccessNet",
    serviceType: "Internet Service Provider",
    provider: { "@id": `${baseUrl}/#organization` },
    areaServed: COVERAGE_CITIES.map((c) => c.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Planos de Internet Fibra",
      itemListElement: TIERS_PT.map((tier, i) => {
        const price = priceToNumber(tier.price);
        return {
          "@type": "Offer",
          position: i + 1,
          name: `Plano ${tier.title}`,
          description: tier.description,
          ...(price !== undefined
            ? {
                price,
                priceCurrency: "BRL",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price,
                  priceCurrency: "BRL",
                  billingIncrement: 1,
                  unitCode: "MON",
                },
              }
            : {}),
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/#Planos`,
        };
      }),
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, offerCatalog, ...stores],
  };

  return (
    <script
      type="application/ld+json"
      // Conteúdo gerado a partir de configs internas — JSON estável, sem input do usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

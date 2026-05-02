"use client";

import Script from "next/script";
import * as gtag from "../gtag.js";

/**
 * Carrega o gtag.js uma única vez (Google Ads + Google Analytics).
 * - Ads (AW-11076623196): sempre, indispensável p/ rastrear conversões de mídia paga.
 * - GA4: somente se NEXT_PUBLIC_GOOGLE_ID estiver definido.
 *
 * O componente só é montado fora de development (ver app/layout.tsx).
 */
const GoogleAnalytics = () => {
  // allow_enhanced_conversions: true habilita a opção via gtag (Enhanced
  // Conversions for Leads). Ainda é preciso aceitar os termos de Customer
  // Data no painel do Google Ads pra começar a atribuir.
  // https://support.google.com/google-ads/answer/13258081
  const initScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gtag.GA_ADS_ID}', { allow_enhanced_conversions: true });
    ${
      gtag.GA_TRACKING_ID
        ? `gtag('config', '${gtag.GA_TRACKING_ID}', { page_path: window.location.pathname });`
        : ""
    }
  `;

  return (
    <>
      <Script
        id="gtag-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_ADS_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initScript }}
      />
    </>
  );
};

export default GoogleAnalytics;

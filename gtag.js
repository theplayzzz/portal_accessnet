// Google Analytics 4 (opcional, controlado por env)
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ID || null;

// Google Ads — ID da conta e labels das conversões configuradas no painel
// (hardcoded porque é a conta oficial deste site)
export const GA_ADS_ID = "AW-11076623196";
// "Formulário de cadastro" — dispara no submit confirmado pelo backend
export const GA_ADS_LEAD_CONVERSION_SEND_TO =
  "AW-11076623196/cQHkCILwxKQcENy236Ep";
// "Visualização de página" — dispara no carregamento do site e no clique
// que abre o modal de formulário (CTA). Tem value=1.0 BRL configurado
// no painel; mantemos o mesmo aqui pra não conflitar com a conversão.
export const GA_ADS_PAGEVIEW_CONVERSION_SEND_TO =
  "AW-11076623196/omGICOfbw6ccENy236Ep";

export const pageview = (url) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, { page_path: url });
  }
};

export const event = ({ action, category, label, value }) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Dispara o evento de conversão "Visualização de página" no Google Ads.
// Usado em DOIS lugares:
//   1. Carregamento da página (na init do gtag — ver GoogleAnalytics.tsx).
//   2. Clique em qualquer CTA que abre o modal de cadastro
//      (ver LeadModalProvider.openLeadModal).
// Aceita callback opcional pra encadear redirects no padrão recomendado
// pelo Google Ads (event snippet com event_callback).
export const reportPageviewConversion = (callback) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    if (typeof callback === "function") callback();
    return;
  }
  window.gtag("event", "conversion", {
    send_to: GA_ADS_PAGEVIEW_CONVERSION_SEND_TO,
    value: 1.0,
    currency: "BRL",
    event_callback: typeof callback === "function" ? callback : undefined,
  });
};

// Dispara o evento de conversão "Formulário de cadastro" no Google Ads.
// Aceita callback opcional (ex.: redirect após confirmação do envio do beacon).
export const reportLeadConversion = (callback) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    if (typeof callback === "function") callback();
    return;
  }
  window.gtag("event", "conversion", {
    send_to: GA_ADS_LEAD_CONVERSION_SEND_TO,
    event_callback: typeof callback === "function" ? callback : undefined,
  });
};

/**
 * Enhanced Conversions for Leads: passa email/phone do usuário pro gtag.js
 * hashear localmente (SHA-256, normalizado) e enviar junto com a próxima
 * conversão. O Google casa esses hashes com contas Google logadas que
 * clicaram no anúncio — atribui conversão mesmo sem gclid (cross-device,
 * cookie expirado por ITP, lead orgânico que tinha clicado antes).
 *
 * Requer: ativar "Enhanced conversions for leads" + aceitar termos de
 * Customer Data no painel do Google Ads (Tools → Conversions).
 *
 * Docs: https://support.google.com/google-ads/answer/11021502
 *
 * @param {{email?: string, phone_number?: string, address?: {first_name?: string, last_name?: string, street?: string, city?: string, region?: string, postal_code?: string, country?: string}}} userData
 */
export const setEnhancedConversionUserData = (userData) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!userData) return;
  // Filtra valores vazios — gtag rejeita strings vazias.
  const clean = {};
  if (userData.email) clean.email = userData.email;
  if (userData.phone_number) clean.phone_number = userData.phone_number;
  if (userData.address) {
    const addr = {};
    for (const [k, v] of Object.entries(userData.address)) {
      if (v) addr[k] = v;
    }
    if (Object.keys(addr).length > 0) clean.address = addr;
  }
  if (Object.keys(clean).length === 0) return;
  window.gtag("set", "user_data", clean);
};

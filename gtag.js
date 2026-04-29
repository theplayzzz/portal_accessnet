// Google Analytics 4 (opcional, controlado por env)
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ID || null;

// Google Ads — ID da conta e label da conversão "Formulário de cadastro"
// (hardcoded porque é a conta oficial deste site)
export const GA_ADS_ID = "AW-11076623196";
export const GA_ADS_LEAD_CONVERSION_SEND_TO =
  "AW-11076623196/cQHkCILwxKQcENy236Ep";

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

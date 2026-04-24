"use client";
import { FaWhatsapp } from "react-icons/fa";
import { WhatsAppCTA } from "@/components/lead/WhatsAppCTA";

const CTAButton = ({ locale }: { locale: any }) => {
  return (
    <WhatsAppCTA
      source="cta-button-generic"
      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5B] text-white font-bold text-base px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg"
    >
      <FaWhatsapp size={18} />
      {locale.title}
    </WhatsAppCTA>
  );
};

export default CTAButton;

"use client";
import { FaWhatsapp } from "react-icons/fa";
import { WhatsAppCTA } from "@/components/lead/WhatsAppCTA";

const WhatsAppFloating = () => {
  return (
    <WhatsAppCTA
      source="floating"
      aria-label="Fale conosco no WhatsApp"
      data-testid="whatsapp-floating"
      className="fixed bottom-4 right-4 z-50 bg-[#25D366] hover:bg-[#20BD5B] text-white rounded-full p-3 sm:bottom-6 sm:right-6 sm:p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
    >
      <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7" />
    </WhatsAppCTA>
  );
};

export default WhatsAppFloating;

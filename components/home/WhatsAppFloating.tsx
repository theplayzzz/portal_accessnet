"use client";
import { FaWhatsapp } from "react-icons/fa";
import { WhatsAppCTA } from "@/components/lead/WhatsAppCTA";

const WhatsAppFloating = () => {
  return (
    <WhatsAppCTA
      source="floating"
      aria-label="Fale conosco no WhatsApp"
      data-testid="whatsapp-floating"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5B] text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
    >
      <FaWhatsapp size={28} />
    </WhatsAppCTA>
  );
};

export default WhatsAppFloating;

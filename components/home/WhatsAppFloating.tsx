"use client";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloating = () => {
  return (
    <a
      href="https://wa.me/5508004491021?text=Ola!%20Quero%20saber%20mais%20sobre%20os%20planos%20AccessNet"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5B] text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default WhatsAppFloating;

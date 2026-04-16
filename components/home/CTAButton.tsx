import { FaWhatsapp } from "react-icons/fa";

const CTAButton = ({ locale }: { locale: any }) => {
  return (
    <a
      href="https://wa.me/5508004491021?text=Quero%20contratar%20internet%20fibra%20AccessNet"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5B] text-white font-bold text-base px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg"
    >
      <FaWhatsapp size={18} />
      {locale.title}
    </a>
  );
};

export default CTAButton;

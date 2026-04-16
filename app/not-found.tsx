import { siteConfig } from "@/config/site";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-extrabold text-[#1E3A5F] mb-4 font-[family-name:var(--font-heading)]">
        404
      </h1>
      <p className="text-xl text-gray-500 mb-8">
        Pagina nao encontrada
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#1E3A5F] text-white font-semibold rounded-full hover:bg-[#162d4a] transition-colors"
        >
          Voltar ao Inicio
        </Link>
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-full hover:bg-[#20BD5B] transition-colors"
        >
          <FaWhatsapp size={18} />
          Fale Conosco
        </a>
      </div>
    </div>
  );
}

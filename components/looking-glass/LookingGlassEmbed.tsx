import { ExternalLink, Network } from "lucide-react";

import { lookingGlassEmbedUrl } from "@/config/looking-glass.mjs";

/**
 * Embute o Looking Glass servido pela nossa própria origem (proxy reverso em
 * next.config.mjs). Como o iframe e a página compartilham a origem, o
 * `frame-ancestors 'self'` do fornecedor é satisfeito em qualquer ambiente.
 */
const LookingGlassEmbed = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1E3A5F]">
          <Network size={16} className="text-[#FFA500]" />
          Consulta em tempo real
        </div>
        <a
          href={lookingGlassEmbedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-[#1E3A5F] sm:text-sm"
        >
          <span className="hidden sm:inline">Abrir em&nbsp;</span>nova aba
          <ExternalLink size={14} />
        </a>
      </div>

      <iframe
        src={lookingGlassEmbedUrl}
        title="Looking Glass AccessNet"
        allow="clipboard-write"
        className="block h-[75vh] min-h-[560px] w-full border-0 md:h-[720px]"
      />
    </div>
  );
};

export default LookingGlassEmbed;

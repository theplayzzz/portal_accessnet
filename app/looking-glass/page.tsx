import { Activity, Globe2, Route } from "lucide-react";

import LookingGlassEmbed from "@/components/looking-glass/LookingGlassEmbed";

export const metadata = {
  title: "Looking Glass - Diagnóstico de Rede AccessNet",
  description:
    "Ferramenta pública de diagnóstico da rede AccessNet: ping, traceroute e consulta de prefixos BGP executados a partir dos nossos roteadores, em IPv4 e IPv6.",
  // Página utilitária, servida via proxy do Looking Glass — sem valor de busca
  // e com noindex na origem do fornecedor.
  robots: { index: false, follow: true },
};

const resources = [
  {
    icon: Activity,
    title: "Ping",
    description:
      "Meça a latência até qualquer IP ou domínio a partir da borda da nossa rede.",
  },
  {
    icon: Route,
    title: "Traceroute",
    description:
      "Veja salto a salto o caminho que o tráfego percorre saindo da AccessNet.",
  },
  {
    icon: Globe2,
    title: "Prefixos BGP",
    description:
      "Consulte como os prefixos são vistos por este roteador ou pelos coletores globais.",
  },
];

export default function LookingGlassPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#1E3A5F] via-[#162d4a] to-[#0B1828]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFA500]/30 bg-[#FFA500]/20 px-4 py-2 text-xs font-semibold text-[#FFD700] sm:text-sm">
            Ferramenta de rede
          </div>

          <h1 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Looking <span className="text-[#FFA500]">Glass</span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            Teste a conectividade a partir de dentro da rede AccessNet. Escolha o
            roteador de origem e rode ping, traceroute ou consulta de prefixo BGP
            em IPv4 e IPv6 — sem instalar nada.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LookingGlassEmbed />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <resource.icon className="mb-3 text-[#FFA500]" size={24} />
                <h2 className="mb-2 font-[family-name:var(--font-heading)] text-lg font-bold text-[#1E3A5F]">
                  {resource.title}
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  {resource.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            As consultas são executadas nos roteadores da AccessNet e refletem o
            estado da rede no momento do teste.
          </p>
        </div>
      </section>
    </>
  );
}

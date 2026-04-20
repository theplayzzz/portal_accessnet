"use client";
import { motion } from "framer-motion";
import { FaCheck, FaWhatsapp } from "react-icons/fa";
import ShinyButton from "@/components/ui/ShinyBadge";
import { MOBILE_PLANS_PT, MobilePlan } from "@/config/mobile-plans";

const MobileCard = ({ plan, index }: { plan: MobilePlan; index: number }) => {
  const isPopular = plan.mostPopular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isPopular
          ? "ring-2 ring-[#FFA500] shadow-xl scale-[1.02] bg-white"
          : "shadow-md bg-white"
      }`}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-[#FFA500] to-[#FFD700] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
            Mais escolhido
          </span>
        </div>
      )}

      {/* GB hero block */}
      <div className="relative bg-gradient-to-br from-[#1E3A5F] to-[#0B1828] px-6 pt-8 pb-6 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#FFA500_0%,_transparent_50%)]" />
        <div className="relative flex items-end gap-1">
          <span className="text-7xl font-extrabold leading-none font-[family-name:var(--font-heading)]">
            {plan.gb}
          </span>
          <span className="text-2xl font-bold text-[#FFA500] mb-1">GB</span>
        </div>
        <p className="relative text-white/80 text-sm mt-2">{plan.title}</p>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-5">
          <p className="text-sm text-gray-500">{plan.baseData}</p>
          {plan.bonusData && (
            <p className="text-xs text-[#25D366] font-semibold mt-1">
              {plan.bonusData}
            </p>
          )}
        </div>

        <div className="mb-6">
          <span className="text-4xl font-extrabold text-[#FFA500] font-[family-name:var(--font-heading)]">
            {plan.price}
          </span>
          <span className="text-gray-500 text-sm ml-1">{plan.priceSuffix}</span>
        </div>

        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.highlights.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <FaCheck
                className="text-[#25D366] mt-1 flex-shrink-0"
                size={12}
              />
              <span className="text-sm text-gray-600">{item}</span>
            </li>
          ))}
        </ul>

        <ShinyButton href={plan.href} className="w-full">
          <FaWhatsapp size={18} />
          Contratar pelo WhatsApp
        </ShinyButton>
      </div>
    </motion.div>
  );
};

const MobilePricing = () => {
  return (
    <section id="PlanosCelular" className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
            Planos de{" "}
            <span className="text-[#FFA500]">Celular</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Escolha o plano ideal para você. Todos com chamadas ilimitadas, apps
            essenciais e cobertura nacional 5G na rede Vivo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOBILE_PLANS_PT.map((plan, index) => (
            <MobileCard key={plan.key} plan={plan} index={index} />
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Cobertura nacional 5G na rede Vivo. Bônus de 1GB válido por 7 dias.
        </p>
      </div>
    </section>
  );
};

export default MobilePricing;

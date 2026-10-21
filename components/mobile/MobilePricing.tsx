"use client";
import { motion } from "framer-motion";
import { FaCheck, FaWhatsapp } from "react-icons/fa";
import { MOBILE_PLANS_PT, MobilePlan } from "@/config/mobile-plans";
import { WhatsAppCTA } from "@/components/lead/WhatsAppCTA";

const MobileCard = ({ plan, index }: { plan: MobilePlan; index: number }) => {
  const isPopular = plan.mostPopular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-brand-panel overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isPopular
          ? "ring-2 ring-[#F6C304] shadow-xl scale-[1.02] bg-white"
          : "shadow-md bg-white"
      }`}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-[#F6C304] text-[#080494] text-[11px] font-bold px-3 py-1 rounded-full shadow">
            Mais escolhido
          </span>
        </div>
      )}

      {/* GB hero block */}
      <div className="relative bg-gradient-to-br from-[#1510C8] to-[#080494] px-6 pt-8 pb-6 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#F6C304_0%,_transparent_50%)]" />
        <div className="relative flex items-end gap-1">
          <span className="text-7xl font-extrabold leading-none font-[family-name:var(--font-heading)]">
            {plan.gb}
          </span>
          <span className="text-2xl font-bold text-[#F6C304] mb-1">GB</span>
        </div>
        <p className="relative text-white/80 text-sm mt-2">{plan.title}</p>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-5">
          <p className="text-sm text-gray-500">{plan.baseData}</p>
          {plan.bonusData && (
            <p className="text-xs text-[#1510C8] font-semibold mt-1">
              {plan.bonusData}
            </p>
          )}
        </div>

        <div className="mb-6">
          <span className="text-4xl font-extrabold text-[#12131A] font-[family-name:var(--font-heading)]">
            {plan.price}
          </span>
          <span className="text-gray-500 text-sm ml-1">{plan.priceSuffix}</span>
        </div>

        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.highlights.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <FaCheck
                className="text-[#1510C8] mt-1 flex-shrink-0"
                size={12}
              />
              <span className="text-sm text-gray-600">{item}</span>
            </li>
          ))}
        </ul>

        <WhatsAppCTA
          variant="shiny"
          source={`pricing-mobile-${plan.key}`}
          data-testid={`pricing-mobile-${plan.key}`}
          className="w-full"
        >
          <FaWhatsapp size={18} />
          Contratar pelo WhatsApp
        </WhatsAppCTA>
      </div>
    </motion.div>
  );
};

const MobilePricing = () => {
  return (
    <section id="PlanosCelular" className="bg-brand-surface-soft py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#12131A] font-[family-name:var(--font-heading)]">
            Planos de{" "}
            <span>Celular</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-14 rounded-full bg-[#F6C304]" />
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
          Cobertura nacional 5G na rede Vivo. O bônus de 1GB válido por 7 dias
          se aplica ao plano de 20GB.
        </p>
      </div>
    </section>
  );
};

export default MobilePricing;

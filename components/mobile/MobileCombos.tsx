"use client";
import { motion } from "framer-motion";
import { FaCheck, FaWhatsapp, FaWifi } from "react-icons/fa";
import { BsPhoneVibrate } from "react-icons/bs";
import { HiPlus } from "react-icons/hi2";
import ShinyButton from "@/components/ui/ShinyBadge";
import { MOBILE_COMBOS_PT, MobileComboPlan } from "@/config/mobile-plans";
import { useLeadModal } from "@/components/lead/useLeadModal";

const ComboCard = ({
  plan,
  index,
}: {
  plan: MobileComboPlan;
  index: number;
}) => {
  const { openLeadModal } = useLeadModal();
  const isPopular = plan.mostPopular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isPopular
          ? "ring-2 ring-[#FFA500] shadow-2xl md:scale-[1.03]"
          : "shadow-xl"
      }`}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-[#FFA500] to-[#FFD700] text-[#1E3A5F] text-[11px] font-extrabold px-3 py-1 rounded-full shadow uppercase tracking-wide">
            Mais Vendido
          </span>
        </div>
      )}

      {/* Hero — Internet speed + GB */}
      <div className="relative bg-gradient-to-br from-[#1E3A5F] via-[#162d4a] to-[#0B1828] px-6 pt-10 pb-8 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#FFA500_0%,_transparent_55%)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,_#00BEDC_0%,_transparent_60%)]" />

        <div className="relative">
          {/* Combo badge */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full">
              <FaWifi className="text-[#FFA500]" size={11} />
              <span className="text-[10px] font-bold tracking-wider uppercase text-white/90">
                Fibra
              </span>
            </div>
            <HiPlus className="text-[#FFA500]" size={14} />
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full">
              <BsPhoneVibrate className="text-[#FFA500]" size={11} />
              <span className="text-[10px] font-bold tracking-wider uppercase text-white/90">
                Chip
              </span>
            </div>
          </div>

          {/* Speed */}
          <div className="flex items-end gap-1.5">
            <span className="text-6xl sm:text-7xl font-extrabold leading-none text-[#FFA500] font-[family-name:var(--font-heading)]">
              {plan.internetSpeed}
            </span>
            <span className="text-2xl font-extrabold text-[#FFA500] mb-1.5 tracking-wide">
              {plan.internetUnit}
            </span>
          </div>

          {/* GB */}
          <div className="mt-3 inline-flex items-baseline gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2">
            <span className="text-[#FFA500] text-2xl font-extrabold leading-none">
              +
            </span>
            <span className="text-white text-3xl font-extrabold leading-none font-[family-name:var(--font-heading)]">
              {plan.gb}
            </span>
            <span className="text-white/70 text-xs ml-1">no chip</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 bg-white">
        <div className="mb-4">
          <p className="text-sm font-semibold text-[#1E3A5F]">
            {plan.baseData}
          </p>
        </div>

        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.bonusData.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <FaCheck
                className="text-[#25D366] mt-1 flex-shrink-0"
                size={12}
              />
              <span className="text-sm text-gray-600">{item}</span>
            </li>
          ))}
          <li className="flex items-start gap-2">
            <FaCheck className="text-[#25D366] mt-1 flex-shrink-0" size={12} />
            <span className="text-sm text-gray-600">
              WhatsApp, Waze e Moovit ilimitados
            </span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheck className="text-[#25D366] mt-1 flex-shrink-0" size={12} />
            <span className="text-sm text-gray-600">
              WiFi Premium + Chip grátis
            </span>
          </li>
        </ul>

        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-gray-400">Por apenas</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-[#FFA500] font-[family-name:var(--font-heading)]">
              {plan.price}
            </span>
            <span className="text-gray-500 text-sm">{plan.priceSuffix}</span>
          </div>
        </div>

        <ShinyButton
          onClick={() =>
            openLeadModal({
              source: `combo-mobile-${plan.key}`,
              planContext: {
                planName: `${plan.title} — ${plan.internetSpeed} ${plan.internetUnit} + ${plan.gb}`,
                planGB: plan.gb,
                planPrice: plan.price,
              },
            })
          }
          data-testid={`combo-mobile-${plan.key}`}
          className="w-full"
        >
          <FaWhatsapp size={18} />
          Contratar combo
        </ShinyButton>
      </div>
    </motion.div>
  );
};

const MobileCombos = () => {
  return (
    <section
      id="CombosFibraChip"
      className="relative bg-gradient-to-b from-white via-slate-50 to-white py-20 md:py-24 overflow-hidden"
    >
      {/* decorative blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FFA500]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#1E3A5F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FFA500]/15 border border-[#FFA500]/30 text-[#1E3A5F] text-xs sm:text-sm font-bold px-4 py-2 rounded-full mb-5">
            <FaWifi size={12} />
            <HiPlus size={12} />
            <BsPhoneVibrate size={12} />
            Internet fixa + Chip móvel
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
            Combos <span className="text-[#FFA500]">Fibra + Chip</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Leve a internet de casa para a rua. Junte a sua fibra AccessNet com
            um chip cheio de GB, chamadas ilimitadas e apps essenciais — tudo
            em uma só fatura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {MOBILE_COMBOS_PT.map((plan, index) => (
            <ComboCard key={plan.key} plan={plan} index={index} />
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10 max-w-2xl mx-auto">
          Combos disponíveis para clientes da fibra AccessNet. Velocidades
          simétricas, instalação rápida e cobertura nacional 5G na rede Vivo.
        </p>
      </div>
    </section>
  );
};

export default MobileCombos;

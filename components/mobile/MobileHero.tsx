"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { HiSignal } from "react-icons/hi2";
import { BsPhoneVibrate } from "react-icons/bs";
import DotsShader from "@/components/ui/DotsShader";
import ShinyButton from "@/components/ui/ShinyBadge";
import { useLeadModal } from "@/components/lead/useLeadModal";

const MobileHero = () => {
  const { openLeadModal } = useLeadModal();
  return (
    <section className="relative bg-gradient-to-br from-[#1E3A5F] via-[#162d4a] to-[#0B1828] overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <DotsShader
          colors={[
            [50, 100, 180],
            [0, 120, 230],
            [0, 190, 220],
          ]}
          opacities={[0.4, 0.4, 0.5, 0.5, 0.6, 0.6, 0.7, 0.7, 0.8, 0.9]}
          totalSize={5}
          dotSize={2}
          maxFps={24}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 bg-[#FFA500]/20 border border-[#FFA500]/30 text-[#FFD700] text-xs sm:text-sm font-semibold px-4 py-2 rounded-full">
            <BsPhoneVibrate size={14} />
            Rede Móvel AccessNet
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-4 sm:mb-6 font-[family-name:var(--font-heading)]">
            Planos de celular{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#FFA500]">simples</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FFA500]/20 rounded-sm" />
            </span>{" "}
            e sem complicação
          </h1>

          <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Alta franquia de internet, apps essenciais ilimitados e cobertura
            nacional 5G na rede Vivo. Chip grátis e preços acessíveis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
            <ShinyButton
              onClick={() => openLeadModal({ source: "hero-mobile-plans" })}
              data-testid="hero-mobile-plans-cta"
              className="text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4"
            >
              <FaWhatsapp size={22} />
              Falar com consultor
            </ShinyButton>
            <Link
              href="#PlanosCelular"
              className="inline-flex items-center justify-center text-white border-2 border-white/30 hover:border-white/60 font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all hover:bg-white/10"
            >
              Ver planos
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              <HiSignal className="text-[#FFA500]" size={16} />
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                Cobertura nacional 5G
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              <span className="text-[#FFA500] text-base">✓</span>
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                Chip grátis
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              <span className="text-[#FFA500] text-base">∞</span>
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                Chamadas ilimitadas
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MobileHero;

"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import DotsShader from "@/components/ui/DotsShader";
import ShinyButton from "@/components/ui/ShinyBadge";
import { useLeadModal } from "@/components/lead/useLeadModal";

const MobileCTA = () => {
  const { openLeadModal } = useLeadModal();
  return (
    <section className="relative bg-gradient-to-br from-[#1E3A5F] to-[#0B1828] overflow-hidden">
      <div className="absolute inset-0 opacity-35">
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-48 sm:w-64 lg:w-80 flex-shrink-0"
          >
            <Image
              src="/api/blob-img/accessnet/mascot-flag.webp"
              alt="Mascote AccessNet"
              width={400}
              height={400}
              className="w-full h-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 font-[family-name:var(--font-heading)]">
              Pronto para contratar seu plano de celular?
            </h2>
            <p className="text-lg text-white/70 max-w-lg mb-8">
              Fale agora com um consultor pelo WhatsApp e garanta o chip grátis.
              Atendimento rápido e sem burocracia.
            </p>
            <ShinyButton
              onClick={() => openLeadModal({ source: "cta-mobile-plans" })}
              data-testid="cta-mobile-plans"
              className="text-lg px-10 py-4"
            >
              <FaWhatsapp size={24} />
              Falar com Consultor
            </ShinyButton>
            <p className="text-white/50 text-sm mt-4">
              0800 449 1021 - Ligação gratuita
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileCTA;

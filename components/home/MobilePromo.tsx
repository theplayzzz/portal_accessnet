"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BsPhoneVibrate } from "react-icons/bs";
import { HiArrowRight } from "react-icons/hi";

const MobilePromo = () => {
  return (
    <section className="bg-white py-14 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E3A5F] to-[#2a4d7a] p-8 sm:p-10 lg:p-12 shadow-xl"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#FFA500]/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-[#25D366]/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#FFA500]/20 flex items-center justify-center">
              <BsPhoneVibrate className="text-[#FFA500]" size={32} />
            </div>

            <div className="flex-1">
              <span className="inline-block text-[#FFD700] text-xs font-semibold uppercase tracking-wider mb-2">
                Novidade
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-[family-name:var(--font-heading)]">
                Conheça nossos planos de{" "}
                <span className="text-[#FFA500]">celular</span>
              </h3>
              <p className="text-white/70 text-base sm:text-lg max-w-xl">
                Alta franquia, apps ilimitados, chamadas sem limite e cobertura
                nacional 5G na rede Vivo. Chip grátis.
              </p>
            </div>

            <Link
              href="/rede-movel"
              className="group inline-flex items-center gap-2 bg-[#FFA500] hover:bg-[#ff9500] text-[#1E3A5F] font-bold text-sm sm:text-base px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg flex-shrink-0"
            >
              Ver planos móveis
              <HiArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MobilePromo;

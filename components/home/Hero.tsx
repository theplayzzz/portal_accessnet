"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { HiUsers, HiLocationMarker, HiPhone } from "react-icons/hi";

const Hero = ({
  locale,
  CTALocale,
}: {
  locale: any;
  langName?: string;
  CTALocale: any;
}) => {
  return (
    <section className="relative bg-gradient-to-br from-[#1E3A5F] via-[#162d4a] to-[#0B1828] overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Badge */}
            <span className="inline-block bg-[#FFA500]/20 text-[#FFD700] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              12 anos conectando o Maranhao
            </span>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 font-[family-name:var(--font-heading)]">
              {locale.title1}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#FFA500]">{locale.title2}</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FFA500]/20 rounded-sm" />
              </span>{" "}
              {locale.title3}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {locale.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <a
                href="https://wa.me/5508004491021?text=Quero%20contratar%20internet%20fibra%20AccessNet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5B] text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse-slow"
              >
                <FaWhatsapp size={22} />
                Assine Agora pelo WhatsApp
              </a>
              <Link
                href="#Planos"
                className="inline-flex items-center justify-center text-white border-2 border-white/30 hover:border-white/60 font-semibold text-lg px-8 py-4 rounded-full transition-all hover:bg-white/10"
              >
                Ver Planos
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <HiUsers className="text-[#FFA500]" size={18} />
                <span className="text-white/90 text-sm font-medium">+10.000 clientes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <HiLocationMarker className="text-[#FFA500]" size={18} />
                <span className="text-white/90 text-sm font-medium">13 cidades</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <HiPhone className="text-[#FFA500]" size={18} />
                <span className="text-white/90 text-sm font-medium">Suporte 24h</span>
              </div>
            </div>
          </motion.div>

          {/* Mascot Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0 w-64 sm:w-80 lg:w-96"
          >
            <Image
              src="/images/mascot-speed.webp"
              alt="Mascote AccessNet"
              width={500}
              height={500}
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

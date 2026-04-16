"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const CTA = ({ locale }: { locale: any; CTALocale?: any }) => {
  return (
    <section className="relative bg-gradient-to-br from-[#1E3A5F] to-[#0B1828] overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-48 sm:w-64 lg:w-80 flex-shrink-0"
          >
            <Image
              src="/images/mascot-flag.webp"
              alt="Mascote AccessNet"
              width={400}
              height={400}
              className="w-full h-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* Text + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 font-[family-name:var(--font-heading)]">
              {locale.title}
            </h2>
            <p className="text-lg text-white/70 max-w-lg mb-8">
              {locale.description}
            </p>
            <a
              href="https://wa.me/5508004491021?text=Quero%20contratar%20internet%20fibra%20AccessNet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5B] text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <FaWhatsapp size={24} />
              {locale.button}
            </a>
            <p className="text-white/50 text-sm mt-4">{locale.phone}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

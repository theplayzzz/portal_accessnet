"use client";
import { COVERAGE_CITIES } from "@/config/coverage";
import { motion } from "framer-motion";
import { HiLocationMarker } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { WhatsAppCTA } from "@/components/lead/WhatsAppCTA";

const Coverage = ({ id, locale }: { id: string; locale: any }) => {
  return (
    <section id={id} className="bg-brand-surface-soft py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#12131A] font-[family-name:var(--font-heading)]">
            {locale.title}{" "}
            <span>{locale.titleHighlight}</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-14 rounded-full bg-[#F6C304]" />
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {locale.description}
          </p>
        </div>

        {/* Cities Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {COVERAGE_CITIES.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                city.isHQ
                  ? "bg-gradient-to-r from-[#1510C8] to-[#1847E3] text-white shadow-md"
                  : "bg-white text-[#1510C8] border border-[#1510C8]/15 hover:border-[#1510C8] hover:shadow-md"
              }`}
            >
              <HiLocationMarker
                size={14}
                className={city.isHQ ? "text-[#F6C304]" : "text-[#1510C8]"}
              />
              {city.name}
              {city.isHQ && (
                <span className="text-[10px] bg-[#F6C304] text-[#080494] px-2 py-0.5 rounded-full ml-1">
                  SEDE
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Not found CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-500 mb-4">
            <WhatsAppCTA source="coverage-phone">{locale.notFound}</WhatsAppCTA>
          </p>
          <WhatsAppCTA
            source="coverage-check"
            className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#20BD5B] font-semibold transition-colors"
          >
            <FaWhatsapp size={18} />
            Consultar disponibilidade
          </WhatsAppCTA>
        </div>
      </div>
    </section>
  );
};

export default Coverage;

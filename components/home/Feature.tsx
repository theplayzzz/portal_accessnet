"use client";
import { FEATURES_PT } from "@/config/feature";
import React from "react";
import { motion } from "framer-motion";

const Feature = ({
  id,
  locale,
}: {
  id: string;
  locale: any;
  langName?: string;
}) => {
  return (
    <section id={id} className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#12131A] font-[family-name:var(--font-heading)]">
            {locale.title}{" "}
            <span>{locale.titleHighlight}</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-14 rounded-full bg-[#F6C304]" />
        </div>

        {/* Brand island: strong blue is concentrated in one deliberate surface. */}
        <div
          data-testid="benefits-panel"
          className="relative overflow-hidden rounded-brand-panel bg-gradient-to-br from-[#1510C8] via-[#0D0E7E] to-[#080494] p-4 shadow-2xl shadow-[#1510C8]/15 sm:p-6 lg:p-8"
        >
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#00BEDC]/20 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#F6C304]/15 blur-3xl" />
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES_PT.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                data-testid="benefit-card"
                className="group flex flex-col items-start rounded-brand-card border border-white/10 bg-white/[0.07] p-6 transition-all hover:-translate-y-0.5 hover:bg-white/[0.12]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-brand-control bg-[#F6C304] text-[#080494] shadow-lg shadow-black/10 transition-transform group-hover:scale-105">
                  {React.createElement(feature.icon, { size: 26 })}
                </div>
                <h3 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-white/70">
                  {feature.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;

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
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
            {locale.title}{" "}
            <span className="text-[#FFA500]">{locale.titleHighlight}</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_PT.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-start p-6 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#FFA500]/10 mb-5 group-hover:bg-[#FFA500]/20 transition-colors">
                {React.createElement(feature.icon, {
                  className: "text-[#FFA500]",
                  size: 26,
                })}
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-2 font-[family-name:var(--font-heading)]">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;

"use client";
import { TIERS_PT } from "@/config/tiers";
import { Tier } from "@/types/pricing";
import { FaCheck, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import ShinyButton from "@/components/ui/ShinyBadge";

const PricingCard = ({ tier, index }: { tier: Tier; index: number }) => {
  const isPopular = tier.mostPopular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isPopular
          ? "bg-white ring-2 ring-[#FFA500] shadow-lg scale-[1.02]"
          : "bg-white shadow-md"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-[#FFA500] to-[#FFD700] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
            Mais Popular
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-lg font-bold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
        {tier.title}
      </h3>

      {/* Speed */}
      <p className="text-sm text-gray-500 mt-1">{tier.description}</p>

      {/* Price */}
      <div className="mt-4 mb-6">
        <span className="text-4xl font-extrabold text-[#FFA500] font-[family-name:var(--font-heading)]">
          {tier.price}
        </span>
        <span className="text-gray-500 text-sm ml-1">{tier.priceSuffix}</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {tier.features?.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <FaCheck className="text-[#25D366] mt-0.5 flex-shrink-0" size={14} />
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <ShinyButton href={tier.href} className="w-full">
        <FaWhatsapp size={18} />
        {tier.buttonText}
      </ShinyButton>
    </motion.div>
  );
};

const Pricing = ({
  id,
  locale,
}: {
  id: string;
  locale: any;
  langName?: string;
}) => {
  return (
    <section id={id} className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
            {locale.title}{" "}
            <span className="text-[#FFA500]">{locale.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {locale.description}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {TIERS_PT.map((tier, index) => (
            <PricingCard key={tier.key} tier={tier} index={index} />
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-gray-400 mt-8">
          {locale.note}
        </p>
      </div>
    </section>
  );
};

export default Pricing;

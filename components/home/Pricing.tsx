"use client";
import { TIERS_PT } from "@/config/tiers";
import { Tier } from "@/types/pricing";
import { FaCheck, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import ShinyButton from "@/components/ui/ShinyBadge";
import { useLeadModal } from "@/components/lead/useLeadModal";

const PricingCard = ({ tier, index }: { tier: Tier; index: number }) => {
  const isPopular = tier.mostPopular;
  const { openLeadModal } = useLeadModal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-brand-panel border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isPopular
          ? "border-[#F6C304] bg-gradient-to-br from-[#1510C8] to-[#080494] ring-2 ring-[#F6C304] shadow-xl shadow-[#1510C8]/20 scale-[1.02]"
          : "border-[#1510C8]/10 bg-white shadow-md"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-[#F6C304] text-[#080494] text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
            Mais Popular
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3
        className={`text-lg font-bold font-[family-name:var(--font-heading)] ${
          isPopular ? "text-white" : "text-[#1510C8]"
        }`}
      >
        {tier.title}
      </h3>

      {/* Speed */}
      <p className={`mt-1 text-sm ${isPopular ? "text-white/70" : "text-gray-500"}`}>
        {tier.description}
      </p>

      {/* Price */}
      <div className="mt-4 mb-6">
        <span
          className={`text-4xl font-extrabold font-[family-name:var(--font-heading)] ${
            isPopular ? "text-white" : "text-[#12131A]"
          }`}
        >
          {tier.price}
        </span>
        <span className={`ml-1 text-sm ${isPopular ? "text-white/65" : "text-gray-500"}`}>
          {tier.priceSuffix}
        </span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {tier.features?.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <FaCheck
              className={`${isPopular ? "text-[#F6C304]" : "text-[#1510C8]"} mt-0.5 flex-shrink-0`}
              size={14}
            />
            <span className={`text-sm ${isPopular ? "text-white/80" : "text-gray-600"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <ShinyButton
        onClick={() =>
          openLeadModal({
            source: `pricing-fibra-${tier.key}`,
            planContext: {
              planName: tier.title,
              planSpeed: tier.description,
              planPrice: tier.price,
            },
          })
        }
        data-testid={`pricing-fibra-${tier.key}`}
        className="w-full"
      >
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

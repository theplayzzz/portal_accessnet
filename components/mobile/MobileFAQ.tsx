"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { MOBILE_FAQS_PT } from "@/config/mobile-plans";

const MobileFAQ = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
            Dúvidas <span className="text-[#FFA500]">Rápidas</span>
          </h2>
        </div>

        <Accordion
          selectionMode="multiple"
          className="gap-4"
          itemClasses={{
            base: "bg-slate-50 rounded-xl shadow-sm mb-3 px-6",
            title: "text-[#1E3A5F] font-semibold text-base",
            content: "text-gray-500 pb-4",
            trigger: "py-5",
            indicator: "text-[#FFA500]",
          }}
        >
          {MOBILE_FAQS_PT.map((faq, index) => (
            <AccordionItem
              key={index}
              aria-label={faq.title}
              title={faq.title}
              indicator={<FaPlus size={12} />}
            >
              {faq.content}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default MobileFAQ;

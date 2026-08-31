"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { MOBILE_FAQS_PT } from "@/config/mobile-plans";

const MobileFAQ = () => {
  return (
    <section className="bg-brand-surface-soft py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12131A] font-[family-name:var(--font-heading)]">
            Dúvidas <span>Rápidas</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-14 rounded-full bg-[#F6C304]" />
        </div>

        <Accordion
          selectionMode="multiple"
          className="gap-4"
          itemClasses={{
            base: "bg-white border border-[#1510C8]/10 rounded-xl shadow-sm mb-3 px-6",
            title: "text-[#1510C8] font-semibold text-base",
            content: "text-gray-500 pb-4",
            trigger: "py-5",
            indicator: "text-[#1510C8]",
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

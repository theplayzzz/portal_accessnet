"use client";
import { FAQS_PT } from "@/config/faqs";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";

const FAQ = ({
  id,
  locale,
}: {
  id: string;
  locale: any;
  langName?: string;
}) => {
  return (
    <section id={id} className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
            {locale.title}{" "}
            <span className="text-[#FFA500]">{locale.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {locale.description}
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion
          selectionMode="multiple"
          className="gap-4"
          itemClasses={{
            base: "bg-white rounded-xl shadow-sm mb-3 px-6",
            title: "text-[#1E3A5F] font-semibold text-base",
            content: "text-gray-500 pb-4",
            trigger: "py-5",
            indicator: "text-[#FFA500]",
          }}
        >
          {FAQS_PT.map((faq, index) => (
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

export default FAQ;

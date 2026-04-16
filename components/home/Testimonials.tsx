"use client";
import { TestimonialsData } from "@/config/testimonials";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const Testimonials = ({ id, locale }: { id: string; locale: any }) => {
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TestimonialsData.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all"
            >
              <FaQuoteLeft className="text-[#FFA500]/30 mb-4" size={24} />
              <p className="text-gray-600 leading-relaxed mb-6">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#1E3A5F] text-sm">
                    {testimonial.user.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {testimonial.user.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

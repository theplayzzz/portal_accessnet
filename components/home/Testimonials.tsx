"use client";
import { TestimonialsData } from "@/config/testimonials";
import { Marquee } from "@/components/ui/Marquee";
import { FaQuoteLeft } from "react-icons/fa";

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof TestimonialsData)[number];
}) => {
  return (
    <div className="w-[320px] sm:w-[360px] flex-shrink-0 rounded-brand-card border border-[#1510C8]/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <FaQuoteLeft className="text-[#1510C8]/25 mb-3" size={20} />
      <p className="text-gray-600 text-sm leading-relaxed mb-5">
        {testimonial.content}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#1510C8] flex items-center justify-center text-white font-bold text-xs">
          {testimonial.user.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-[#1510C8] text-sm">
            {testimonial.user.name}
          </p>
          <p className="text-gray-400 text-xs">{testimonial.user.role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = ({ id, locale }: { id: string; locale: any }) => {
  const firstRow = TestimonialsData.slice(0, 3);
  const secondRow = TestimonialsData.slice(3);

  return (
    <section id={id} className="bg-brand-surface-soft py-20 md:py-24 overflow-hidden">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#12131A] font-[family-name:var(--font-heading)]">
            {locale.title}{" "}
            <span>{locale.titleHighlight}</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-14 rounded-full bg-[#F6C304]" />
        </div>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-4">
        {/* Row 1 — scrolling left */}
        <Marquee direction="left" duration={35} pauseOnHover>
          {firstRow.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </Marquee>

        {/* Row 2 — scrolling right */}
        <Marquee direction="right" duration={35} pauseOnHover>
          {secondRow.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;

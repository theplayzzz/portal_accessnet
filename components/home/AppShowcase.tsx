"use client";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaGooglePlay, FaApple } from "react-icons/fa";

const APP_SCREENSHOTS = [
  { src: "/images/app/app-1.png", alt: "Tela principal do app AccessNet" },
  { src: "/images/app/app-2.png", alt: "Tela de login do app AccessNet" },
  { src: "/images/app/app-3.png", alt: "Endereço de instalação" },
  { src: "/images/app/app-4.png", alt: "Escolha o contrato" },
  { src: "/images/app/app-5.png", alt: "Minhas faturas" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const AppShowcase = ({ locale }: { locale: any }) => {
  const [[currentIndex, direction], setSlide] = useState([0, 0]);
  const touchStartX = useRef(0);

  const paginate = useCallback((newDirection: number) => {
    setSlide(([prev]) => {
      const next = prev + newDirection;
      if (next < 0) return [APP_SCREENSHOTS.length - 1, newDirection];
      if (next >= APP_SCREENSHOTS.length) return [0, newDirection];
      return [next, newDirection];
    });
  }, []);

  const goToSlide = useCallback((index: number) => {
    setSlide(([prev]) => [index, index > prev ? 1 : -1]);
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center lg:text-left"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
              {locale.title}{" "}
              <span className="text-[#FFA500]">{locale.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-lg mx-auto lg:mx-0">
              {locale.description}
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
              <a
                href="https://play.google.com/store/apps/details?id=br.com.accessnet.appclientes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#1E3A5F] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#162d4a] transition-colors"
              >
                <FaGooglePlay size={20} />
                Google Play
              </a>
              <a
                href="https://apps.apple.com/br/app/accessnet/id6503640632"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#1E3A5F] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#162d4a] transition-colors"
              >
                <FaApple size={22} />
                App Store
              </a>
            </div>
          </motion.div>

          {/* Phone Carousel Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Left arrow */}
              <button
                onClick={() => paginate(-1)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#1E3A5F] hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95"
                aria-label="Screenshot anterior"
              >
                <HiChevronLeft size={24} />
              </button>

              {/* Phone frame */}
              <div
                className="relative w-[200px] sm:w-[250px] lg:w-[280px]"
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const diff = touchStartX.current - e.changedTouches[0].clientX;
                  if (Math.abs(diff) > 50) paginate(diff > 0 ? 1 : -1);
                }}
              >
                <div className="bg-gray-900 rounded-[2rem] sm:rounded-[2.5rem] p-[5px] sm:p-[7px] shadow-2xl shadow-gray-900/30">
                  <div className="rounded-[1.75rem] sm:rounded-[2.2rem] overflow-hidden relative aspect-[886/1920] bg-white">
                    <AnimatePresence initial={false} custom={direction}>
                      <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          type: "tween",
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={APP_SCREENSHOTS[currentIndex].src}
                          alt={APP_SCREENSHOTS[currentIndex].alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 280px"
                          priority={currentIndex === 0}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Right arrow */}
              <button
                onClick={() => paginate(1)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#1E3A5F] hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95"
                aria-label="Próximo screenshot"
              >
                <HiChevronRight size={24} />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex gap-2.5 mt-6">
              {APP_SCREENSHOTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-8 h-2.5 bg-[#FFA500]"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir para screenshot ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;

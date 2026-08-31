"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Tv } from "lucide-react";
import Link from "next/link";

export default function AccessTVPromo() {
  return (
    <section id="AccessTV" className="bg-white py-14 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#080494] via-[#1510C8] to-[#1847E3] p-8 shadow-xl sm:p-10 lg:p-12"
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F6C304]/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-[#00BEDC]/20 blur-3xl" />

          <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F6C304] text-[#080494]">
              <Tv size={32} />
            </div>

            <div className="flex-1">
              <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#00BEDC]">
                <BadgeCheck size={15} />
                Plataforma regularizada
              </span>
              <h2 className="mb-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-white sm:text-3xl">
                Access TV: mais de 200 canais para sua casa
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Um benefício incluído na experiência da internet residencial
                AccessNet. Consulte disponibilidade e condições.
              </p>
            </div>

            <Link
              href="/access-tv"
              className="group inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#F6C304] px-6 py-3.5 font-bold text-[#080494] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#ffda35]"
            >
              Conhecer o Access TV
              <ArrowRight
                className="transition-transform group-hover:translate-x-1"
                size={18}
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

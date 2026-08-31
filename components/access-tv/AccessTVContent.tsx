"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clapperboard,
  MessageCircleMore,
  Sparkles,
  Tv,
  Wifi,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useLeadModal } from "@/components/lead/useLeadModal";

const categories = ["Filmes", "Esportes", "Notícias", "Infantil"];

const benefits = [
  {
    icon: Tv,
    title: "Mais de 200 canais",
    description:
      "Uma programação variada para acompanhar entretenimento, informação e muito mais.",
  },
  {
    icon: Wifi,
    title: "Benefício da internet residencial",
    description:
      "O Access TV faz parte da experiência de quem contrata a internet residencial AccessNet.",
  },
  {
    icon: BadgeCheck,
    title: "Plataforma regularizada",
    description:
      "Conteúdo oferecido em uma solução homologada para você assistir com tranquilidade.",
  },
];

const steps = [
  {
    icon: MessageCircleMore,
    title: "Fale com a AccessNet",
    description:
      "Conte para a nossa equipe que você quer conhecer o Access TV.",
  },
  {
    icon: BadgeCheck,
    title: "Confirme a disponibilidade",
    description:
      "Um consultor verifica as condições disponíveis para o seu plano e endereço.",
  },
  {
    icon: Clapperboard,
    title: "Receba as orientações",
    description:
      "Depois da confirmação, nossa equipe explica como acessar a plataforma.",
  },
];

export default function AccessTVContent() {
  const { openLeadModal } = useLeadModal();

  const openAccessTVLead = (source: string) =>
    openLeadModal({
      source,
      planContext: { planName: "Access TV" },
    });

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1510C8] via-[#0D0E7E] to-[#080494] text-white">
        <div className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-[#00BEDC]/20 blur-3xl" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#F6C304]/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.12)_1px,_transparent_0)] [background-size:22px_22px] opacity-30" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F6C304]/40 bg-[#F6C304]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F6C304] sm:text-sm">
              <Sparkles size={15} />
              Benefício residencial AccessNet
            </div>

            <h1 className="mb-5 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Sua internet também pode ser seu melhor entretenimento.
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Com o Access TV, clientes da internet residencial AccessNet têm
              mais de 200 canais em uma plataforma regularizada.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => openAccessTVLead("access-tv-hero")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-bold text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-[#20bd5b]"
              >
                <FaWhatsapp size={20} />
                Quero conhecer o Access TV
              </button>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/15"
              >
                Como funciona
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#F6C304]/30 to-[#00BEDC]/25 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md sm:p-5">
              <div className="overflow-hidden rounded-[1.45rem] border border-white/15 bg-[#080494] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F6C304] text-[#080494]">
                      <Tv size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00BEDC]">
                        AccessNet apresenta
                      </p>
                      <p className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-white">
                        Access TV
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#F6C304] px-3 py-1 text-xs font-extrabold text-[#080494]">
                    +200
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {categories.map((category, index) => (
                    <div
                      key={category}
                      className={`rounded-2xl border border-white/10 p-4 ${
                        index === 0
                          ? "bg-[#1847E3]"
                          : index === 1
                            ? "bg-[#00BEDC]/80"
                            : "bg-white/10"
                      }`}
                    >
                      <div className="mb-8 h-2 w-10 rounded-full bg-[#F6C304]" />
                      <p className="text-sm font-bold text-white">{category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#9A7600]">
              Mais conteúdo para sua casa
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#1510C8] sm:text-5xl">
              Internet e entretenimento juntos
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Um benefício pensado para ampliar o que a sua conexão AccessNet
              entrega no dia a dia.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.article
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-3xl border border-[#1510C8]/10 bg-[#F7F8FF] p-7"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1510C8] text-[#F6C304]">
                    <Icon size={27} />
                  </div>
                  <h3 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold text-[#1510C8]">
                    {benefit.title}
                  </h3>
                  <p className="leading-relaxed text-slate-500">
                    {benefit.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-[#F7F8FF] py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#9A7600]">
              Próximos passos
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#1510C8] sm:text-5xl">
              Consulte em poucos passos
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#1510C8]/10"
                >
                  <span className="absolute right-6 top-5 font-[family-name:var(--font-heading)] text-5xl font-extrabold text-[#1510C8]/10">
                    0{index + 1}
                  </span>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6C304] text-[#080494]">
                    <Icon size={23} />
                  </div>
                  <h3 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-bold text-[#1510C8]">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Disponibilidade e condições podem variar. Consulte a equipe
            AccessNet.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1510C8] to-[#1847E3] p-8 text-center shadow-xl sm:p-12">
          <div className="absolute -left-12 -top-16 h-48 w-48 rounded-full bg-[#00BEDC]/25 blur-3xl" />
          <div className="absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-[#F6C304]/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white sm:text-4xl">
              Quer saber se o Access TV está disponível para você?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
              Fale com a nossa equipe e confira as condições para a sua
              internet residencial.
            </p>
            <button
              type="button"
              onClick={() => openAccessTVLead("access-tv-final")}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#20bd5b]"
            >
              <FaWhatsapp size={20} />
              Consultar Access TV
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

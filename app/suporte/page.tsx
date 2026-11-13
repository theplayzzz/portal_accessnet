import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Cable, Headphones, MessageCircle, Phone, Router, Wifi } from "lucide-react";
import Link from "next/link";
import SupportChat from "@/components/support/SupportChat";

export const metadata: Metadata = {
  title: "Suporte técnico pelo chat | AccessNet",
  description: "Fale com o suporte técnico da AccessNet pelo chat, direto no site.",
  alternates: { canonical: "/suporte" },
  robots: { index: false, follow: false },
};

export default function SuportePage() {
  return (
    <div className="bg-[#F7F8FF]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#5F6470] hover:text-[#1510C8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1510C8] sm:mb-8"><ArrowLeft size={15} /> Voltar ao site</Link>
        <div className="grid items-start gap-9 lg:grid-cols-[0.9fr_1fr] lg:gap-16 xl:gap-24">
          <div className="lg:pt-5">
            <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1510C8]"><Headphones size={16} /> Suporte técnico</div>
            <h1 className="max-w-xl font-[family-name:var(--font-heading)] text-[2.35rem] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#12131A] sm:text-5xl lg:text-[3.35rem]">Sua conexão merece atenção.</h1>
            <span className="mb-6 mt-6 block h-1.5 w-14 rounded-full bg-[#F6C304]" />
            <p className="max-w-md text-base leading-relaxed text-[#5F6470] sm:text-lg">Internet lenta, sem sinal ou dificuldade no Wi-Fi? Conte pra gente pelo chat, aqui mesmo.</p>

            <div className="my-10 hidden items-center gap-2 text-[#1510C8] sm:flex" aria-hidden="true">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D9DCFF] bg-white"><Router size={23} strokeWidth={1.5} /></span>
              <span className="h-px max-w-20 flex-1 bg-[#BEC8FF]" />
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1510C8] text-white"><MessageCircle size={22} strokeWidth={1.5} /></span>
              <span className="h-px max-w-20 flex-1 bg-[#BEC8FF]" />
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D9DCFF] bg-white"><Headphones size={23} strokeWidth={1.5} /></span>
            </div>

            <div className="hidden max-w-md rounded-2xl border border-[#D9DCFF] bg-white p-6 lg:block">
              <h2 className="mb-4 text-sm font-bold text-[#12131A]">Para ajudar no atendimento</h2>
              <ul className="space-y-4 text-sm leading-relaxed text-[#5F6470]">
                <li className="flex gap-3"><Wifi className="mt-0.5 shrink-0 text-[#1510C8]" size={18} /><span>Conte se o problema acontece em um aparelho ou em todos.</span></li>
                <li className="flex gap-3"><Cable className="mt-0.5 shrink-0 text-[#1510C8]" size={18} /><span>Se puder, observe as luzes do modem e deixe essa informação à mão.</span></li>
              </ul>
            </div>

            <a href="tel:08004491021" className="mt-5 inline-flex items-center gap-3 rounded-xl py-2 text-sm text-[#5F6470] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1510C8] lg:mt-7">
              <Phone size={18} className="text-[#1510C8]" /><span>Prefere ligar? <strong className="ml-1 text-[#080494]">0800 449 1021</strong></span><ArrowUpRight size={16} />
            </a>
          </div>
          <SupportChat />
        </div>
      </div>
    </div>
  );
}

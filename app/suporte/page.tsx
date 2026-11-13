import type { Metadata, Viewport } from "next";
import { ArrowLeft, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SupportChat from "@/components/support/SupportChat";

export const metadata: Metadata = {
  title: "Suporte técnico pelo chat | AccessNet",
  description: "Fale com o suporte técnico da AccessNet pelo chat, direto no site.",
  alternates: { canonical: "/suporte" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#FFFFFF",
};

export default function SuportePage() {
  return (
    <div className="h-dvh overflow-hidden bg-white lg:flex lg:items-center lg:bg-[#F7F8FF] lg:p-8">
      <div className="mx-auto grid h-full w-full max-w-6xl items-stretch lg:max-h-[960px] lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <aside aria-label="Informações do suporte" className="hidden flex-col justify-between py-8 pl-4 pr-3 lg:flex">
          <Link href="/" aria-label="AccessNet — voltar ao site" className="w-fit rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1510C8]">
            <Image src="/api/blob-img/accessnet/logo-accessnet.png" alt="AccessNet" width={200} height={97} className="h-auto w-36" priority />
          </Link>
          <div className="max-w-xs">
            <span className="mb-6 block h-1 w-10 rounded-full bg-[#F6C304]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[#12131A]">Suporte técnico</p>
            <p className="mt-4 text-base leading-relaxed text-[#5F6470]">Converse com a AccessNet sem sair desta página.</p>
            <p className="mt-6 text-sm leading-relaxed text-[#5F6470]">Tenha o CPF ou CNPJ do titular à mão para a identificação no atendimento.</p>
          </div>
          <div className="flex flex-col items-start gap-5 text-sm text-[#5F6470]">
            <a href="tel:08004491021" className="inline-flex items-center gap-2 rounded py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1510C8]">
              <Phone size={16} className="text-[#1510C8]" /> 0800 449 1021
            </a>
            <Link href="/" className="inline-flex items-center gap-2 rounded py-1 hover:text-[#1510C8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1510C8]"><ArrowLeft size={15} /> Voltar ao site</Link>
          </div>
        </aside>
        <SupportChat />
      </div>
    </div>
  );
}

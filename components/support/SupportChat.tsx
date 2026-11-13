"use client";

import { ArrowRight, Headphones, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WHATSAPP_URL } from "@/config/contact";

export default function SupportChat() {
  const [opened, setOpened] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!opened) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type !== "accessnet:webchat") return;
      if (["ready", "error", "loading"].includes(event.data.state)) setStatus(event.data.state);
    };
    window.addEventListener("message", handleMessage);
    const timeout = window.setTimeout(() => setStatus((current) => current === "loading" ? "error" : current), 25_000);
    return () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timeout);
    };
  }, [opened, attempt]);

  return (
    <section id="chat" aria-label="Chat de suporte técnico" className="overflow-hidden rounded-[24px] border border-[#D9DCFF] bg-white shadow-[0_16px_60px_-24px_rgba(21,16,200,0.22)]">
      <div className="flex items-center gap-3 border-b border-[#E9EBFA] px-5 py-4 sm:px-7">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1510C8] text-white"><Headphones size={22} /></span>
        <div>
          <h2 className="text-base font-bold text-[#12131A]">Chat de suporte</h2>
          <p className="text-xs text-[#5F6470]">Converse sem sair do site</p>
        </div>
        {opened && <span role="status" className="ml-auto flex items-center gap-1.5 text-xs text-[#5F6470]">
          {status === "loading" ? <Loader2 size={14} className="animate-spin motion-reduce:animate-none" /> : <span className={`h-2 w-2 rounded-full ${status === "ready" ? "bg-[#1510C8]" : "bg-amber-500"}`} />}
          {status === "ready" ? "Conectado" : status === "loading" ? "Conectando" : "Sem conexão"}
        </span>}
      </div>

      <div className="border-b border-[#E9EBFA] bg-[#F7F8FF] px-5 py-3 text-sm leading-relaxed text-[#43485B] sm:px-7">
        No primeiro menu, escolha <strong className="text-[#080494]">2 — Suporte</strong> para falar sobre sua conexão.
      </div>

      {!opened ? (
        <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-8 text-center sm:min-h-[500px] sm:py-12">
          <span className="relative mb-7 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#EEF0FF] text-[#1510C8]">
            <MessageCircle size={36} strokeWidth={1.6} />
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-[3px] border-white bg-[#F6C304]" />
          </span>
          <h3 className="max-w-[280px] font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight text-[#12131A]">Vamos cuidar da sua conexão.</h3>
          <p className="mb-7 mt-4 max-w-[310px] text-sm leading-relaxed text-[#5F6470]">Abra o chat e conte o que está acontecendo. Não precisa entrar com uma conta.</p>
          <button onClick={() => setOpened(true)} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#1510C8] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#080494] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1510C8]">
            Abrir chat de suporte <ArrowRight size={18} />
          </button>
          <p className="mt-5 text-xs text-[#5F6470]">Mantenha esta página aberta durante o atendimento.</p>
        </div>
      ) : (
        <div className="relative">
          <iframe
            key={attempt}
            ref={frame}
            src="/suporte/chat"
            title="Conversa com o suporte AccessNet"
            className="block h-[min(540px,65dvh)] min-h-[320px] w-full border-0 sm:h-[500px]"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          {status === "error" && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white px-7 text-center">
            <MessageCircle className="text-[#1510C8]" size={32} />
            <h3 className="text-xl font-bold text-[#12131A]">Não conseguimos conectar o chat.</h3>
            <p className="max-w-xs text-sm leading-relaxed text-[#5F6470]">Tente novamente ou fale com a AccessNet por outro canal.</p>
            <button onClick={() => { setStatus("loading"); setAttempt((value) => value + 1); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1510C8] px-5 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1510C8]">
              <RefreshCw size={16} /> Tentar novamente
            </button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#1510C8] underline underline-offset-4">Falar pelo WhatsApp</a>
          </div>}
        </div>
      )}
    </section>
  );
}

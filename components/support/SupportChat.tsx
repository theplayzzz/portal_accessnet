"use client";

import { MessageCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WHATSAPP_URL } from "@/config/contact";

export default function SupportChat() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
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
  }, [attempt]);

  return (
    <section id="chat" aria-label="Chat de suporte técnico" className="relative h-full min-h-0 overflow-hidden bg-white lg:rounded-[24px] lg:border lg:border-[#D9DCFF] lg:shadow-[0_16px_60px_-24px_rgba(21,16,200,0.22)]">
      <span role="status" className="sr-only">{status === "ready" ? "Conectado" : status === "loading" ? "Conectando" : "Sem conexão"}</span>
      <iframe
        key={attempt}
        ref={frame}
        src="/suporte/chat"
        title="Conversa com o suporte AccessNet"
        className="block h-full w-full border-0"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {status === "error" && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white px-7 text-center">
        <MessageCircle className="text-[#1510C8]" size={32} />
        <p className="text-xl font-bold text-[#12131A]">Não conseguimos conectar o chat.</p>
        <p className="max-w-xs text-sm leading-relaxed text-[#5F6470]">Tente novamente ou fale com a AccessNet por outro canal.</p>
        <button onClick={() => { setStatus("loading"); setAttempt((value) => value + 1); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1510C8] px-5 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1510C8]">
          <RefreshCw size={16} /> Tentar novamente
        </button>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#1510C8] underline underline-offset-4">Falar pelo WhatsApp</a>
      </div>}
    </section>
  );
}
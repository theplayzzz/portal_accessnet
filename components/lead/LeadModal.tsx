"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useLeadModal } from "./useLeadModal";
import { captureUtms } from "@/lib/utm";

type FormState = "form" | "submitting" | "success";

// Schema dedicado do modal (client). O schema do backend adiciona UTM/source.
const clientSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .max(120, "Nome muito longo"),
  telefone: z
    .string()
    .trim()
    .refine((v) => {
      const d = v.replace(/\D/g, "");
      return d.length >= 10 && d.length <= 13;
    }, "Telefone inválido"),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  endereco: z
    .string()
    .trim()
    .min(5, "Endereço muito curto")
    .max(500, "Endereço muito longo"),
  website: z.string().max(0, "bot detected"),
});
type ClientFormValues = z.infer<typeof clientSchema>;

export function LeadModal() {
  const { open, source, planContext, closeLeadModal } = useLeadModal();
  const [state, setState] = React.useState<FormState>("form");
  const [submittedName, setSubmittedName] = React.useState<string>("");
  const [submittedPhone, setSubmittedPhone] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as unknown as Resolver<ClientFormValues>,
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
      website: "",
    },
  });

  // Reset estado quando o modal reabre
  React.useEffect(() => {
    if (open) {
      setState("form");
      reset({
        nome: "",
        telefone: "",
        email: "",
        endereco: "",
        website: "",
      });
    }
  }, [open, reset]);

  async function submitToApi(
    values: ClientFormValues,
    attempt = 1
  ): Promise<Response | null> {
    try {
      const utm = captureUtms();
      const payload = {
        ...values,
        sourceCta: source ?? "unknown",
        sourcePage:
          typeof window !== "undefined" ? window.location.pathname : undefined,
        referrer:
          typeof document !== "undefined" ? document.referrer : undefined,
        planContext,
        utm,
      };
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res;
    } catch (err) {
      if (attempt < 2) {
        // 1 retry após 1s em erro de rede
        await new Promise((r) => setTimeout(r, 1000));
        return submitToApi(values, attempt + 1);
      }
      // Desistiu — reporta via beacon (best-effort) e retorna null
      try {
        if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
          const blob = new Blob(
            [JSON.stringify({ sourceCta: source, err: String(err) })],
            { type: "application/json" }
          );
          navigator.sendBeacon("/api/lead/client-error", blob);
        }
      } catch {
        /* ignore */
      }
      return null;
    }
  }

  async function onSubmit(values: ClientFormValues) {
    setState("submitting");
    setSubmittedName(values.nome.split(" ")[0] || values.nome);
    setSubmittedPhone(values.telefone);

    const res = await submitToApi(values);

    if (res && res.status === 429) {
      // Rate limit — volta pro form pra retry manual
      setState("form");
      alert("Muitas requisições em pouco tempo. Aguarde um instante e tente novamente.");
      return;
    }

    // Mesmo que Opa! falhe no background ou o backend tenha dado 5xx,
    // o usuário sempre vê sucesso — DB é source of truth.
    setState("success");
  }

  function handleOpenChange(next: boolean) {
    if (!next) closeLeadModal();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showClose
        className="sm:max-w-[480px] p-0"
        data-testid="lead-modal"
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <SuccessPanel
                nome={submittedName}
                telefone={submittedPhone}
                onClose={closeLeadModal}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FormHeader planContext={planContext} />
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7 space-y-4"
                noValidate
              >
                {/* Honeypot — bots preenchem, humanos não */}
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
                >
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("website")}
                    />
                  </label>
                </div>

                <Field
                  label="Nome completo"
                  error={errors.nome?.message}
                  htmlFor="lead-nome"
                >
                  <Input
                    id="lead-nome"
                    autoComplete="name"
                    placeholder="Como devemos te chamar?"
                    disabled={state === "submitting"}
                    invalid={!!errors.nome}
                    data-testid="lead-field-nome"
                    {...register("nome")}
                  />
                </Field>

                <Field
                  label="Email"
                  error={errors.email?.message}
                  htmlFor="lead-email"
                >
                  <Input
                    id="lead-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    disabled={state === "submitting"}
                    invalid={!!errors.email}
                    data-testid="lead-field-email"
                    {...register("email")}
                  />
                </Field>

                <Field
                  label="WhatsApp"
                  error={errors.telefone?.message}
                  htmlFor="lead-telefone"
                  hint="Vamos chamar nesse número pra dar sequência"
                >
                  <Input
                    id="lead-telefone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(98) 9 9999-9999"
                    disabled={state === "submitting"}
                    invalid={!!errors.telefone}
                    data-testid="lead-field-telefone"
                    {...register("telefone")}
                  />
                </Field>

                <Field
                  label="Endereço de instalação"
                  error={errors.endereco?.message}
                  htmlFor="lead-endereco"
                  hint="Rua, número, bairro e cidade — pra checar a viabilidade"
                >
                  <Textarea
                    id="lead-endereco"
                    rows={2}
                    autoComplete="street-address"
                    placeholder="Ex: Rua das Flores, 123, Centro, São Luís-MA"
                    disabled={state === "submitting"}
                    invalid={!!errors.endereco}
                    data-testid="lead-field-endereco"
                    {...register("endereco")}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={state === "submitting" || isSubmitting}
                  data-testid="lead-submit"
                  className={cn(
                    "group relative w-full overflow-hidden rounded-xl px-6 py-3.5 mt-2",
                    "font-bold text-white text-[15px] tracking-wide",
                    "transition-all duration-200",
                    "disabled:opacity-70 disabled:cursor-not-allowed",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500] focus-visible:ring-offset-2"
                  )}
                  style={{
                    background:
                      "linear-gradient(135deg, #FFA500 0%, #FF8A00 50%, #FFA500 100%)",
                    boxShadow:
                      "0 8px 20px -6px rgba(255,138,0,0.5), 0 2px 4px rgba(30,58,95,0.08)",
                  }}
                >
                  {/* shimmer sweep on hover */}
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />
                  </span>

                  <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    {state === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Quero ser contatado pelo WhatsApp
                        <FaWhatsapp className="h-5 w-5" />
                      </>
                    )}
                  </span>
                </button>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed pt-1">
                  🔒 Seus dados ficam só com a AccessNet.
                  Resposta em minutos, de segunda a sábado das 8h às 20h.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Form Header ---------------- */

function FormHeader({
  planContext,
}: {
  planContext: {
    planName?: string;
    planSpeed?: string;
    planGB?: string;
  } | null;
}) {
  const planLabel = planContext?.planName ?? planContext?.planSpeed ?? planContext?.planGB;

  return (
    <div
      className="relative px-6 pt-8 pb-6 sm:px-7 sm:pt-9 sm:pb-7 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1E3A5F 0%, #142845 55%, #0B1828 100%)",
      }}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-10 h-52 w-52 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #FFA500 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #25D366 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      {/* Subtle grid dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {planLabel && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFA500]/15 border border-[#FFA500]/30 px-2.5 py-1 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFA500]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FFD27A]">
              Plano {planLabel}
            </span>
          </div>
        )}
        <DialogTitle className="text-white font-heading text-[26px] leading-[1.15] tracking-tight mb-2">
          Fale com a gente.
          <span className="block text-[#FFA500]">Sem complicação.</span>
        </DialogTitle>
        <DialogDescription className="text-slate-300 text-[14px] leading-relaxed max-w-[90%]">
          Preencha seus dados e nosso time comercial chama no seu WhatsApp em poucos minutos.
        </DialogDescription>
      </div>
    </div>
  );
}

/* ---------------- Field wrapper ---------------- */

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={htmlFor}>{label}</Label>
        {hint && !error && (
          <span className="text-[11px] text-slate-400 font-normal">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p
          role="alert"
          className="text-[12px] text-red-600 font-medium flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------- Success panel ---------------- */

function SuccessPanel({
  nome,
  telefone,
  onClose,
}: {
  nome: string;
  telefone: string;
  onClose: () => void;
}) {
  const maskedPhone = React.useMemo(() => {
    const digits = telefone.replace(/\D/g, "");
    if (digits.length < 8) return telefone;
    const last = digits.slice(-4);
    const mid = digits.slice(-8, -4);
    return `(${digits.slice(-11, -9) || "  "}) ${mid.slice(0, 1)} ${mid.slice(1)}-${last}`;
  }, [telefone]);

  const firstName = nome?.trim().split(" ")[0] ?? "";
  const fallbackText = encodeURIComponent(
    "Olá! Preenchi meus dados no site e quero continuar o atendimento."
  );
  const fallbackHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${fallbackText}`;

  return (
    <div className="relative overflow-hidden">
      {/* Header verde compacto — confirmação calma */}
      <div
        className="relative px-6 pt-7 pb-6 sm:px-7 sm:pt-8 sm:pb-7 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #15a847 0%, #1eba58 45%, #25D366 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-16 left-1/3 -translate-x-1/2 h-40 w-40 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-12 h-44 w-44 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #e7ffe9 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-start gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.05 }}
            className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/95 shadow-lg shadow-emerald-900/20"
          >
            <Check className="h-6 w-6 text-[#15a847]" strokeWidth={3.5} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.3 }}
            className="pt-0.5 min-w-0"
          >
            <DialogTitle className="text-white text-[19px] sm:text-[20px] font-heading font-bold leading-tight">
              {firstName
                ? `${firstName}, te mandamos um WhatsApp.`
                : "Te mandamos um WhatsApp."}
            </DialogTitle>
            <DialogDescription className="text-white/85 text-[13px] mt-1 leading-snug">
              Confira o seu celular em{" "}
              <span className="font-semibold text-white whitespace-nowrap">
                {maskedPhone}
              </span>
            </DialogDescription>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 sm:px-7 sm:py-6 bg-white">
        {/* Preview do que ele vai ver no WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              O que vai chegar
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          </div>

          <div
            className="relative rounded-2xl rounded-tl-md p-4 shadow-sm overflow-hidden"
            style={{ backgroundColor: "#202C33" }}
          >
            {/* Sutil noise pra simular fundo do WhatsApp */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "12px 12px",
              }}
              aria-hidden="true"
            />

            <p className="relative text-white text-[13px] leading-[1.55] mb-3">
              Olá! 👋 Aqui é da AccessNet.
              <br />
              <br />
              Recebemos uma solicitação em nosso site para consulta de
              viabilidade. Essas informações estão corretas?
            </p>
            <div className="relative grid grid-cols-2 gap-1.5 -mx-1 -mb-1 pt-2 border-t border-white/[0.07]">
              <div
                className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-3 text-[13px] font-semibold"
                style={{ color: "#53bdeb", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                Sou eu
              </div>
              <div
                className="flex items-center justify-center rounded-lg py-2.5 px-3 text-[13px] font-semibold"
                style={{ color: "#53bdeb", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                Não sou eu
              </div>
            </div>
          </div>

          {/* Ação requerida */}
          <div className="mt-3.5 flex items-start gap-2.5">
            <span
              className="flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full text-[#FF8A00] mt-[1px]"
              style={{ backgroundColor: "rgba(255,165,0,0.14)" }}
              aria-hidden="true"
            >
              <span className="text-[11px] font-black leading-none">!</span>
            </span>
            <p className="text-[13px] text-slate-700 leading-relaxed">
              Toque em{" "}
              <span className="font-bold text-[#1E3A5F]">Sou eu</span> pra
              confirmar — um consultor te chama em seguida.
            </p>
          </div>
        </motion.div>

        {/* Divisor narrativo */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full h-px bg-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Não chegou?
            </span>
          </div>
        </div>

        {/* Fallback CTA — atendimento direto, alto contraste */}
        <motion.a
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          href={fallbackHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex items-center justify-between gap-3 w-full overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-200",
            "text-white shadow-lg",
            "hover:shadow-xl hover:-translate-y-[1px]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500] focus-visible:ring-offset-2"
          )}
          style={{
            background:
              "linear-gradient(135deg, #FFA500 0%, #FF8A00 55%, #F77F00 100%)",
            boxShadow:
              "0 8px 20px -6px rgba(255,138,0,0.45), 0 2px 4px rgba(30,58,95,0.08)",
          }}
        >
          {/* Shimmer no hover */}
          <span
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]" />
          </span>

          <div className="relative flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <FaWhatsapp className="h-[19px] w-[19px] text-[#1eba58]" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[14.5px] font-extrabold leading-tight tracking-tight">
                Não recebi a mensagem
              </p>
              <p className="text-[12px] text-white/85 leading-tight mt-0.5 font-medium">
                Falar com a central pelo WhatsApp
              </p>
            </div>
          </div>
          <ArrowRight className="relative flex-shrink-0 h-[18px] w-[18px] text-white group-hover:translate-x-0.5 transition-transform" />
        </motion.a>

        {/* Close — exit terciário */}
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full text-center text-[12.5px] text-slate-400 hover:text-slate-600 transition-colors py-2 focus:outline-none focus-visible:underline"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useLeadModal } from "./useLeadModal";
import type { LeadModalPlanContext } from "./LeadModalProvider";
import { cn } from "@/lib/utils";

type CommonProps = {
  source: string;
  planContext?: LeadModalPlanContext;
  className?: string;
  children: React.ReactNode;
  "data-testid"?: string;
  "aria-label"?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * Substitui os antigos <a href="https://wa.me/...">. Ao clicar, abre o modal
 * global de captura de lead em vez de redirecionar pro WhatsApp direto.
 *
 * Sempre passe `source` — identifica onde o clique aconteceu (ex: "floating",
 * "hero-fibra", "pricing-fibra-400mbps"). É gravado no banco e nos logs, útil
 * pra análise de conversão por ponto de CTA.
 *
 * O componente renderiza como <button>, mantendo o estilo original do link
 * original via `className` e `children`.
 */
export function WhatsAppCTA({
  source,
  planContext,
  className,
  children,
  onClick,
  ...rest
}: CommonProps) {
  const { openLeadModal } = useLeadModal();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    openLeadModal({ source, planContext });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(className)}
      data-lead-cta={source}
      {...rest}
    >
      {children}
    </button>
  );
}

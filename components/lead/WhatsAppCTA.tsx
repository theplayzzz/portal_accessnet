"use client";

import * as React from "react";
import { WHATSAPP_URL } from "@/config/contact";
import { reportCtaClick } from "@/gtag.js";
import ShinyButton from "@/components/ui/ShinyBadge";
import { cn } from "@/lib/utils";

type CommonProps = {
  source: string;
  variant?: "default" | "shiny";
  className?: string;
  children: React.ReactNode;
  "data-testid"?: string;
  "aria-label"?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

/**
 * Link direto para o WhatsApp público com a mensagem de origem do site.
 * `source` identifica a intenção no Analytics, sem cadastrar ou enviar um lead.
 */
export function WhatsAppCTA({
  source,
  variant = "default",
  className,
  children,
  onClick,
  ...rest
}: CommonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    reportCtaClick({ source });
  };

  if (variant === "shiny") {
    return (
      <ShinyButton
        href={WHATSAPP_URL}
        onClick={handleClick}
        className={className}
        data-lead-cta={source}
        {...rest}
      >
        {children}
      </ShinyButton>
    );
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(className)}
      data-lead-cta={source}
      {...rest}
    >
      {children}
    </a>
  );
}

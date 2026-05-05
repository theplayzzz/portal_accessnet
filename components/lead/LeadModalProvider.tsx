"use client";

import * as React from "react";
import { LeadModal } from "./LeadModal";
import { reportPageviewConversion } from "@/gtag.js";

export type LeadModalPlanContext = {
  planName?: string;
  planSpeed?: string;
  planGB?: string;
  planPrice?: string;
};

export type LeadModalOpenPayload = {
  source: string;
  planContext?: LeadModalPlanContext;
};

type LeadModalContextValue = {
  open: boolean;
  source: string | null;
  planContext: LeadModalPlanContext | null;
  openLeadModal: (payload: LeadModalOpenPayload) => void;
  closeLeadModal: () => void;
};

export const LeadModalContext =
  React.createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [source, setSource] = React.useState<string | null>(null);
  const [planContext, setPlanContext] =
    React.useState<LeadModalPlanContext | null>(null);

  const openLeadModal = React.useCallback(
    (payload: LeadModalOpenPayload) => {
      setSource(payload.source);
      setPlanContext(payload.planContext ?? null);
      setOpen(true);
      // Conversão "Visualização de página" — gatilho de clique:
      // qualquer CTA que abre o modal de cadastro entra como intent.
      reportPageviewConversion();
    },
    []
  );

  const closeLeadModal = React.useCallback(() => {
    setOpen(false);
  }, []);

  const value = React.useMemo(
    () => ({ open, source, planContext, openLeadModal, closeLeadModal }),
    [open, source, planContext, openLeadModal, closeLeadModal]
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <LeadModal />
    </LeadModalContext.Provider>
  );
}

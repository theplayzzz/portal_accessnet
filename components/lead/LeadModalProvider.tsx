"use client";

import * as React from "react";
import { LeadModal } from "./LeadModal";
import { reportCtaClick } from "@/gtag.js";
import { captureTracking } from "@/lib/utm";

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

  React.useEffect(() => {
    captureTracking();
  }, []);

  const openLeadModal = React.useCallback(
    (payload: LeadModalOpenPayload) => {
      setSource(payload.source);
      setPlanContext(payload.planContext ?? null);
      setOpen(true);
      // Clique/intenção deve usar uma conversion label dedicada no Google Ads.
      reportCtaClick({ source: payload.source });
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

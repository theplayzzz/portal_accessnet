"use client";

import { useContext } from "react";
import { LeadModalContext } from "./LeadModalProvider";

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) {
    throw new Error(
      "useLeadModal deve ser usado dentro de <LeadModalProvider>"
    );
  }
  return ctx;
}

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function SiteChrome({ children, header, footer }: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const isSupport = usePathname() === "/suporte";

  return (
    <>
      {!isSupport && header}
      <main className="flex w-full flex-col">{children}</main>
      {!isSupport && footer}
    </>
  );
}

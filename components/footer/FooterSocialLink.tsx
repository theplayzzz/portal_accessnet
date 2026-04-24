"use client";

import * as React from "react";
import { WhatsAppCTA } from "@/components/lead/WhatsAppCTA";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import type { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
};

export function FooterSocialLink({
  link,
}: {
  link: { name: string; href: string };
}) {
  const Icon = ICON_MAP[link.name] ?? FaFacebook;
  const iconNode = <Icon size={18} />;
  const className =
    "w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-[#FFA500] hover:bg-white/20 transition-all";

  // WhatsApp abre modal de lead; demais redes continuam como link externo
  if (link.name === "whatsapp") {
    return (
      <WhatsAppCTA
        source="footer-social"
        aria-label={link.name}
        className={className}
      >
        {iconNode}
      </WhatsAppCTA>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.name}
      className={className}
    >
      {iconNode}
    </a>
  );
}

"use client";
import { siteConfig } from "@/config/site";
import { MenuIcon, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { WhatsAppCTA } from "@/components/lead/WhatsAppCTA";

const navLinks = [
  { label: "Planos", href: "/#Planos" },
  { label: "Cobertura", href: "/#Cobertura" },
  { label: "Rede Móvel", href: "/rede-movel" },
  { label: "Dúvidas", href: "/#Duvidas" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100"
          : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-12 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/api/blob-img/accessnet/logo-accessnet.png"
              alt="AccessNet"
              width={160}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-[#1E3A5F] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-2 text-sm font-medium text-[#1E3A5F]"
            >
              <Phone size={16} />
              {siteConfig.phone}
            </a>
            <WhatsAppCTA
              source="header-desktop"
              data-testid="header-desktop-cta"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5B] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-105"
            >
              <FaWhatsapp size={18} />
              Assine Ja
            </WhatsAppCTA>
          </div>

          {/* Mobile: WhatsApp + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <WhatsAppCTA
              source="header-mobile"
              data-testid="header-mobile-cta"
              className="flex items-center gap-1.5 bg-[#25D366] text-white font-semibold text-xs px-3 py-1.5 rounded-xl"
            >
              <FaWhatsapp size={14} />
              Assine
            </WhatsAppCTA>
            <button
              aria-label="Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 border-t border-gray-100">
            <ul className="space-y-1 pt-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 px-4 space-y-3">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center justify-center gap-2 text-sm font-medium text-[#1E3A5F] py-2"
              >
                <Phone size={16} />
                {siteConfig.phone}
              </a>
              <WhatsAppCTA
                source="header-mobile-menu"
                data-testid="header-mobile-menu-cta"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-base w-full py-3 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaWhatsapp size={20} />
                Assine Agora pelo WhatsApp
              </WhatsAppCTA>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

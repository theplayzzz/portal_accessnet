import { siteConfig } from "@/config/site";
import Image from "next/image";
import { FooterSocialLink } from "./FooterSocialLink";

const Footer = async () => {
  return (
    <footer className="bg-[#0B1828] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand & Contact */}
          <div>
            <Image
              src="/api/blob-img/accessnet/logo-accessnet-dark.png"
              alt="AccessNet"
              width={160}
              height={40}
              className="h-10 w-auto mb-6"
            />
            <div className="space-y-2 text-white/60 text-sm">
              <p>Av. Castelo Branco, 3176 - Pinheiro/MA</p>
              <p>CEP 65200-000</p>
              <p className="text-white font-semibold text-base mt-3">{siteConfig.phone}</p>
              <p>Seg-Sex: 8h-18h | Sab: 8h-12h e 14h-17h</p>
              <p>Dom: 9h-12h</p>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="font-bold text-white mb-6 font-[family-name:var(--font-heading)]">
              Links Uteis
            </h3>
            <ul className="space-y-3">
              {siteConfig.footerProducts.map((product) => (
                <li key={product.name}>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-[#FFA500] transition-colors text-sm"
                  >
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <h3 className="font-bold text-white mb-6 font-[family-name:var(--font-heading)]">
              Redes Sociais
            </h3>
            <div className="flex gap-4">
              {siteConfig.footerLinks.map((link) => (
                <FooterSocialLink
                  key={link.name}
                  link={{ name: link.name, href: link.href }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-white/40 text-sm">
            © 2026 AccessNet Telecomunicacoes LTDA - CNPJ: 09.171.603/0001-20
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { siteConfig } from "@/config/site";
import React from "react";

const HeaderLinks = () => {
  return (
    <div className="flex items-center gap-3">
      {siteConfig.headerLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          className="text-gray-500 hover:text-[#1E3A5F] transition-colors"
        >
          {React.createElement(link.icon, { className: "w-5 h-5" })}
        </a>
      ))}
    </div>
  );
};

export default HeaderLinks;

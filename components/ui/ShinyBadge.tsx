"use client";

export interface ShinyButtonProps {
  children?: React.ReactNode;
  href: string;
  className?: string;
}

const ShinyButton = ({ children, href, className = "" }: ShinyButtonProps) => {
  return (
    <>
      <style>{`
        @keyframes shiny-btn-rotate {
          0% { transform: translate(-50%, -50%) rotate(0); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes shiny-btn-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255,255,255,0.15), 0 0 30px rgba(37,211,102,0.3); }
          50% { box-shadow: 0 0 25px rgba(255,255,255,0.25), 0 0 50px rgba(37,211,102,0.5); }
        }
      `}</style>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative inline-flex items-center justify-center cursor-pointer isolate overflow-hidden rounded-xl hover:scale-[1.03] transition-all duration-300 px-6 py-3 ${className}`}
        style={{
          background: "linear-gradient(135deg, #25D366 0%, #1eba58 50%, #25D366 100%)",
          animation: "shiny-btn-glow 3s ease-in-out infinite",
        }}
      >
        {/* Rotating border glow — thicker 2px for visibility */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            padding: "2px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 w-full before:float-left before:pt-[100%] after:clear-both after:block"
            style={{
              animation: "shiny-btn-rotate 3s linear infinite",
              background:
                "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 240deg, #ffffffcc 300deg, #ffffff 360deg)",
            }}
          />
        </div>

        {/* Inner shine sweep — bright white diagonal */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div
            className="absolute inset-0 animate-shimmer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />
          </div>
        </div>

        {/* Subtle top highlight for depth */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold drop-shadow-sm">
          {children}
        </span>
      </a>
    </>
  );
};

export default ShinyButton;

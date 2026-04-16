"use client";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  repeat?: number;
  duration?: number;
  className?: string;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  direction = "left",
  repeat = 4,
  duration = 40,
  className,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex gap-[var(--gap)] overflow-hidden",
        className
      )}
      style={
        {
          "--duration": `${duration}s`,
          "--gap": "1rem",
        } as React.CSSProperties
      }
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 gap-[var(--gap)]",
            direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { Terminal } from "@/components/ui/terminal";
import { usePointerCapabilities } from "@/hooks/use-pointer-capabilities";
import { cn } from "@/lib/utils";

const Aurora = dynamic(() => import("@/components/Aurora"), { ssr: false });
const Particles = dynamic(
  () => import("@/components/ui/particles").then((module) => module.Particles),
  { ssr: false }
);

interface ProjectsSectionProps {
  isDarkMode?: boolean;
  onToggleTheme?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ProjectsSection({
  isDarkMode = false,
  onToggleTheme,
}: ProjectsSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const { ready, isCoarsePointer } = usePointerCapabilities();
  const lowPowerMode = !ready || isCoarsePointer;

  return (
    <section className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center">
      <div
        className={cn(
          "absolute inset-0 z-10 flex items-start justify-center overflow-hidden px-4 pb-6 pt-[calc(env(safe-area-inset-top)+5.5rem)] transition-colors duration-700 lg:px-12 lg:pb-10 lg:pt-24",
          isDarkMode ? "bg-black" : "bg-white"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-[52%] overflow-hidden",
            isDarkMode
              ? "opacity-85 mix-blend-screen"
              : "opacity-55 mix-blend-multiply"
          )}
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 56%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 56%, transparent 100%)",
          }}
          aria-hidden="true"
        >
          {/* Instant base gradient: guarantees glow is rendered from Frame 0 upon refresh/load */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background: isDarkMode
                ? "linear-gradient(118deg, rgba(0,229,255,0.65) 0%, rgba(124,58,237,0.7) 48%, rgba(255,79,216,0.62) 100%)"
                : "linear-gradient(118deg, rgba(2,132,199,0.58) 0%, rgba(124,58,237,0.52) 48%, rgba(219,39,119,0.48) 100%)",
            }}
          />
          {!lowPowerMode && (
            <div className="absolute inset-0">
              <Aurora
                colorStops={
                  isDarkMode
                    ? ["#00E5FF", "#7C3AED", "#FF4FD8"]
                    : ["#0284C7", "#7C3AED", "#DB2777"]
                }
                amplitude={1.15}
                blend={0.68}
                speed={reduceMotion ? 0 : 0.42}
              />
            </div>
          )}
        </div>

        {lowPowerMode ? (
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-55"
            style={{
              backgroundImage: isDarkMode
                ? "radial-gradient(circle, rgba(255,255,255,0.9) 0 1px, transparent 1.4px), radial-gradient(circle, rgba(183,214,255,0.75) 0 0.8px, transparent 1.2px)"
                : "radial-gradient(circle, rgba(0,0,0,0.55) 0 0.8px, transparent 1.2px), radial-gradient(circle, rgba(47,62,85,0.42) 0 0.7px, transparent 1.1px)",
              backgroundPosition: "0 0, 37px 23px",
              backgroundSize: "83px 79px, 117px 109px",
            }}
            aria-hidden="true"
          />
        ) : (
          <Particles
            className="absolute inset-0 z-[1]"
            quantity={150}
            ease={80}
            color={isDarkMode ? "#ffffff" : "#000000"}
            refresh
          />
        )}

        <div className="pointer-events-none relative z-10 flex h-full w-full max-w-[1400px] items-center justify-center">
          <Terminal
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
            lowPowerMode={lowPowerMode}
            className={cn(
              "pointer-events-auto h-[86%] w-[94%] max-w-none translate-y-2 md:h-[88%] md:w-[90%] lg:h-[86%] lg:w-[84vw] lg:translate-y-3",
              isDarkMode
                ? "shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                : "shadow-none"
            )}
          />
        </div>
      </div>
    </section>
  );
}

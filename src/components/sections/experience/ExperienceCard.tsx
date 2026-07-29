import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";

export interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  description: string[];
}

interface ExperienceCardProps {
  data: ExperienceData;
  index: number;
  position: [number, number, number];
}

export const ExperienceCard = forwardRef<HTMLDivElement, ExperienceCardProps>(
  ({ data, index, position }, ref) => {
    const { size } = useThree();
    const [isCoarsePointer, setIsCoarsePointer] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia("(pointer: coarse)");
      const updatePointerType = () => setIsCoarsePointer(mediaQuery.matches);

      updatePointerType();
      mediaQuery.addEventListener("change", updatePointerType);
      return () => mediaQuery.removeEventListener("change", updatePointerType);
    }, []);

    const isDesktopModeOnTouchDevice = isCoarsePointer && size.width >= 640;
    const distanceFactor = isDesktopModeOnTouchDevice
      ? 2.15
      : size.width < 640
        ? 3.25
        : 4.2;

    return (
      <group position={position}>
        <Html
          transform
          center
          distanceFactor={distanceFactor}
          zIndexRange={[10, 0]}
          className="pointer-events-none"
        >
          <article
            ref={ref}
            className={cn(
              "pointer-events-auto relative isolate w-[86vw] max-w-[620px] overflow-hidden rounded-[24px] sm:rounded-[30px]",
              "border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.07)_34%,rgba(4,8,26,0.58)_72%,rgba(2,4,16,0.72)_100%)] p-6 text-white",
              "backdrop-blur-[46px] backdrop-saturate-150 sm:p-8 md:p-10",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.24),inset_0_-1px_0_rgba(255,255,255,0.05),0_30px_100px_rgba(0,0,0,0.5),0_0_90px_rgba(71,116,255,0.14)]",
              "transition-[border-color,box-shadow] duration-500 hover:border-white/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.07),0_34px_110px_rgba(0,0,0,0.52),0_0_100px_rgba(75,140,255,0.2)]",
              "will-change-[transform,opacity]"
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.075)_23%,transparent_46%,rgba(97,121,255,0.055)_76%,rgba(255,79,205,0.045)_100%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-[1px] rounded-[23px] border border-white/[0.07] sm:rounded-[29px]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent"
              aria-hidden="true"
            />

            <div className="relative z-10 mb-6 flex items-start justify-between gap-4 sm:gap-6">
              <div className="min-w-0">
                <p className="mb-2.5 text-[9px] font-mono uppercase tracking-[0.16em] text-cyan-100/70 sm:text-[10px]">
                  Experience {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-stack text-2xl font-medium leading-tight tracking-wide text-white sm:text-3xl">
                  {data.company}
                </h3>
                <p className="mt-2.5 text-sm font-medium text-cyan-100/90 sm:text-base">
                  {data.role}
                </p>
              </div>

              <time className="shrink-0 border-l border-white/15 pl-3 text-right font-mono text-[9px] leading-relaxed tracking-wide text-white/60 sm:pl-5 sm:text-xs">
                {data.duration}
              </time>
            </div>

            <div
              className="relative z-10 mb-6 flex items-center gap-3"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(125,224,255,0.95)]" />
              <span className="h-px flex-1 bg-gradient-to-r from-white/24 via-white/10 to-transparent" />
            </div>

            <ul className="relative z-10 space-y-3 text-sm font-light leading-6 text-white/80 sm:text-[15px] sm:leading-7">
              {data.description.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[6px_1fr] items-start gap-3"
                >
                  <span
                    className="mt-[9px] h-1.5 w-1.5 rounded-full bg-cyan-100/80 shadow-[0_0_8px_rgba(165,243,252,0.55)]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </Html>
      </group>
    );
  }
);

ExperienceCard.displayName = "ExperienceCard";

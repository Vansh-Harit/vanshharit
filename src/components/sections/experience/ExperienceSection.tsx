"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import VariableProximity from "@/components/VariableProximity";
import { usePointerCapabilities } from "@/hooks/use-pointer-capabilities";
import { Scene } from "./Scene";

const clampProgress = (value: number) => Math.max(0, Math.min(1, value));

export default function ExperienceSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showJourneyCue, setShowJourneyCue] = useState(true);
  const scrollRef = useRef(0);
  const targetRef = useRef(0);
  const lastTouchYRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { ready, isCoarsePointer } = usePointerCapabilities();
  const lowPowerMode = !ready || isCoarsePointer;

  const scheduleJourneyAnimation = useCallback(() => {
    if (frameRef.current !== null) return;

    const animate = () => {
      const easing = reduceMotion ? 0.16 : 0.075;
      const difference = targetRef.current - scrollRef.current;

      if (Math.abs(difference) < 0.0005) {
        scrollRef.current = targetRef.current;
        setScrollProgress(targetRef.current);
        setShowJourneyCue(targetRef.current === 0);
        frameRef.current = null;
        return;
      }

      scrollRef.current += difference * easing;
      setScrollProgress(scrollRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [reduceMotion]);

  const moveJourney = useCallback(
    (amount: number) => {
      const nextTarget = clampProgress(targetRef.current + amount);
      targetRef.current = nextTarget;

      if (nextTarget > 0) {
        setShowJourneyCue(false);
      }

      scheduleJourneyAnimation();
    },
    [scheduleJourneyAnimation]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      const normalizedDelta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? event.deltaY * window.innerHeight
            : event.deltaY;

      moveJourney(normalizedDelta * 0.00105);
    },
    [moveJourney]
  );

  useEffect(() => {
    const container = document.getElementById("experience-canvas-container");
    if (!container) return;

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      const previousY = lastTouchYRef.current;
      if (currentY === undefined || previousY === null) return;

      event.preventDefault();
      moveJourney((previousY - currentY) * 0.0024);
      lastTouchYRef.current = currentY;
    };

    const handleTouchEnd = () => {
      lastTouchYRef.current = null;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [handleWheel, moveJourney]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const steps: Record<string, number> = {
      ArrowDown: 0.14,
      ArrowRight: 0.14,
      PageDown: 0.35,
      ArrowUp: -0.14,
      ArrowLeft: -0.14,
      PageUp: -0.35,
    };

    if (event.key === "Home") {
      event.preventDefault();
      targetRef.current = 0;
      scheduleJourneyAnimation();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      targetRef.current = 1;
      setShowJourneyCue(false);
      scheduleJourneyAnimation();
      return;
    }

    const step = steps[event.key];
    if (step !== undefined) {
      event.preventDefault();
      moveJourney(step);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: lowPowerMode ? 0.25 : 0.8 }}
      id="experience-canvas-container"
      className="absolute inset-0 h-full w-full overflow-hidden bg-[#010208] outline-none"
      style={{ touchAction: "none" }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Interactive experience journey"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 240 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={lowPowerMode ? [1, 1.15] : [1, 1.75]}
      >
        <Suspense fallback={null}>
          <Scene
            scrollProgress={scrollProgress}
            reduceMotion={reduceMotion}
            lowPowerMode={lowPowerMode}
          />
        </Suspense>
      </Canvas>

      <JourneyCue reduceMotion={reduceMotion} visible={showJourneyCue} />
      <JourneyProgress progress={scrollProgress} />
    </motion.section>
  );
}

function JourneyCue({
  reduceMotion,
  visible,
}: {
  reduceMotion: boolean;
  visible: boolean;
}) {
  return (
    <>
      <ProximityCue
        label="Scroll ahead"
        reduceMotion={reduceMotion}
        visible={visible}
        className="left-3 top-[12%] hidden w-40 lg:block min-[1360px]:left-6 min-[1360px]:top-[54%] min-[1360px]:w-52 min-[1360px]:-translate-y-1/2"
        textClassName="text-2xl min-[1360px]:text-[30px]"
      />
      <ProximityCue
        label="Move ahead"
        reduceMotion={reduceMotion}
        visible={visible}
        className="left-1/2 top-[calc(env(safe-area-inset-top)+5.5rem)] z-[60] block min-h-7 w-max -translate-x-1/2 overflow-visible lg:hidden"
        textClassName="text-xl leading-tight"
      />
    </>
  );
}

interface ProximityCueProps {
  label: string;
  reduceMotion: boolean;
  visible: boolean;
  className: string;
  textClassName: string;
}

function ProximityCue({
  label,
  reduceMotion,
  visible,
  className,
  textClassName,
}: ProximityCueProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textClasses = `font-stack whitespace-nowrap leading-none text-white/75 drop-shadow-[0_0_18px_rgba(148,210,255,0.28)] ${textClassName}`;

  return (
    <motion.div
      ref={containerRef}
      className={`pointer-events-none absolute z-20 ${className}`}
      aria-label={label}
      aria-hidden={!visible}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
    >
      {reduceMotion ? (
        <span className={textClasses}>{label}</span>
      ) : (
        <VariableProximity
          label={label}
          active={visible}
          containerRef={containerRef}
          fromFontVariationSettings="'wght' 420"
          toFontVariationSettings="'wght' 820"
          radius={105}
          falloff="gaussian"
          className={textClasses}
          style={{ fontFamily: "var(--font-geist-sans)" }}
        />
      )}
    </motion.div>
  );
}

function JourneyProgress({ progress }: { progress: number }) {
  const activeStation = progress < 0.5 ? 0 : 1;

  return (
    <>
      <div
        className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center md:flex"
        aria-hidden="true"
      >
        <span
          className={`text-[10px] font-mono ${
            activeStation === 0 ? "text-white" : "text-white/35"
          }`}
        >
          01
        </span>
        <div className="relative my-3 h-32 w-px overflow-hidden bg-white/15">
          <div
            className="absolute left-0 top-0 w-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
        <span
          className={`text-[10px] font-mono ${
            activeStation === 1 ? "text-white" : "text-white/35"
          }`}
        >
          02
        </span>
      </div>

      <div
        className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center md:hidden"
        aria-hidden="true"
      >
        <span className="text-[9px] font-mono text-white/70">01</span>
        <div className="relative mx-3 h-px w-24 overflow-hidden bg-white/15">
          <div
            className="absolute left-0 top-0 h-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-[9px] font-mono text-white/70">02</span>
      </div>
    </>
  );
}

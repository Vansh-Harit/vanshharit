"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiGmail, SiWhatsapp, SiX } from "react-icons/si";
import BlurText from "@/components/BlurText";
import GradientText from "@/components/GradientText";
import LiquidEther from "@/components/LiquidEther";
import { BorderBeam } from "@/components/ui/border-beam";
import { KineticText } from "@/components/ui/kinetic-text";
import { usePointerCapabilities } from "@/hooks/use-pointer-capabilities";
import { cn } from "@/lib/utils";

interface ContactMethod {
  label: string;
  value: string;
  href: string;
  icon: IconType;
  external?: boolean;
  wide?: boolean;
  accent: string;
  glow: string;
  beamFrom: string;
  beamTo: string;
}

const contactMethods: ContactMethod[] = [
  {
    label: "WhatsApp",
    value: "+91 99916 46206",
    href: "https://wa.me/919991646206",
    icon: SiWhatsapp,
    external: true,
    accent: "text-emerald-300",
    glow: "group-hover:shadow-[0_0_32px_rgba(110,231,183,0.2)]",
    beamFrom: "#25D366",
    beamTo: "#86EFAC",
  },
  {
    label: "X",
    value: "@VansHx349",
    href: "https://x.com/VansHx349",
    icon: SiX,
    external: true,
    accent: "text-white",
    glow: "group-hover:shadow-[0_0_32px_rgba(255,255,255,0.14)]",
    beamFrom: "#FFFFFF",
    beamTo: "#A1A1AA",
  },
  {
    label: "GitHub",
    value: "Vansh-Harit",
    href: "https://github.com/Vansh-Harit",
    icon: SiGithub,
    external: true,
    accent: "text-violet-300",
    glow: "group-hover:shadow-[0_0_32px_rgba(196,181,253,0.2)]",
    beamFrom: "#C4B5FD",
    beamTo: "#8B5CF6",
  },
  {
    label: "LinkedIn",
    value: "Vansh Harit",
    href: "https://www.linkedin.com/in/vansh-harit-5590512b2?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    icon: FaLinkedinIn,
    external: true,
    accent: "text-sky-300",
    glow: "group-hover:shadow-[0_0_32px_rgba(125,211,252,0.22)]",
    beamFrom: "#7DD3FC",
    beamTo: "#0A66C2",
  },
  {
    label: "Gmail",
    value: "vanshharit@gmail.com",
    href: "mailto:vanshharit@gmail.com",
    icon: SiGmail,
    wide: true,
    accent: "text-rose-300",
    glow: "group-hover:shadow-[0_0_32px_rgba(253,164,175,0.2)]",
    beamFrom: "#FDA4AF",
    beamTo: "#EA4335",
  },
];

export default function ContactSection() {
  const reduceMotion = Boolean(useReducedMotion());
  const { ready, isCoarsePointer } = usePointerCapabilities();
  const lowPowerMode = !ready || isCoarsePointer;

  return (
    <section className="absolute inset-0 isolate h-full w-full overflow-hidden bg-[#020308] text-white">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B497CF"]}
          mouseForce={reduceMotion ? 0 : lowPowerMode ? 8 : 20}
          cursorSize={lowPowerMode ? 72 : 100}
          resolution={lowPowerMode ? 0.28 : 0.5}
          iterationsPoisson={lowPowerMode ? 12 : 32}
          iterationsViscous={lowPowerMode ? 12 : 32}
          isBounce={false}
          isViscous
          viscous={lowPowerMode ? 22 : 30}
          autoDemo={!reduceMotion}
          autoSpeed={lowPowerMode ? 0.32 : 0.5}
          autoIntensity={lowPowerMode ? 1.35 : 2.2}
          takeoverDuration={lowPowerMode ? 0.18 : 0.22}
          autoResumeDelay={lowPowerMode ? 1800 : 1400}
          className="opacity-95"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/12"
        aria-hidden="true"
      />

      <div className="relative z-10 h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex min-h-full w-full max-w-[1440px] flex-col justify-center px-5 pb-10 pt-[calc(env(safe-area-inset-top)+6.75rem)] sm:px-8 md:px-12 lg:px-16 lg:pb-12 lg:pt-28 xl:px-20">
          <div className="mb-7 flex min-h-10 justify-center sm:mb-9 lg:mb-12">
            <div className="contact-mobile-prompt w-full justify-center">
              {reduceMotion ? (
                <p className="font-stack text-xl font-bold tracking-normal text-white/88 sm:text-2xl">
                  Got some work for me?
                </p>
              ) : (
                <BlurText
                  text="Got some work for me?"
                  animateBy="words"
                  direction="bottom"
                  delay={110}
                  stepDuration={0.32}
                  className="justify-center font-stack text-xl font-bold tracking-normal text-white/88 sm:text-2xl"
                />
              )}
            </div>

            <KineticText
              text="Got some work for me?"
              as="p"
              className="contact-laptop-kinetic justify-center font-stack text-3xl font-[750] leading-none tracking-normal text-white/90 xl:text-4xl"
            />
          </div>

          <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(34rem,1.08fr)] lg:items-center lg:gap-14 xl:gap-20">
            <motion.header
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <h1 className="font-stack text-[2.6rem] font-medium leading-[0.98] tracking-normal sm:text-6xl lg:text-[3.8rem] xl:text-[4.4rem]">
                {reduceMotion ? (
                  <span
                    className="block bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #5227ff, #ff9ffc, #b14444)",
                    }}
                  >
                    Let&apos;s connect
                    <span className="relative -top-0.5 mt-2 block pb-[0.08em] xl:whitespace-nowrap">
                      and grow together.
                    </span>
                  </span>
                ) : (
                  <GradientText
                    colors={["#5227ff", "#ff9ffc", "#b14444"]}
                    animationSpeed={5}
                    direction="horizontal"
                    yoyo
                    pauseOnHover={false}
                    showBorder={false}
                    className="mx-0 max-w-none cursor-default justify-start rounded-none font-stack font-medium leading-[0.98]"
                  >
                    <span className="block">
                      Let&apos;s connect
                      <span className="relative -top-0.5 mt-2 block pb-[0.08em] xl:whitespace-nowrap">
                        and grow together.
                      </span>
                    </span>
                  </GradientText>
                )}
              </h1>
            </motion.header>

            <motion.div
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: 0.18,
                    staggerChildren: 0.07,
                  },
                },
              }}
              className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3"
              aria-label="Contact methods"
            >
              {contactMethods.map((method) => (
                <ContactCard
                  key={method.label}
                  method={method}
                  reduceMotion={reduceMotion}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  method,
  reduceMotion,
}: {
  method: ContactMethod;
  reduceMotion: boolean;
}) {
  const Icon = method.icon;

  return (
    <motion.a
      href={method.href}
      target={method.external ? "_blank" : undefined}
      rel={method.external ? "noopener noreferrer" : undefined}
      aria-label={`${method.label}: ${method.value}`}
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      className={cn(
        "contact-card group relative flex min-h-[5.25rem] items-center gap-4 overflow-hidden rounded-lg border border-white/14 bg-black/28 px-4 py-3.5 text-left shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-[26px] transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/30 hover:bg-black/42 focus-visible:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:min-h-[7.25rem] sm:px-5 sm:py-5",
        method.wide && "sm:col-span-2",
        method.glow
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11",
          method.accent
        )}
        aria-hidden="true"
      >
        <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/44 sm:text-[10px]">
          {method.label}
        </span>
        <span
          className={cn(
            "mt-1 block truncate font-stack font-medium tracking-normal text-white/92",
            method.wide
              ? "text-[13px] min-[360px]:text-base sm:text-lg"
              : "text-base sm:text-lg"
          )}
        >
          {method.value}
        </span>
      </span>

      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-white/34 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/88"
        aria-hidden="true"
      />

      {!reduceMotion && (
        <BorderBeam
          size={78}
          duration={4.8}
          borderWidth={1.5}
          colorFrom={method.beamFrom}
          colorTo={method.beamTo}
          className="contact-border-beam opacity-0 transition-opacity duration-300"
        />
      )}
    </motion.a>
  );
}

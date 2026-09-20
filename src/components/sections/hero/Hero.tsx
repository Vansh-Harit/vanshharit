"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/ui/text-animate";
import { TextFlip } from "@/components/ui/text-flip";

export default function Hero() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const updateLayout = () => setIsDesktop(desktopQuery.matches);

    updateLayout();
    desktopQuery.addEventListener("change", updateLayout);
    return () => desktopQuery.removeEventListener("change", updateLayout);
  }, []);

  return (
    <section className="absolute inset-0 h-full w-full overflow-hidden overscroll-none">
      {/* Background is strictly scoped to Introduction Page */}
      <div className="fixed inset-0 pointer-events-none select-none -z-10">
        <Image
          src="/images/portfolio-bg.jpg"
          alt="Site Background"
          fill
          sizes="100vw"
          preload
          className="h-full w-full object-cover object-[85%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Glass Card */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden overscroll-none px-4 pb-4 pt-[calc(env(safe-area-inset-top)+5rem)] lg:items-center lg:p-6">
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.8,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: isDesktop ? "-18vw" : 0,
            y: isDesktop ? "9vh" : 0,
          }}
          transition={{
            opacity: { duration: 0.45, delay: 0 },
            scale: { duration: 0.8, delay: 0.45, type: "spring", bounce: 0.35 },
            x: { duration: 0.8, delay: 0.45, type: "spring", bounce: 0.35 },
            y: { duration: 0.8, delay: 0.45, type: "spring", bounce: 0.35 },
          }}
          className="
            pointer-events-auto
            select-text
            w-[92vw] lg:w-[55vw]
            h-[calc(100dvh-env(safe-area-inset-top)-6.5rem)] lg:h-[70vh]
            max-w-[1400px]
            max-h-[900px]
            rounded-[36px] sm:rounded-[48px]
            border border-white/15
            bg-gradient-to-br
            from-white/15
            via-white/8
            to-white/5
            backdrop-blur-[20px]
            shadow-[0_10px_100px_rgba(0,0,0,0.35)]
            relative
            overflow-hidden
            flex
            flex-col
            will-change-transform
            overscroll-none
          "
        >
          {/* Top-left highlight reflection for the premium liquid glass look */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-white/20
              via-transparent
              to-transparent
              pointer-events-none
            "
          />

          <div className="scrollbar-hide relative z-10 flex h-full w-full flex-col justify-start overflow-x-hidden overflow-y-auto overscroll-contain touch-pan-y select-text p-5 min-[380px]:p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col xl:flex-row items-center justify-center gap-2 mb-6 md:mb-8"
            >
              <h1 className="font-stack shrink-0 select-text cursor-text text-center text-2xl font-medium tracking-wide text-white min-[380px]:text-3xl md:text-4xl lg:text-5xl">
                Vansh Harit
              </h1>
              <span className="font-stack hidden xl:inline-block text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mx-2 opacity-60">—</span>
              <TextFlip
                words={["Founder-Engineer", "Full-Stack Builder"]}
                duration={4000}
                className="font-stack mt-1 text-2xl font-medium tracking-wide text-white min-[380px]:text-3xl md:text-4xl lg:text-5xl xl:mt-0"
              />
            </motion.div>

            <div className="space-y-4 md:space-y-5 select-text cursor-text">
              <TextAnimate
                animation="slideUp"
                by="word"
                as="p"
                startOnView={false}
                once
                delay={0.45}
                duration={1.8}
                className="select-text cursor-text text-[18px] md:text-[20px] font-light text-white/90 leading-[1.55]"
              >
                {`•     I'm a third-year Computer Science student who learns by building — shipping self-hosted AI agents, multi-agent systems, and full-stack products from scratch, often debugging my way through unfamiliar infrastructure rather than waiting until I 'know enough' to start. I care more about growth than comfort — I'll take on a stack I've never touched, sit with the frustrating parts until they click, and keep iterating until something actually works.`}
              </TextAnimate>

              <TextAnimate
                animation="slideUp"
                by="word"
                as="p"
                startOnView={false}
                once
                delay={0.95}
                duration={1.8}
                className="select-text cursor-text text-[18px] md:text-[20px] font-light text-white/90 leading-[1.55]"
              >
                {`•    I work full-stack across Next.js, TypeScript, Supabase, and Tailwind, deploying on Vercel, and I build automation systems with n8n layered with AI scoring and decision logic. I'm equally deep in self-directed learning — DSA, AI engineering, and especially agentic and multi-agent systems — because I'd rather understand how something works from the ground up than just use it off the shelf.`}
              </TextAnimate>

              <TextAnimate
                animation="slideUp"
                by="word"
                as="p"
                startOnView={false}
                once
                delay={1.45}
                duration={0.7}
                className="select-text cursor-text text-[18px] md:text-[20px] font-light text-white/90 leading-[1.55]"
              >
                {`•     Currently working in Product Support & Testing at OnePlay.`}
              </TextAnimate>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

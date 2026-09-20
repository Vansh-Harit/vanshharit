"use client";

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import Hero from "@/components/sections/hero/Hero";
import Navbar from "@/components/layout/Navbar";
import { usePointerCapabilities } from "@/hooks/use-pointer-capabilities";

const ProjectsSection = dynamic(
  () => import("@/components/sections/projects/ProjectsSection"),
  { ssr: false }
);
const ExperienceSection = dynamic(
  () => import("@/components/sections/experience/ExperienceSection"),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import("@/components/sections/contact/ContactSection"),
  { ssr: false }
);

const VALID_SECTIONS = ["Introduction", "Projects", "Experience", "Contact"] as const;
type SectionType = (typeof VALID_SECTIONS)[number];

function getInitialSection(): SectionType {
  if (typeof window === "undefined") return "Introduction";

  const hash = window.location.hash.replace("#", "").toLowerCase();
  const matchedByHash = VALID_SECTIONS.find((s) => s.toLowerCase() === hash);
  if (matchedByHash) return matchedByHash;

  try {
    const saved = sessionStorage.getItem("portfolio_section");
    const matchedSaved = VALID_SECTIONS.find((s) => s === saved);
    if (matchedSaved) return matchedSaved;
  } catch {
    // Ignore storage restriction
  }

  return "Introduction";
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionType>(() => getInitialSection());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { ready, isCoarsePointer } = usePointerCapabilities();
  const lowPowerMode = !ready || isCoarsePointer;

  useEffect(() => {
    const handleHashChange = () => {
      const matched = getInitialSection();
      setActiveSection(matched);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const handleSelectSection = (section: string) => {
    const targetSection = (VALID_SECTIONS.find((s) => s === section) || "Introduction") as SectionType;
    setActiveSection(targetSection);
    try {
      sessionStorage.setItem("portfolio_section", targetSection);
      const targetHash = `#${targetSection.toLowerCase()}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, "", targetHash);
      }
    } catch {
      // Ignore
    }
  };

  // Slide transition variants
  const slideVariants = lowPowerMode
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
      };
  const sectionTransition = {
    duration: lowPowerMode ? 0.24 : 0.5,
    ease: "easeInOut" as const,
  };

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      window.navigator.maxTouchPoints > 0 ||
      window.matchMedia("(max-width: 767px)").matches;

    if (isTouchDevice) {
      setIsDarkMode((prev) => !prev);
      return;
    }

    const toggleBounds = e.currentTarget.getBoundingClientRect();

    // Graceful fallback for older browsers
    if (!document.startViewTransition) {
      setIsDarkMode((prev) => !prev);
      return;
    }

    const hasPointerCoordinates = e.clientX > 0 && e.clientY > 0;
    const useToggleCenter =
      window.matchMedia("(max-width: 767px)").matches ||
      !hasPointerCoordinates;
    const rawX = useToggleCenter
      ? toggleBounds.left + toggleBounds.width / 2
      : e.clientX;
    const rawY = useToggleCenter
      ? toggleBounds.top + toggleBounds.height / 2
      : e.clientY;
    const x = rawX;
    const y = rawY;
    const endRadius = Math.hypot(
      Math.max(rawX, innerWidth - rawX),
      Math.max(rawY, innerHeight - rawY)
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-transition-x", `${x}px`);
    root.style.setProperty("--theme-transition-y", `${y}px`);
    root.style.setProperty("--theme-transition-radius", `${endRadius}px`);
    root.style.setProperty("--theme-transition-duration", "1000ms");

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setIsDarkMode((prev) => !prev);
      });
    });

    transition.finished.finally(() => {
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
      root.style.removeProperty("--theme-transition-radius");
      root.style.removeProperty("--theme-transition-duration");
    });
  };

  return (
    <main
      className={cn(
        "relative flex h-full min-h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-transparent overscroll-none",
        activeSection !== "Projects" || isDarkMode ? "dark" : ""
      )}
    >
      <Navbar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        isDarkMode={isDarkMode}
      />

      <div className="relative h-full w-full flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeSection === "Introduction" && (
            <motion.div
              key="introduction"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sectionTransition}
              className="absolute inset-0 w-full h-full"
            >
              <Hero />
            </motion.div>
          )}

          {activeSection === "Projects" && (
            <motion.div
              key="projects"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sectionTransition}
              className="absolute inset-0 w-full h-full"
            >
              <ProjectsSection
                isDarkMode={isDarkMode}
                onToggleTheme={handleThemeToggle}
              />
            </motion.div>
          )}

          {activeSection === "Experience" && (
            <motion.div
              key="experience"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sectionTransition}
              className="absolute inset-0 w-full h-full"
            >
              <ExperienceSection />
            </motion.div>
          )}

          {activeSection === "Contact" && (
            <motion.div
              key="contact"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sectionTransition}
              className="absolute inset-0 h-full w-full"
            >
              <ContactSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

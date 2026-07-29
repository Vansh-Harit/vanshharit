"use client";

import { motion } from "framer-motion";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Introduction", href: "#introduction" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

interface NavbarProps {
  activeSection: string;
  onSelectSection: (name: string) => void;
}

export default function Navbar({
  activeSection,
  onSelectSection,
}: NavbarProps) {
  return (
    <motion.nav
      className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+1rem)] z-50 w-[calc(100%-1rem)] max-w-[26rem] -translate-x-1/2 md:left-auto md:right-4 md:top-8 md:w-auto md:max-w-none md:translate-x-0 lg:right-6 xl:right-8 2xl:right-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "relative flex w-full items-center justify-between gap-0 rounded-full p-1 md:w-auto md:gap-1 md:p-1.5",
          "bg-gradient-to-br from-white/15 via-white/8 to-white/5",
          "backdrop-blur-[20px]",
          "border border-white/10",
          "shadow-[0_10px_100px_rgba(0,0,0,0.35)]"
        )}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.name;
          return (
            <div
              key={item.name}
              className="relative flex flex-1 flex-col items-center md:flex-none"
            >
              <InteractiveHoverButton
                onClick={() => onSelectSection(item.name)}
                className={cn(
                  "w-full px-1 py-2 text-[11px] font-medium tracking-wide text-black dark:text-white sm:px-2 sm:text-xs md:w-auto md:px-5 md:text-sm",
                  isActive && "font-semibold"
                )}
              >
                {item.name}
              </InteractiveHoverButton>
              {isActive && (
                <motion.div
                  layoutId="activeUnderline"
                  className="absolute bottom-1 z-20 h-[2.5px] w-7 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.35)] dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.35)] md:w-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.nav>
  );
}

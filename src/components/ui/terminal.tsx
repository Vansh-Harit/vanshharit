"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, GitBranch } from "lucide-react";
import dynamic from "next/dynamic";
import { ThemeToggler } from "@/components/ui/theme-toggler";
import type { TechnologyId } from "@/components/ui/falling-tech-stack";
import { cn } from "@/lib/utils";

const FallingTechStack = dynamic(
  () =>
    import("@/components/ui/falling-tech-stack").then(
      (module) => module.FallingTechStack
    ),
  { ssr: false }
);

interface Project {
  id: string;
  railLabel: string;
  path: string;
  title: string;
  date: string;
  linkLabel?: string;
  linkHref?: string;
  linkType?: "github" | "website";
  context?: string;
  technologies: string;
  techStack: TechnologyId[];
  details: string[];
}

const projects: Project[] = [
  {
    id: "upi-fraud-detection",
    railLabel: "UPI Fraud Detection",
    path: "upi-fraud-detection",
    title: "UPI Fraud Detection System",
    date: "Mar 2026",
    linkLabel: "GitHub",
    linkHref: "https://github.com/Vansh-Harit/UPI-Fraud-Detection",
    linkType: "github",
    context: "Devcation Delhi 2026 Hackathon – TigerGraph Track",
    technologies: "TigerGraph, Python, Streamlit",
    techStack: ["tigergraph", "python", "streamlit"],
    details: [
      "Built real-time fraud detection system using TigerGraph graph database to identify 4 UPI fraud patterns: circular money flows, device sharing, geographic velocity fraud, and mule networks across 10K+ transactions",
      "Architected graph schema with 4 vertex types and 5 edge types; implemented 4 custom GSQL algorithms achieving 94% fraud detection accuracy on synthetic dataset of 1,050 users",
      "Developed Python fraud scoring engine with weighted pattern matching (0–100 scale) and Streamlit dashboard with Pyvis network visualization for real-time fraud pattern analysis",
      "Demonstrated graph database advantages over SQL for relationship-based fraud detection: millisecond query performance vs hours for equivalent 5-table self-joins on circular flow detection",
    ],
  },
  {
    id: "inbox-unite",
    railLabel: "Inbox Unite [live]",
    path: "inbox-unite",
    title: "Inbox Unite — Unified Customer Messaging Platform",
    date: "2026 – Present",
    linkLabel: "Inbox Unite",
    linkHref: "https://inbox-unite.vercel.app/",
    linkType: "website",
    technologies: "Next.js, TypeScript, Supabase, Google OAuth",
    techStack: ["nextjs", "typescript", "supabase", "google-oauth"],
    details: [
      "Built an end-to-end messaging platform enabling small businesses to manage customer communication efficiently",
      "Integrated Gmail API using OAuth 2.0 with real-time inbox synchronization",
      "Implemented AI-powered reply suggestions using OpenRouter API for automated response drafting",
      "Designed a responsive email thread interface with conversation grouping and status tracking",
      "Architected a secure multi-tenant backend using Supabase with row-level security for data isolation",
    ],
  },
  {
    id: "contestic",
    railLabel: "Contestic [live]",
    path: "contestic",
    title: "Contestic - Full-Stack Contest Platform",
    date: "Live",
    linkLabel: "Contestic",
    linkHref: "https://contestic.in/",
    linkType: "website",
    technologies:
      "Next.js, TypeScript, Supabase (PostgreSQL/Auth/Realtime), Razorpay, Cloudflare R2, Resend, Upstash Redis, Sentry, Netlify",
    techStack: [
      "nextjs",
      "typescript",
      "supabase",
      "cloudflare-r2",
      "upstash-redis",
    ],
    details: [
      "A web application enabling businesses to run paid creative contests - connecting clients with contestants across content categories (script writing, brand naming, copywriting, design) through a structured entry, submission, and prize-payout workflow.",
      "Architected and built a full-stack Next.js application with Supabase (PostgreSQL, Auth, Row-Level Security, Realtime) as the backend, implementing role-based access control for clients, contestants, and admin operations.",
      "Integrated Razorpay for end-to-end payment processing, including webhook-based signature verification, escrow-style fund handling, and idempotent transaction processing to prevent duplicate charges.",
      "Designed a two-phase contest lifecycle (registration window followed by submission window) with automated state transitions handled via scheduled background jobs.",
      "Built a file submission system using Cloudflare R2 for direct-to-storage uploads with presigned URLs, including server-side validation and automated cleanup on contest completion.",
      "Implemented transactional email workflows (Resend) for entry confirmations, deadline notifications, and payout status updates, with notification debouncing to prevent spam.",
      "Added production-hardening measures including middleware-based route protection, Upstash Redis rate limiting, and Sentry error tracking.",
      "Built an internal admin dashboard for manual payout verification and dispute handling, secured via database-driven role checks.",
    ],
  },
];

interface TerminalProps {
  className?: string;
  isDarkMode?: boolean;
  onToggleTheme?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  lowPowerMode?: boolean;
}

function ProjectLink({ project }: { project: Project }) {
  if (!project.linkHref || !project.linkLabel || !project.linkType) {
    return null;
  }

  const Icon = project.linkType === "github" ? GitBranch : ExternalLink;

  return (
    <a
      href={project.linkHref}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 font-semibold underline decoration-current/30 underline-offset-4 transition-opacity hover:opacity-60"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {project.linkLabel}
    </a>
  );
}

export function Terminal({
  className,
  isDarkMode = true,
  onToggleTheme,
  lowPowerMode = false,
}: TerminalProps) {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const selectedProject =
    projects.find((project) => project.id === selectedId) ?? projects[0];
  const hasProjectMetadata = Boolean(
    selectedProject.linkHref || selectedProject.context
  );

  return (
    <motion.div
      initial={false}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border font-mono shadow-2xl transition-colors duration-500",
        isDarkMode
          ? lowPowerMode
            ? "border-white/20 bg-black/95 text-white shadow-[0_20px_70px_rgba(0,0,0,0.72)]"
            : "border-white/20 bg-black/90 text-white shadow-[0_20px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
          : lowPowerMode
            ? "border-black/20 bg-white text-black shadow-[0_20px_60px_rgba(0,0,0,0.16)]"
            : "border-black/20 bg-white/95 text-black shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-3xl",
        className
      )}
    >
      <div
        className={cn(
          "grid min-h-12 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b px-3 transition-colors duration-500 sm:px-4",
          isDarkMode ? "border-white/10 bg-black/80" : "border-black/10 bg-white/80"
        )}
      >
        <div className="flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/90 shadow-sm sm:h-3 sm:w-3" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/90 shadow-sm sm:h-3 sm:w-3" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/90 shadow-sm sm:h-3 sm:w-3" />
        </div>

        <div className="min-w-0 text-center text-[10px] opacity-60 sm:text-xs">
          <span className="hidden sm:inline">vansh@portfolio: ~/projects/</span>
          <span className="sm:hidden">~/projects/</span>
          <span className="inline-block max-w-full truncate align-bottom">
            {selectedProject.path}
          </span>
        </div>

        <div className="flex items-center">
          {onToggleTheme && (
            <ThemeToggler
              isDarkMode={isDarkMode}
              onToggle={onToggleTheme}
              className="scale-75"
            />
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[minmax(190px,24%)_minmax(0,1fr)]">
        <div
          role="tablist"
          aria-label="Projects"
          className={cn(
            "flex shrink-0 gap-2 overflow-x-auto border-b p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden",
            isDarkMode ? "border-white/10" : "border-black/10"
          )}
        >
          {projects.map((project, index) => {
            const isActive = project.id === selectedProject.id;

            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="project-detail-panel"
                onClick={() => setSelectedId(project.id)}
                className={cn(
                  "min-h-9 shrink-0 rounded-md border px-3 text-left text-[11px] font-semibold transition-colors",
                  isActive
                    ? isDarkMode
                      ? "border-emerald-300/60 bg-emerald-300/10 text-emerald-100"
                      : "border-emerald-700/50 bg-emerald-700/10 text-emerald-950"
                    : isDarkMode
                      ? "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
                      : "border-black/10 text-black/55 hover:border-black/25 hover:text-black"
                )}
              >
                <span className="mr-2 opacity-45">0{index + 1}</span>
                {project.railLabel}
              </button>
            );
          })}
        </div>

        <aside
          className={cn(
            "hidden min-h-0 border-r px-5 py-7 md:block lg:px-7 lg:py-9",
            isDarkMode ? "border-white/10" : "border-black/10"
          )}
        >
          <p className="mb-7 text-[10px] uppercase tracking-[0.2em] opacity-40">
            Project index
          </p>

          <div
            role="tablist"
            aria-label="Projects"
            className={cn(
              "relative flex flex-col gap-2 border-l",
              isDarkMode ? "border-white/20" : "border-black/20"
            )}
          >
            {projects.map((project, index) => {
              const isActive = project.id === selectedProject.id;

              return (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="project-detail-panel"
                  onClick={() => setSelectedId(project.id)}
                  className={cn(
                    "group relative min-h-16 w-full px-5 py-3 text-left transition-colors",
                    isActive
                      ? isDarkMode
                        ? "text-cyan-100"
                        : "text-cyan-950"
                      : "opacity-45 hover:opacity-80"
                  )}
                >
                  <span
                    className={cn(
                      "absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 transition-all",
                      isActive
                        ? isDarkMode
                          ? "border-emerald-200 bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.8)]"
                          : "border-emerald-800 bg-emerald-700 shadow-[0_0_12px_rgba(4,120,87,0.35)]"
                        : isDarkMode
                          ? "border-white/40 bg-black"
                          : "border-black/35 bg-white"
                    )}
                    aria-hidden="true"
                  />
                  <span className="mb-1 block text-[10px] opacity-45">
                    0{index + 1}
                  </span>
                  <span className="block text-xs font-semibold leading-relaxed lg:text-sm">
                    {project.railLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div
          id="project-detail-panel"
          role="tabpanel"
          className="min-h-0 overflow-y-auto px-4 py-5 select-text [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 md:px-8 md:py-7 lg:px-10 lg:py-9"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={selectedProject.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="mb-5 md:mb-7">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] opacity-40">
                  project --inspect
                </p>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                  <h2 className="max-w-3xl text-lg font-bold leading-tight sm:text-xl lg:text-2xl">
                    {selectedProject.title}
                  </h2>
                  <span className="shrink-0 text-xs opacity-50 lg:pt-1">
                    {selectedProject.date}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "mb-5 border-y py-4 text-xs leading-relaxed md:mb-7",
                  hasProjectMetadata &&
                    "grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
                  isDarkMode ? "border-white/10" : "border-black/10"
                )}
              >
                {hasProjectMetadata && (
                  <div className="min-w-0">
                    <ProjectLink project={selectedProject} />
                    {selectedProject.context && (
                      <span className="mt-1 block italic opacity-55 sm:ml-3 sm:mt-0 sm:inline">
                        {selectedProject.context}
                      </span>
                    )}
                  </div>
                )}
                <span className="opacity-55">{selectedProject.technologies}</span>
              </div>

              <div className="relative lg:h-[390px] lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
                {!lowPowerMode && (
                  <div className="pointer-events-none sticky top-0 z-20 hidden h-[390px] -mb-[390px] lg:block">
                    <FallingTechStack
                      key={selectedProject.id}
                      technologies={selectedProject.techStack}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "relative z-10 select-text",
                    lowPowerMode ? "lg:w-full" : "lg:w-[68%] xl:w-[70%]"
                  )}
                >
                  <ul className="space-y-3 text-xs leading-relaxed sm:text-[13px] lg:space-y-4 lg:text-[15px] lg:leading-7 xl:text-base">
                    {selectedProject.details.map((detail) => (
                      <li
                        key={detail}
                        className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 lg:gap-4"
                      >
                        <span
                          className={cn(
                            "mt-[0.65em] h-1.5 w-1.5 rounded-full lg:h-2 lg:w-2",
                            isDarkMode ? "bg-emerald-300/80" : "bg-emerald-700/80"
                          )}
                          aria-hidden="true"
                        />
                        <span className="opacity-80">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import Matter from "matter-js";
import type { IconType } from "react-icons";
import {
  SiGoogle,
  SiCloudflare,
  SiNextdotjs,
  SiPython,
  SiStreamlit,
  SiSupabase,
  SiTypescript,
  SiUpstash,
} from "react-icons/si";
import { cn } from "@/lib/utils";

export type TechnologyId =
  | "tigergraph"
  | "python"
  | "streamlit"
  | "nextjs"
  | "typescript"
  | "supabase"
  | "google-oauth"
  | "cloudflare-r2"
  | "upstash-redis";

interface Technology {
  id: TechnologyId;
  label: string;
  color: string;
  icon?: IconType;
  imageSrc?: string;
}

const technologyRegistry: Record<TechnologyId, Technology> = {
  tigergraph: {
    id: "tigergraph",
    label: "TigerGraph",
    color: "#ff6d00",
    imageSrc: "/images/tigergraph-logo.svg",
  },
  python: {
    id: "python",
    label: "Python",
    color: "#3776ab",
    icon: SiPython,
  },
  streamlit: {
    id: "streamlit",
    label: "Streamlit",
    color: "#ff4b4b",
    icon: SiStreamlit,
  },
  nextjs: {
    id: "nextjs",
    label: "Next.js",
    color: "#a1a1aa",
    icon: SiNextdotjs,
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    color: "#3178c6",
    icon: SiTypescript,
  },
  supabase: {
    id: "supabase",
    label: "Supabase",
    color: "#3fcf8e",
    icon: SiSupabase,
  },
  "google-oauth": {
    id: "google-oauth",
    label: "Google OAuth",
    color: "#4285f4",
    icon: SiGoogle,
  },
  "cloudflare-r2": {
    id: "cloudflare-r2",
    label: "Cloudflare R2",
    color: "#f38020",
    icon: SiCloudflare,
  },
  "upstash-redis": {
    id: "upstash-redis",
    label: "Upstash Redis",
    color: "#00e9a3",
    icon: SiUpstash,
  },
};

interface FallingTechStackProps {
  technologies: TechnologyId[];
  isDarkMode: boolean;
  className?: string;
}

export function FallingTechStack({
  technologies,
  isDarkMode,
  className,
}: FallingTechStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const stack = technologies.map((technology) => technologyRegistry[technology]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduceMotion) return;

    let disposeSimulation: (() => void) | undefined;

    const startSimulation = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width < 220 || height < 180) return;

      disposeSimulation?.();

      const {
        Bodies,
        Body,
        Bounds,
        Engine,
        Events,
        Runner,
        World,
      } = Matter;
      const engine = Engine.create();
      const runner = Runner.create();
      const elements = Array.from(
        container.querySelectorAll<HTMLElement>("[data-tech-item]")
      );

      engine.world.gravity.y = 0.72;

      const boundaryOptions = {
        isStatic: true,
        render: { visible: false },
      };
      const boundaryThickness = 80;
      const boundaries = [
        Bodies.rectangle(
          width / 2,
          height + boundaryThickness / 2,
          width + boundaryThickness * 2,
          boundaryThickness,
          boundaryOptions
        ),
        Bodies.rectangle(
          -boundaryThickness / 2,
          height / 2,
          boundaryThickness,
          height * 2,
          boundaryOptions
        ),
        Bodies.rectangle(
          width + boundaryThickness / 2,
          height / 2,
          boundaryThickness,
          height * 2,
          boundaryOptions
        ),
        Bodies.rectangle(
          width / 2,
          -boundaryThickness / 2,
          width + boundaryThickness * 2,
          boundaryThickness,
          boundaryOptions
        ),
      ];

      const bodies = elements.map((element, index) => {
        const rect = element.getBoundingClientRect();
        const lane = (index + 1) / (elements.length + 1);
        const body = Bodies.rectangle(
          width * (0.68 + lane * 0.28),
          34 + (index % 2) * 22,
          rect.width,
          rect.height,
          {
            chamfer: { radius: 8 },
            restitution: 0.58,
            friction: 0.28,
            frictionAir: 0.012,
            render: { visible: false },
          }
        );

        Body.setVelocity(body, {
          x: (index % 2 === 0 ? 1 : -1) * (0.7 + index * 0.12),
          y: 0,
        });
        Body.setAngularVelocity(body, (index % 2 === 0 ? 1 : -1) * 0.018);

        return { body, element };
      });

      let draggedBody: Matter.Body | undefined;
      let dragOffset = { x: 0, y: 0 };

      const getLocalPoint = (event: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      };

      const handlePointerDown = (event: PointerEvent) => {
        const point = getLocalPoint(event);
        const target = [...bodies]
          .reverse()
          .find(({ body }) => Bounds.contains(body.bounds, point));

        if (!target) return;

        draggedBody = target.body;
        dragOffset = {
          x: draggedBody.position.x - point.x,
          y: draggedBody.position.y - point.y,
        };
        Body.setVelocity(draggedBody, { x: 0, y: 0 });
        Body.setAngularVelocity(draggedBody, 0);
        container.setPointerCapture(event.pointerId);
        event.preventDefault();
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (!draggedBody) return;
        const point = getLocalPoint(event);

        Body.setPosition(draggedBody, {
          x: point.x + dragOffset.x,
          y: point.y + dragOffset.y,
        });
        Body.setVelocity(draggedBody, { x: 0, y: 0 });
        event.preventDefault();
      };

      const handlePointerUp = (event: PointerEvent) => {
        if (!draggedBody) return;
        draggedBody = undefined;
        if (container.hasPointerCapture(event.pointerId)) {
          container.releasePointerCapture(event.pointerId);
        }
      };

      const syncElements = () => {
        bodies.forEach(({ body, element }) => {
          element.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`;
        });
      };

      World.add(engine.world, [
        ...boundaries,
        ...bodies.map(({ body }) => body),
      ]);
      container.addEventListener("pointerdown", handlePointerDown);
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerup", handlePointerUp);
      container.addEventListener("pointercancel", handlePointerUp);
      Events.on(engine, "afterUpdate", syncElements);
      Runner.run(runner, engine);

      disposeSimulation = () => {
        Events.off(engine, "afterUpdate", syncElements);
        container.removeEventListener("pointerdown", handlePointerDown);
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerup", handlePointerUp);
        container.removeEventListener("pointercancel", handlePointerUp);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    };

    const resizeObserver = new ResizeObserver(startSimulation);
    resizeObserver.observe(container);
    startSimulation();

    return () => {
      resizeObserver.disconnect();
      disposeSimulation?.();
    };
  }, [reduceMotion, technologies]);

  return (
    <section
      className={cn(
        "absolute inset-0 overflow-hidden",
        className
      )}
      aria-label={`Interactive technology stack: ${stack
        .map((technology) => technology.label)
        .join(", ")}`}
    >
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 touch-none cursor-grab overflow-hidden active:cursor-grabbing",
          reduceMotion &&
            "flex flex-wrap content-end justify-end gap-3 p-4"
        )}
      >
        {stack.map((technology) => {
          const Icon = technology.icon;

          return (
            <div
              key={technology.id}
              data-tech-item
              className={cn(
                "pointer-events-none flex h-12 w-max min-w-28 select-none items-center justify-center gap-2 rounded-lg border px-3 shadow-lg backdrop-blur-xl will-change-transform",
                !reduceMotion && "absolute left-0 top-0",
                isDarkMode
                  ? "border-white/15 bg-black/80 text-white shadow-black/50"
                  : "border-black/15 bg-white/90 text-black shadow-black/15"
              )}
            >
              {technology.imageSrc ? (
                <Image
                  src={technology.imageSrc}
                  alt=""
                  width={170}
                  height={37}
                  style={{ width: "102px", height: "auto" }}
                />
              ) : (
                Icon && (
                  <Icon
                    className="h-5 w-5 shrink-0"
                    style={{ color: technology.color }}
                    aria-hidden="true"
                  />
                )
              )}
              {!technology.imageSrc && (
                <span className="text-xs font-semibold">{technology.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

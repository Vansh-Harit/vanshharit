"use client";

import { useEffect, useState } from "react";

interface PointerCapabilities {
  ready: boolean;
  isCoarsePointer: boolean;
}

export function usePointerCapabilities(): PointerCapabilities {
  const [capabilities, setCapabilities] = useState<PointerCapabilities>({
    ready: false,
    isCoarsePointer: false,
  });

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const updateCapabilities = () => {
      setCapabilities({
        ready: true,
        isCoarsePointer:
          coarsePointer.matches || window.navigator.maxTouchPoints > 0,
      });
    };

    updateCapabilities();
    coarsePointer.addEventListener("change", updateCapabilities);

    return () => {
      coarsePointer.removeEventListener("change", updateCapabilities);
    };
  }, []);

  return capabilities;
}

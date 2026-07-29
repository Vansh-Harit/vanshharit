"use client"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextFlipProps {
  words: string[]
  duration?: number
  className?: string
}

export function TextFlip({
  words,
  duration = 3000,
  className,
}: TextFlipProps) {
  const [index, setIndex] = useState(0)

  // Find longest word to establish container size
  const longestWord = [...words].sort((a, b) => b.length - a.length)[0]

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, duration)
    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <div className={cn("relative inline-block", className)} style={{ perspective: "1000px" }}>
      {/* Invisible placeholder to reserve layout space */}
      <span className="invisible">{longestWord}</span>

      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            exit: { transition: { staggerChildren: 0.05 } }
          }}
          className="absolute left-0 top-0 origin-center whitespace-nowrap text-left flex"
        >
          {words[index].split("").map((char, i) => (
            <motion.span
              key={`${words[index]}-${i}`}
              variants={{
                hidden: { opacity: 0, rotateX: -90 },
                visible: { opacity: 1, rotateX: 0, transition: { duration: 0.4, ease: "easeInOut" } },
                exit: { opacity: 0, rotateX: 90, transition: { duration: 0.4, ease: "easeInOut" } }
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

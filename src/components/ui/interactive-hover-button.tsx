

import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full bg-transparent p-2 px-6 text-center font-medium text-white transition-colors",
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-2 w-2 scale-0 rounded-full bg-black/10 transition-all duration-300 group-hover:scale-[100.8] dark:bg-white/15" />
      </div>
      <div className="flex items-center justify-center">
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute inset-0 z-10 flex h-full w-full translate-x-12 items-center justify-center opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{children}</span>
      </div>
    </button>
  )
}


import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:border-purple-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm focus-visible:shadow-lg focus-visible:shadow-purple-100 min-h-[40px]",
          "dark:bg-slate-800 dark:border-slate-600 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-purple-400 dark:focus-visible:border-purple-400",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

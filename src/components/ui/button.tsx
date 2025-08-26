
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 cursor-pointer relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 dark:from-purple-600 dark:to-purple-700",
        destructive: "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700",
        outline: "border-2 border-purple-400 bg-white/90 backdrop-blur-sm text-purple-700 hover:bg-purple-50 shadow-md hover:shadow-lg font-semibold dark:bg-slate-800/90 dark:text-purple-300 dark:hover:bg-slate-700",
        secondary: "bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700",
        ghost: "hover:bg-purple-100 hover:text-purple-700 shadow-sm font-semibold dark:hover:bg-slate-800 dark:hover:text-purple-300",
        link: "text-purple-600 underline-offset-4 hover:underline font-semibold dark:text-purple-400",
        success: "bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700",
        warning: "bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-2xl px-8 text-lg",
        xs: "h-8 rounded-lg px-3 text-xs [&_svg]:size-4",
        compact: "h-7 rounded-md px-2 text-xs [&_svg]:size-3.5",
        icon: "h-12 w-12",
        "icon-sm": "h-8 w-8 rounded-lg [&_svg]:size-4",
        "icon-xs": "h-7 w-7 rounded-md [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

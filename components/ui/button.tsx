import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gold text-white shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 hover:bg-gold/90 active:scale-[0.97]",
        secondary:
          "border border-gold/30 text-gold bg-transparent hover:bg-gold/10 hover:border-gold/60 active:scale-[0.97]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-600/90 active:scale-[0.97]",
        outline:
          "border border-gray-200 bg-white text-navy hover:border-gold/50 hover:bg-cream active:scale-[0.97]",
        ghost:
          "text-gray-500 hover:text-gold hover:bg-gold/5",
        link:
          "text-gold underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-10 text-base tracking-wider",
        icon: "h-10 w-10",
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

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-base text-body-medium font-primary font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grounded focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-base",
  {
    variants: {
      variant: {
        default: "bg-grounded text-white hover:bg-grounded/90 shadow-base-lg !text-white",
        destructive:
          "bg-red-40 text-white hover:bg-red-80 shadow-base !text-white",
        outline:
          "border border-grounded bg-white text-grounded hover:bg-grounded hover:!text-white",
        secondary:
          "bg-livewire text-grounded hover:bg-livewire/80 shadow-base !text-grounded",
        ghost: "hover:bg-aluminum text-grounded !text-grounded",
        link: "text-grounded underline-offset-4 hover:underline shadow-none !text-grounded",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-base px-4 py-2 text-body-small",
        lg: "h-14 rounded-base-lg px-8 py-4 text-body-large",
        icon: "h-12 w-12",
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

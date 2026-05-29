import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[1.15rem] border border-transparent text-sm font-semibold tracking-[-0.01em] ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_12px_30px_hsl(var(--primary)/0.22)] hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-[0_18px_38px_hsl(var(--primary)/0.28)]",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_10px_24px_hsl(var(--destructive)/0.18)] hover:-translate-y-0.5 hover:bg-destructive/92",
        outline: "border-border/60 bg-background/86 text-foreground shadow-[0_6px_18px_rgba(15,23,42,0.06)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-primary/25 hover:bg-accent/70 hover:text-foreground hover:shadow-[0_12px_26px_rgba(15,23,42,0.10)]",
        secondary: "border-border/50 bg-secondary/88 text-secondary-foreground shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-secondary hover:shadow-[0_14px_28px_rgba(15,23,42,0.10)]",
        ghost: "text-foreground/78 hover:-translate-y-0.5 hover:bg-accent/72 hover:text-foreground",
        link: "h-auto rounded-none border-none p-0 text-primary shadow-none hover:text-primary/80 hover:translate-y-0 hover:underline underline-offset-4"
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-[0.8125rem]",
        lg: "h-12 px-6 text-[0.95rem]",
        icon: "h-11 w-11 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
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

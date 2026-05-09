"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",

        "kk-hamburger":
          "w-10 h-10 p-0 rounded-xl cursor-pointer " +
          "bg-transparent border-none shadow-none " +
          "hover:bg-[rgba(0,99,146,0.06)] " +
          "transition-all duration-200",
        "kk-nav":
          "rounded-full px-3.5 py-2 cursor-pointer bg-transparent border-none " +
          "text-kk-blue text-sm font-medium " +
          "hover:bg-[rgba(0,99,146,0.08)] hover:text-kk-blue-light " +
          "transition-all duration-200",
        "kk-login":
          "rounded-[8px] px-5 py-2.5 ml-1 cursor-pointer " +
          "bg-kk-blue border-none text-kk-beige " +
          "text-sm font-semibold tracking-[0.01em] " +
          "hover:bg-kk-blue-light hover:-translate-y-px " +
          "transition-all duration-200",
        "kk-search-submit":
          "rounded-full h-[46px] px-5 shrink-0 cursor-pointer " +
          "bg-kk-blue border-none text-kk-beige " +
          "text-sm font-semibold tracking-[0.01em] " +
          "hover:bg-kk-blue-light transition-all duration-200",
        "kk-cat":
          "group flex-col gap-0 w-full cursor-pointer rounded-[22px] pt-[20px] pb-[18px] px-4 " +
          "bg-[rgba(255,253,248,0.46)] border-[1.5px] border-[rgba(255,255,255,0.72)] " +
          "shadow-[0_4px_16px_-6px_rgba(6,40,58,0.08)] " +
          "hover:bg-[rgba(255,253,248,0.88)] hover:border-[rgba(0,99,146,0.25)] " +
          "hover:shadow-[0_10px_28px_-8px_rgba(6,40,58,0.18)] " +
          "[&_svg]:!w-auto [&_svg]:!h-auto [&_svg]:!shrink-0 " +
          "relative transition-all duration-300",
        "kk-ghost-link":
          "bg-transparent border-none p-0 cursor-pointer " +
          "gap-1.5 text-[13px] font-semibold " +
          "text-kk-blue-light hover:text-kk-blue " +
          "transition-all duration-200",
        "kk-cta":
          "rounded-[14px] px-7 py-4 shrink-0 cursor-pointer " +
          "bg-kk-beige border-none text-kk-blue " +
          "text-sm font-bold tracking-[0.015em] " +
          "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] " +
          "hover:bg-[#FFFCF3] hover:-translate-y-0.5 " +
          "hover:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.7)] " +
          "transition-all duration-200",
        "kk-feedback-close":
          "w-7 h-7 p-0 rounded-full cursor-pointer border-none " +
          "bg-white/15 text-white " +
          "hover:bg-white/25 transition-colors duration-200",
        "kk-feedback-submit":
          "w-full rounded-xl py-[10px] cursor-pointer border-none " +
          "bg-kk-blue-light text-white text-[13px] font-semibold " +
          "hover:bg-[#005580] " +
          "disabled:bg-[#c0c0c0] disabled:cursor-not-allowed disabled:opacity-100 " +
          "transition-colors duration-200",
        "kk-feedback-trigger":
          "rounded-full px-[18px] py-3 cursor-pointer border-none " +
          "bg-kk-blue-light text-white text-[13px] font-semibold " +
          "shadow-[0_4px_20px_rgba(0,99,146,0.35)] " +
          "hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,99,146,0.4)] " +
          "transition-all duration-200",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        unsized: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import * as PopoverPrimitive from "@radix-ui/react-popover"


import { cn } from "@/lib/utils"

const HoverClickCard = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>
>(({ children, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (!isHovered) {
        setIsOpen(false)
      }
    } else {
      setIsOpen(true)
    }
  }

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <HoverCardPrimitive.Root
        open={isOpen}
        onOpenChange={(open) => {
          setIsHovered(open)
          if (open) setIsOpen(true)
        }}
        {...props}
      >
        {children}
      </HoverCardPrimitive.Root>
    </PopoverPrimitive.Root>
  )
})
HoverClickCard.displayName = "HoverClickCard"

const HoverClickCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>
>(({ ...props }, ref) => (
  <PopoverPrimitive.Trigger asChild>
    <HoverCardPrimitive.Trigger ref={ref} {...props} />
  </PopoverPrimitive.Trigger>
))
HoverClickCardTrigger.displayName = "HoverClickCardTrigger"

const HoverClickCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Content asChild>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Content>
))
HoverClickCardContent.displayName = "HoverClickCardContent"

export { HoverClickCard, HoverClickCardTrigger, HoverClickCardContent }
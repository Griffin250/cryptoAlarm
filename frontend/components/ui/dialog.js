import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const dialogVariants = cva(
  "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Dialog = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(dialogVariants(), className)}
    {...props}
  />
))
Dialog.displayName = "Dialog"

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
    {children}
  </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-300",
        {
          "bg-amber-500": (value || 0) > 0 && (value || 0) < 30,
          "bg-blue-500": (value || 0) >= 30 && (value || 0) < 70,
          "bg-emerald-500": (value || 0) >= 70 && (value || 0) < 100,
          "bg-green-500": (value || 0) >= 100,
          "bg-muted/30": (value || 0) === 0 // Light visible background for 0%
        }
      )}
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        // Show full width but with reduced opacity when at 0%
        width: (value || 0) === 0 ? '100%' : undefined,
        opacity: (value || 0) === 0 ? 0.5 : 1
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

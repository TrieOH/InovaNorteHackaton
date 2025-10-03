import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface InputWithIconProps extends React.ComponentProps<"input"> {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, iconPosition = "left", ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {iconPosition === "left" && (
          <div className="absolute left-3 text-muted-foreground">{icon}</div>
        )}
        <Input
          className={cn(
          iconPosition === "left" ? "pl-11" : "pr-11",
          className
          )}
          ref={ref}
          {...props}
        />
        {iconPosition === "right" && (
          <div className="absolute right-3 text-muted-foreground">{icon}</div>
        )}
      </div>
    )
  }
)

InputWithIcon.displayName = "InputWithIcon";
export { InputWithIcon }
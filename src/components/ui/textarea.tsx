
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSelect?: (start: number, end: number, text: string) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onSelect, onPaste, onKeyDown, ...props }, ref) => {
    const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      if (onSelect) {
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        const text = target.value.substring(start, end);
        onSelect(start, end, text);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (onPaste) {
        onPaste(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onSelect={handleSelect}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

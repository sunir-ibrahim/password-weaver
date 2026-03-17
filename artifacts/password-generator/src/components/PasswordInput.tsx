import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, Trash2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  index: number;
}

export function PasswordInput({ value, onChange, onRemove, placeholder, index }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <KeyRound className="h-5 w-5" />
      </div>
      
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Previous Password ${index + 1}`}
        className={cn(
          "w-full py-4 pl-12 pr-24 rounded-xl glass-input text-foreground font-mono",
          "placeholder:text-muted-foreground/50 placeholder:font-sans",
          "focus:outline-none"
        )}
      />
      
      <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/50 transition-colors"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
            tabIndex={-1}
            aria-label="Remove password"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Decorative focus glow */}
      <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
    </div>
  );
}

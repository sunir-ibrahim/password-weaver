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
      {/* Decorative corner accents */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary/50 group-focus-within:border-primary transition-colors" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary/50 group-focus-within:border-primary transition-colors" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary/50 group-focus-within:border-primary transition-colors" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary/50 group-focus-within:border-primary transition-colors" />
      
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <div className="text-primary/70 group-focus-within:text-primary transition-colors">
          <KeyRound className="h-5 w-5" />
        </div>
      </div>
      
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Previous Password ${index + 1}`}
        className={cn(
          "w-full py-4 pl-12 pr-24 rounded-xl bg-background/40 backdrop-blur-sm border border-border/40",
          "text-foreground font-mono text-lg placeholder:text-muted-foreground/40 placeholder:font-sans",
          "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:bg-background/60 transition-all duration-300"
        )}
      />
      
      <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
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
      
      {/* Neon glow effect */}
      <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
    </div>
  );
}

import React, { useState } from "react";
import { Copy, Check, ShieldCheck, EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { PasswordSuggestion } from "@workspace/api-client-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SuggestionCardProps {
  suggestion: PasswordSuggestion;
  index: number;
}

const strengthConfig = {
  weak: { label: "Weak", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", glow: "shadow-red-500/20" },
  fair: { label: "Fair", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", glow: "shadow-yellow-500/20" },
  strong: { label: "Strong", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", glow: "shadow-green-500/20" },
  very_strong: { label: "Very Strong", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", glow: "shadow-cyan-500/20" },
};

export function SuggestionCard({ suggestion, index }: SuggestionCardProps) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const config = strengthConfig[suggestion.strength];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggestion.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative group p-6 rounded-2xl bg-background/40 backdrop-blur-sm border transition-all duration-500 overflow-hidden",
        config.border, "hover:border-primary/40"
      )}
    >
      {/* Animated background gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10",
        "bg-gradient-to-br from-transparent via-primary/5 to-transparent"
      )} />
      
      {/* Corner accents */}
      <div className={cn("absolute -top-0.5 -left-0.5 w-4 h-0.5 bg-primary/30 group-hover:bg-primary transition-colors duration-300")} />
      <div className={cn("absolute -top-0.5 -right-0.5 w-4 h-0.5 bg-primary/30 group-hover:bg-primary transition-colors duration-300")} />
      <div className={cn("absolute -bottom-0.5 -left-0.5 w-4 h-0.5 bg-primary/30 group-hover:bg-primary transition-colors duration-300")} />
      <div className={cn("absolute -bottom-0.5 -right-0.5 w-4 h-0.5 bg-primary/30 group-hover:bg-primary transition-colors duration-300")} />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn(
              "px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md border",
              config.color, config.bg, config.border
            )}>
              {config.label}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group/pwd">
              <span className="font-mono text-2xl md:text-3xl text-foreground font-bold tracking-tight">
                {show ? suggestion.password : "•".repeat(Math.min(suggestion.password.length, 12))}
              </span>
            </div>
            
            <button
              onClick={() => setShow(!show)}
              className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
              title={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            <button
              onClick={handleCopy}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/30">
        <div>
          <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2", config.color)}>
            <ShieldCheck className="w-4 h-4" />
            Security Profile
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {suggestion.strengthNote}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="w-4 h-4 text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
            Memorability
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {suggestion.memorabilityNote}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

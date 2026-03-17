import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Plus, Sparkles, AlertCircle } from "lucide-react";
import { useGeneratePasswords } from "@/hooks/use-passwords";
import { PasswordInput } from "@/components/PasswordInput";
import { SuggestionCard } from "@/components/SuggestionCard";
import type { GeneratePasswordsResponse } from "@workspace/api-client-react";

const LOADING_MESSAGES = [
  "Initializing neural pathways...",
  "Analyzing pattern entropy...",
  "Calculating memorability index...",
  "Generating secure alternatives...",
  "Finalizing cryptographic strength..."
];

export default function Home() {
  const [passwords, setPasswords] = useState<string[]>([""]);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const { mutate, isPending, data, error } = useGeneratePasswords();

  useEffect(() => {
    if (isPending) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [isPending]);

  const updatePassword = (index: number, val: string) => {
    const newPass = [...passwords];
    newPass[index] = val;
    setPasswords(newPass);
  };

  const addInput = () => {
    if (passwords.length < 3) {
      setPasswords([...passwords, ""]);
    }
  };

  const removeInput = (index: number) => {
    const newPass = passwords.filter((_, i) => i !== index);
    if (newPass.length === 0) newPass.push("");
    setPasswords(newPass);
  };

  const handleGenerate = () => {
    const validPasswords = passwords.filter(p => p.trim().length > 0);
    if (validPasswords.length === 0) return;
    mutate({ data: { previousPasswords: validPasswords } });
  };

  const hasResults = !!data?.suggestions?.length;
  const isFormValid = passwords.some(p => p.trim().length > 0);

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-24">
      {/* Background Hero Image & Gradients */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        <img 
          src={`${import.meta.env.BASE_URL}images/cyber-bg.png`}
          alt="Cyber Background" 
          className="w-full h-[60vh] object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background to-background" />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AI-Powered Security</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-glow"
          >
            Smart Password Generator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Enter up to 3 of your current passwords. Our AI analyzes your patterns to generate 
            new passwords that are mathematically strong but easy for <em className="text-foreground font-semibold not-italic">you</em> to remember.
          </motion.p>
        </div>

        <div className={`grid gap-12 lg:gap-16 items-start transition-all duration-700 ${hasResults ? 'lg:grid-cols-12' : 'max-w-2xl mx-auto'}`}>
          
          {/* Form Column */}
          <motion.div 
            layout="position"
            className={hasResults ? "lg:col-span-5" : ""}
          >
            <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold mb-2">Input Patterns</h2>
                  <p className="text-sm text-muted-foreground">Provide passwords you currently use to seed the analysis.</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <AnimatePresence initial={false}>
                  {passwords.map((pwd, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PasswordInput
                        index={i}
                        value={pwd}
                        onChange={(v) => updatePassword(i, v)}
                        onRemove={passwords.length > 1 ? () => removeInput(i) : undefined}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {passwords.length < 3 && (
                  <button
                    onClick={addInput}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Add another password (max 3)
                  </button>
                )}
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 flex items-start gap-3 mb-8 border border-border/50">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground block mb-1">Total Privacy Guarantee</strong>
                  Passwords entered are sent securely for instant analysis and are <strong className="text-red-400">never</strong> stored, logged, or cached in any database.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!isFormValid || isPending}
                className="w-full relative group overflow-hidden px-6 py-4 rounded-xl font-bold text-lg bg-primary text-primary-foreground shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:shadow-[0_0_60px_-15px_hsl(var(--primary))] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                
                <span className="relative z-20 flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Analyzing Patterns...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Smart Passwords
                    </>
                  )}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Results Column */}
          {(hasResults || isPending) && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 space-y-6"
            >
              {isPending ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-panel rounded-3xl border border-primary/20 p-8">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                    <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-lg font-mono text-primary text-center"
                    >
                      {LOADING_MESSAGES[loadingStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              ) : (
                data && (
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-24 h-24" />
                      </div>
                      <h3 className="text-primary font-bold mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Pattern Analysis
                      </h3>
                      <p className="text-foreground/90 leading-relaxed text-sm md:text-base relative z-10">
                        {data.analysisNote}
                      </p>
                    </motion.div>

                    <div className="space-y-4">
                      {data.suggestions.map((suggestion, i) => (
                        <SuggestionCard key={i} suggestion={suggestion} index={i} />
                      ))}
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}

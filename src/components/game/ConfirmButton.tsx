"use client";

import { motion } from "framer-motion";

interface ConfirmButtonProps {
  readonly onClick: () => void;
  readonly disabled: boolean;
  readonly isLoading: boolean;
}

export function ConfirmButton({ onClick, disabled, isLoading }: ConfirmButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#B45309] via-accent to-[#F97316] px-8 py-4 font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-wide text-white shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:shadow-accent/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:w-auto sm:min-w-[200px]"
      whileHover={!disabled ? { scale: 1.03 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      animate={
        !disabled && !isLoading
          ? {
              boxShadow: [
                "0 4px 14px rgba(217, 119, 6, 0.3)",
                "0 8px 28px rgba(217, 119, 6, 0.5)",
                "0 4px 14px rgba(217, 119, 6, 0.3)",
              ],
            }
          : undefined
      }
      transition={
        !disabled && !isLoading
          ? { boxShadow: { duration: 2, repeat: Infinity } }
          : undefined
      }
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Enviando...
        </span>
      ) : (
        "Enviar"
      )}
    </motion.button>
  );
}

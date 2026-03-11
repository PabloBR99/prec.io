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
      className="relative w-full rounded-xl bg-accent px-8 py-4 text-lg font-bold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:min-w-[200px]"
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      animate={
        !disabled && !isLoading
          ? {
              boxShadow: [
                "0 4px 14px rgba(233, 69, 96, 0.25)",
                "0 4px 20px rgba(233, 69, 96, 0.4)",
                "0 4px 14px rgba(233, 69, 96, 0.25)",
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

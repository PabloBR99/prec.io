"use client";

import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 py-4 sm:px-6">
      <span className="relative bg-gradient-to-r from-[#92400E] via-accent to-[#F97316] bg-clip-text font-[family-name:var(--font-space-grotesk)] text-3xl font-extrabold tracking-tight text-transparent drop-shadow-sm dark:from-[#FCD34D] dark:via-accent dark:to-[#FB923C] sm:text-4xl">
        prec.io
      </span>
      <button
        onClick={toggleTheme}
        className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-1.5 text-foreground/50 transition-all hover:bg-foreground/[0.06] hover:text-foreground/70"
        aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
      >
        {theme === "dark" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        <span className="text-[11px] font-medium">{theme === "dark" ? "Claro" : "Oscuro"}</span>
      </button>
    </header>
  );
}

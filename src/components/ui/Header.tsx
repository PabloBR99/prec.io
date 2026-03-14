interface HeaderProps {
  readonly dayNumber?: number;
}

export function Header({ dayNumber }: HeaderProps) {
  return (
    <header className="flex items-center justify-center px-4 py-4 sm:px-6">
      <div className="flex items-baseline gap-1.5">
        <span className="relative bg-gradient-to-r from-[#92400E] via-accent to-[#F97316] bg-clip-text font-[family-name:var(--font-space-grotesk)] text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-5xl">
          prec.io
        </span>
        {dayNumber != null && (
          <span className="font-[family-name:var(--font-space-grotesk)] text-4xl font-extrabold text-yellow-400 sm:text-5xl">
            #{dayNumber}
          </span>
        )}
      </div>
    </header>
  );
}

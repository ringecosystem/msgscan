import { cn } from '@/lib/utils';

interface SectionLabelProps {
  className?: string;
  children: React.ReactNode;
}

export function SectionLabel({ className, children }: SectionLabelProps) {
  return (
    <h3
      className={cn(
        'text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground',
        className
      )}
    >
      {children}
    </h3>
  );
}

interface DetailRowProps {
  label: string;
  className?: string;
  children: React.ReactNode;
}

export function DetailRow({ label, className, children }: DetailRowProps) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between border-b border-border/30 py-2 sm:py-2.5 text-[13px] last:border-b-0',
        'max-sm:flex-col max-sm:items-start max-sm:gap-0.5',
        className
      )}
    >
      <span className="min-w-[90px] shrink-0 font-medium text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 sm:text-right">
        {children}
      </div>
    </div>
  );
}

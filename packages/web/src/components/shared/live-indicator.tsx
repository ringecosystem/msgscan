import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  className?: string;
}

export default function LiveIndicator({ className }: LiveIndicatorProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      Live
    </span>
  );
}

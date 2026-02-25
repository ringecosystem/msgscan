'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { toShortText } from '@/utils';
import { CodeFont } from '@/config/font';
import { cn } from '@/lib/utils';

interface DetailHeaderProps {
  msgId?: string;
}

export default function DetailHeader({ msgId }: DetailHeaderProps) {
  const searchParams = useSearchParams();
  const network = searchParams.get('network');
  const backHref = network ? `/?network=${network}` : '/';

  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Messages
      </Link>
      <div className="flex flex-col gap-0.5 sm:items-end">
        <h1 className="text-xl font-bold tracking-tight md:text-[22px]">Message Detail</h1>
        {msgId && (
          <span
            className={cn('text-xs text-muted-foreground truncate max-w-[200px]', CodeFont.className)}
            title={msgId}
          >
            {toShortText({ text: msgId, frontLength: 10, backLength: 4 })}
          </span>
        )}
      </div>
    </div>
  );
}

'use client';

import ErrorDisplay from '@/components/error-display';
import { Button } from '@/components/ui/button';

interface MessageDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MessageDetailError({ reset }: MessageDetailErrorProps) {
  return (
    <div
      className="flex w-full items-center justify-center px-4"
      style={{
        minHeight: 'calc(100vh - var(--header-height) - var(--footer-height))'
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <ErrorDisplay
          title="Message detail failed"
          svgPath="/images/common/500.svg"
          svgPathLight="/images/common/500-light.svg"
          description="Unable to load message detail. Please try again."
        />
        <Button type="button" variant="outline" onClick={reset}>
          Retry
        </Button>
      </div>
    </div>
  );
}

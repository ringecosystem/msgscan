'use client';

import ErrorDisplay from '@/components/error-display';
import { Button } from '@/components/ui/button';

interface ErrorComponentProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorComponent = ({ reset }: ErrorComponentProps) => {
  return (
    <div
      className="flex w-full items-center justify-center px-4"
      style={{
        height: 'calc(100vh - var(--header-height) - var(--footer-height))'
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <ErrorDisplay
          title="500 Server error"
          svgPath="/images/common/500.svg"
          svgPathLight="/images/common/500-light.svg"
          description="Sorry, something went wrong on our server. Please try again later."
        />
        <Button type="button" variant="outline" onClick={reset}>
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorComponent;

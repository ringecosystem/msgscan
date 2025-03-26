'use client';

import ErrorDisplay from '@/components/error-display';

const ErrorComponent = () => {
  return (
    <div
      className="flex w-full items-center justify-center"
      style={{
        height: 'calc(100vh - var(--header-height) - var(--footer-height))'
      }}
    >
      <ErrorDisplay
        title="500 Server error"
        svgPath="/images/common/500.svg"
        svgPathLight="/images/common/500-light.svg"
        description="Sorry, something went wrong on our server. Please try again later."
      />
    </div>
  );
};

export default ErrorComponent;

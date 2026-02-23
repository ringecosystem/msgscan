import Link from 'next/link';

import ErrorDisplay from '@/components/error-display';
import { buttonVariants } from '@/components/ui/button-variants';

const NotFound = () => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-6"
      style={{
        height: 'calc(100vh - var(--header-height) - var(--footer-height))'
      }}
    >
      <ErrorDisplay
        title="404 Page not found"
        svgPath="/images/common/404.svg"
        svgPathLight="/images/common/404-light.svg"
        description="This page doesn't exist."
      />
      <Link href="/" className={buttonVariants({ variant: 'outline' })}>
        Back Home
      </Link>
    </div>
  );
};

export default NotFound;

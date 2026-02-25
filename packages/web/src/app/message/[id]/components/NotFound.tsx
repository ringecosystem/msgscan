'use client';

import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button-variants';
import { useNetworkFromQuery } from '@/hooks/useNetwork';
import ErrorDisplay from '@/components/error-display';
import { cn } from '@/lib/utils';

const NotFound = () => {
  const network = useNetworkFromQuery();

  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-6"
      style={{ minHeight: 'calc(100vh - var(--header-height) - var(--footer-height))' }}
    >
      <ErrorDisplay
        title="Message Not Found"
        svgPath="/images/common/404.svg"
        svgPathLight="/images/common/404-light.svg"
        description="We couldn't find this message. It may not be indexed yet, or may not exist on the selected network."
      />
      <Link href={`/?network=${network}`} className={cn(buttonVariants({ variant: 'outline' }), 'px-4')}>
        Back Home
      </Link>
    </div>
  );
};

export default NotFound;

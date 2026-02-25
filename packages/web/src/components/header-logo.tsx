'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { APP_NAME } from '@/config/site';
import { useNetworkFromQuery } from '@/hooks/useNetwork';

import Logo from './icon/logo';

const HeaderLogo = () => {
  const network = useNetworkFromQuery();
  return (
    <Link href={`/?network=${network}`}>
      <Image
        src="/images/logo.svg"
        alt={APP_NAME}
        width={147}
        priority
        height={26}
        className="hidden lg:block"
      />
      <Logo className="block text-foreground lg:hidden" />
    </Link>
  );
};

const HeaderLogoWrapper = () => {
  return (
    <Suspense fallback={<div className="h-[26px] w-[90px] animate-pulse rounded-md bg-muted lg:w-[147px]" />}>
      <HeaderLogo />
    </Suspense>
  );
};

export default HeaderLogoWrapper;

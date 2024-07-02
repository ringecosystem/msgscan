'use client';
import Image from 'next/image';
import Link from 'next/link';

import { APP_NAME } from '@/config/site';
import { useNetworkFromQuery } from '@/hooks/useNetwork';

import Logo from './icon/logo';
import { Suspense } from 'react';

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
      <Logo className="block text-foreground dark:text-[#F2F3F5] lg:hidden" />
    </Link>
  );
};

const HeaderLogoWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeaderLogo />
    </Suspense>
  );
};

export default HeaderLogoWrapper;

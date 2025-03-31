import React from 'react';
import Image from 'next/image';
import { capitalize } from 'lodash-es';

import { dappRemark } from '@/config/dapp_remark';
import { getDAppInfo } from '@/utils/dapp';
import { cn } from '@/lib/utils';

interface AddressDisplayFilterDappRemarkProps {
  address: string;
  formatAddress?: (address: string) => string;
  className?: string;
}
const AddressDisplayFilterDappRemark = ({
  address,
  formatAddress,
  className,
  children
}: React.PropsWithChildren<AddressDisplayFilterDappRemarkProps>) => {
  const { dappLogo, dappName } = getDAppInfo(address);

  const { width, height } = dappName
    ? dappRemark[dappName as keyof typeof dappRemark]
    : { width: 35, height: 20 };
  const displayAddress = formatAddress ? formatAddress(address) : address;

  return dappName && dappLogo ? (
    <span className={cn('flex items-center gap-[0.31rem]', className)}>
      <Image src={dappLogo} width={width} height={height} alt={`${capitalize(dappName)}`} />
      <span>{capitalize(dappName)}</span>
      {children}
    </span>
  ) : (
    displayAddress
  );
};

export default AddressDisplayFilterDappRemark;

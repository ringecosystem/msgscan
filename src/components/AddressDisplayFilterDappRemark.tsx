import React from 'react';
import Image from 'next/image';
import { capitalize } from 'lodash-es';
import { dappRemark } from '@/config/dapp_remark';
import { getDAppInfo } from '@/utils/dapp';

interface AddressDisplayFilterDappRemarkProps {
  address: string;
  formatAddress?: (address: string) => string;
}
const AddressDisplayFilterDappRemark = ({
  address,
  formatAddress,
  children
}: React.PropsWithChildren<AddressDisplayFilterDappRemarkProps>) => {
  const { dappLogo, dappName } = getDAppInfo(address);

  const { width, height } = dappName
    ? dappRemark[dappName as keyof typeof dappRemark]
    : { width: 35, height: 20 };
  const displayAddress = formatAddress ? formatAddress(address) : address;

  return dappName && dappLogo ? (
    <span className="flex items-center gap-[0.31rem]">
      <Image src={dappLogo} width={width} height={height} alt={`${capitalize(dappName)}`} />
      <span>{capitalize(dappName)}</span>
      {children}
    </span>
  ) : (
    displayAddress
  );
};

export default AddressDisplayFilterDappRemark;

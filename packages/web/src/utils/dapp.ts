import { dapps } from '@/config/dapps';

import type { TableFilterOption } from '@/types/helper';

type DAppConfig = typeof dapps;
export type DAppConfigKeys = keyof DAppConfig;

function normalizeAddress(value: string): string {
  return value.trim().toLowerCase();
}

const dappAddressToKey = new Map<string, DAppConfigKeys>();
Object.entries(dapps).forEach(([key, addresses]) => {
  (addresses as readonly string[]).forEach((address) => {
    dappAddressToKey.set(normalizeAddress(address), key as DAppConfigKeys);
  });
});

export const capitalizeText = (value: string) => {
  if (!value) return '';
  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
};

export const getDappOptions = (): TableFilterOption[] => {
  return Object.keys(dapps)?.map((dapp) => ({
    label: capitalizeText(dapp),
    value: dapp
  }));
};

export const getDAppInfo = (
  address?: string
): {
  dappName: string | null;
  dappLogo: string | null;
} => {
  if (!address) return { dappName: null, dappLogo: null };
  const dappKey = dappAddressToKey.get(normalizeAddress(address));
  if (!dappKey) return { dappName: null, dappLogo: null };
  const dappLogo = `/images/dapp_remark/${dappKey}.svg`;
  return { dappName: dappKey, dappLogo };
};

export function getDappAddresses(address?: string) {
  if (!address) return undefined;
  const dappKey = dappAddressToKey.get(normalizeAddress(address));
  if (!dappKey) return undefined;
  return dapps[dappKey] as unknown as string[];
}

export function getAllDappAddressByKeys(keys: DAppConfigKeys[]) {
  let addresses: string[] = [];
  keys.forEach((key) => {
    if (dapps[key]) {
      addresses = addresses.concat(dapps[key]);
    }
  });
  return addresses;
}

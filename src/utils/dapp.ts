import dappConfig from '@/dappRemark/config.json';

export const getDAppInfo = (
  address?: string
): {
  dappName: string | null;
  dappLogo: string | null;
} => {
  if (!address) return { dappName: null, dappLogo: null };
  for (const [key, addresses] of Object.entries(dappConfig)) {
    if (addresses.includes(address)) {
      const dappName = key;
      const dappLogo = `/images/dapp_remark/${key}.svg`;
      return { dappName, dappLogo };
    }
  }
  return { dappName: null, dappLogo: null };
};

export function getDappAddresses(address?: string) {
  if (!address) return undefined;
  for (const addresses of Object.values(dappConfig)) {
    if (addresses.includes(address)) {
      return addresses;
    }
  }
  return undefined;
}

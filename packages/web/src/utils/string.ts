interface ShortTextOptions {
  text?: string;
  frontLength: number;
  backLength: number;
}
export function toShortText({ text, frontLength, backLength }: ShortTextOptions): string {
  if (typeof text !== 'string') {
    return '';
  }

  if (text.length > frontLength + backLength) {
    return `${text.slice(0, frontLength)}...${text.slice(-backLength)}`;
  } else {
    return text;
  }
}

/** Standard short-form params for Ethereum addresses: 0x1234…5678 */
export const ADDRESS_SHORT = { frontLength: 6, backLength: 4 } as const;

/** Standard short-form params for message IDs: 0x1234567890…5678 */
export const MSG_ID_SHORT = { frontLength: 10, backLength: 4 } as const;

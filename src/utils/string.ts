import { isString } from 'lodash-es';

interface ShortTextOptions {
  text?: string;
  frontLength: number;
  backLength: number;
}
export function toShortText({ text, frontLength, backLength }: ShortTextOptions): string {
  if (!isString(text)) {
    return '';
  }

  if (text.length > frontLength + backLength) {
    return `${text.slice(0, frontLength)}...${text.slice(-backLength)}`;
  } else {
    return text;
  }
}

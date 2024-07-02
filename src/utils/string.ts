import { isString } from 'lodash-es';

export function toShortText(text: any, frontLength: number, backLength: number): string {
  if (!isString(text)) {
    return '';
  }

  if (text.length > frontLength + backLength) {
    return `${text.slice(0, frontLength)}...${text.slice(-backLength)}`;
  } else {
    return text;
  }
}

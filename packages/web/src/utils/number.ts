import { isNaN } from 'lodash-es';

export const formatNumber = (value: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Converts a potentially undefined or string value to a number.
 * Returns 0 if the value is undefined or cannot be converted to a valid number.
 *
 * @param value - The value to convert, which can be number, string, or undefined.
 * @returns The numeric representation of the input, or 0 if conversion is not possible.
 */
export const convertToNumber = (value: number | string | undefined = 0): number => {
  if (value === undefined) {
    return 0;
  }

  const numberValue = Number(value);
  return isNaN(numberValue) ? 0 : numberValue;
};

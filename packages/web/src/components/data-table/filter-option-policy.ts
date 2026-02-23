export const MULTISELECT_ALL_THRESHOLD = 6;

export function shouldShowAllOption(optionsCount: number): boolean {
  return optionsCount >= MULTISELECT_ALL_THRESHOLD;
}

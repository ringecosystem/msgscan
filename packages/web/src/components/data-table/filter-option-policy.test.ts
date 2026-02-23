import { describe, expect, it } from 'vitest';

import { MULTISELECT_ALL_THRESHOLD, shouldShowAllOption } from './filter-option-policy';

describe('filter-option-policy', () => {
  it('hides All option below threshold', () => {
    expect(shouldShowAllOption(MULTISELECT_ALL_THRESHOLD - 1)).toBe(false);
  });

  it('shows All option at threshold', () => {
    expect(shouldShowAllOption(MULTISELECT_ALL_THRESHOLD)).toBe(true);
  });

  it('shows All option above threshold', () => {
    expect(shouldShowAllOption(MULTISELECT_ALL_THRESHOLD + 3)).toBe(true);
  });
});

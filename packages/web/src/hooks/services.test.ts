import { describe, expect, it } from 'vitest';

import { buildMessagesPlaceholder } from './services';

describe('buildMessagesPlaceholder', () => {
  it('uses prefixed placeholder ids to avoid collisions with real message ids', () => {
    const rows = buildMessagesPlaceholder(3);

    expect(rows.map((row) => row.msgId)).toEqual([
      'placeholder-0',
      'placeholder-1',
      'placeholder-2'
    ]);
    expect(rows.map((row) => row.sent.msgId)).toEqual([
      'placeholder-0',
      'placeholder-1',
      'placeholder-2'
    ]);
  });
});

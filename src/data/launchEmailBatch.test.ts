import { expect, it } from 'vitest';
import { launchEmailBatchLimit } from '../../supabase/functions/_shared/launchEmailBatch';

it('uses groups of 300 and never exceeds 300 recipients per batch', () => {
  expect(launchEmailBatchLimit(undefined)).toBe(300);
  expect(launchEmailBatchLimit(300)).toBe(300);
  expect(launchEmailBatchLimit(600)).toBe(300);
  expect(launchEmailBatchLimit(20)).toBe(20);
});
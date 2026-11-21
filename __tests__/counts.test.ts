/**
 * Count reconciliation — the demo chain must add up end to end:
 * 5,000 placed → 4,990 after DOA → 4,870 after mortality → 4,870 loaded
 * → 4,850 at the plant → 4,800 packs. Pure logic, no native modules.
 *
 * @format
 */

import { createDemoData } from '../src/data/demoData';
import { reconcileBatch, reconcileWarnings } from '../src/utils/counts';

const demoData = createDemoData();
const demoBatch = demoData.batches[0];
const demoBatch2 = demoData.batches[1];

test('demo batch reconciles from 5,000 chicks to 4,800 packs', () => {
  const steps = reconcileBatch(demoBatch);
  expect(steps[0].count).toBe(5000);
  expect(steps[steps.length - 1].count).toBe(4800);
  expect(reconcileWarnings(demoBatch)).toEqual([]);
});

test('second demo batch reconciles from 3,000 chicks to 2,900 packs', () => {
  const steps = reconcileBatch(demoBatch2);
  expect(steps[0].count).toBe(3000);
  expect(steps[steps.length - 1].count).toBe(2900);
  expect(reconcileWarnings(demoBatch2)).toEqual([]);
});

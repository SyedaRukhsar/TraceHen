// Count reconciliation — ALL count math in the app goes through here.
// The chain must add up end to end; every change carries a named reason.

import type { Batch } from '../types/models';

export interface ReconciliationStep {
  label: string;
  count: number;
  /** Signed change from the previous step, when there is one. */
  delta?: number;
  reason?: string;
}

/** The canonical 5,000 → 4,800 chain for a batch. */
export function reconcileBatch(batch: Batch): ReconciliationStep[] {
  return [
    { label: 'Chicks placed', count: batch.placed },
    {
      label: 'Dead on arrival',
      count: batch.placed - batch.doa,
      delta: -batch.doa,
      reason: 'Dead on arrival (DOA)',
    },
    {
      label: 'Mortality during rearing',
      count: batch.placed - batch.doa - batch.deaths,
      delta: -batch.deaths,
      reason: 'Mortality during rearing',
    },
    {
      label: 'Loaded for transport',
      count: batch.loaded,
    },
    {
      label: 'Received at plant',
      count: batch.atPlant,
      delta: batch.atPlant - batch.loaded,
      reason: 'Transit loss',
    },
    {
      label: 'Packs produced',
      count: batch.packs,
      delta: batch.packs - batch.atPlant,
      reason: 'Processing rejects',
    },
  ];
}

/**
 * Soft warnings when the numbers do not add up. Warnings are information
 * only — they NEVER block saving an entry (entries-only rule).
 */
export function reconcileWarnings(batch: Batch): string[] {
  const warnings: string[] = [];
  if (batch.loaded !== batch.placed - batch.doa - batch.deaths) {
    warnings.push(
      `Loaded count (${batch.loaded}) does not match placed minus DOA and mortality.`,
    );
  }
  if (batch.atPlant > batch.loaded) {
    warnings.push('Birds received at the plant exceed birds loaded.');
  }
  if (batch.packs > batch.atPlant) {
    warnings.push('Packs produced exceed birds received at the plant.');
  }
  return warnings;
}

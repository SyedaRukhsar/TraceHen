// Soft validation — returns warnings only.
// The TraceHen rule is ENTRIES ONLY: a warning is shown, it NEVER blocks
// saving an entry. No function in this file throws or rejects a save.

export interface EntryDraft {
  title?: string;
  detail?: string;
  count?: number;
  reason?: string;
}

/** Warnings for a new chain entry draft. Empty array = no concerns. */
export function validateEntryDraft(draft: EntryDraft): string[] {
  const warnings: string[] = [];
  if (!draft.title || draft.title.trim().length === 0) {
    warnings.push('Add a short title so the entry is easy to find later.');
  }
  if (draft.count !== undefined && draft.count < 0) {
    warnings.push('Count is negative — please double-check the number.');
  }
  if (
    draft.count !== undefined &&
    draft.count !== 0 &&
    (!draft.reason || draft.reason.trim().length === 0)
  ) {
    warnings.push('A count changed — add the reason so the chain stays clear.');
  }
  return warnings;
}

/** Warning when a received count differs from the count that was sent. */
export function countMismatchWarning(sent: number, received: number): string | null {
  if (sent === received) return null;
  const diff = sent - received;
  return `Received ${diff} fewer than sent. Both numbers are saved in the record.`;
}

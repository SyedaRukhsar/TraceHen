// Mart pack-state logic — a direct port of the per-pack rules in
// modules/mart.js (packState / stockCounts / packIdFor / acceptedCount /
// shipLabel / packPill / findPack). Screens read demo data through
// useApp().data and call these helpers; no screen re-implements the rules.
//
// Pack overrides (Mark Sold / Withdraw) live in a session-only in-memory
// map, exactly like mart.js `packOverrides`: a reload resets them. A
// withdraw is never written into the Consumer scan dataset (a withdraw
// does not change a scan verdict; pre-seeded withdrawn packs already scan
// as "Withdrawn at Mart — Damaged").
//
// Seeded history: the store seeds per-user notifications/activity empty for
// demo users (only Admin is seeded); the demo seeds live in
// data.notifications.mart / data.activity.mart. mergeHistory() layers the
// store's runtime items over those seeds, deduped by title + subtitle, so
// the demo lists render exactly like the HTML while a new user's lists
// stay empty. The seed notifications count as unread until the
// Notifications screen is opened once in the session (mirrors mart.js:
// the bell click sets notifUnread = 0).

import type { Shipment } from '../../types/models';

export const DEMO_TODAY = '09 Dec 2026';
export const MART_NAME = 'Imtiaz Mega Mart — Faisalabad';

export type PackStatus = 'AVAILABLE' | 'SOLD' | 'WITHDRAWN' | 'REJECTED';

export interface PackState {
  status: PackStatus;
  reason?: string;
  date?: string;
}

export function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function pad4(n: number): string {
  return ('0000' + n).slice(-4);
}

export function packIdFor(sh: Shipment, i: number): string {
  return 'PACK-' + sh.batch.slice(4) + '-' + pad4(i);
}

export function packRange(sh: Shipment): string {
  return packIdFor(sh, 1) + ' – ' + packIdFor(sh, sh.packsSent);
}

export function acceptedCount(sh: Shipment): number {
  return sh.receipt ? Math.max(0, sh.receipt.received - sh.receipt.damaged) : 0;
}

const overrides: Record<string, PackState> = {};

export function getPackOverride(id: string): PackState | undefined {
  return overrides[id];
}

export function setPackOverride(id: string, state: PackState): void {
  overrides[id] = state;
}

/** Mirrors mart.js packState: seeded demo states for DISP-102A (120 sold,
 *  3 withdrawn damaged), receipt arithmetic for any shipment, and the
 *  mart's own actions (overrides) on top. */
export function packStateFor(sh: Shipment, i: number): PackState | null {
  const id = packIdFor(sh, i);
  const over = overrides[id];
  if (over) {
    return over;
  }
  if (!sh.receipt) {
    return null;
  }
  if (i > sh.receipt.received) {
    return null;
  }
  if (i > acceptedCount(sh)) {
    return {
      status: 'REJECTED',
      reason: sh.receipt.reason || 'Damaged / rejected at receiving',
    };
  }
  if (sh.id === 'DISP-102A') {
    if (i === 1000 || i === 2000 || i === 2899) {
      return { status: 'WITHDRAWN', reason: 'Damaged', date: '05 Dec 2026' };
    }
    if (i % 24 === 0) {
      return { status: 'SOLD', date: '06 Dec 2026' };
    }
  }
  return { status: 'AVAILABLE' };
}

export interface StockCounts {
  received: number;
  available: number;
  sold: number;
  withdrawn: number;
}

/** Mirrors mart.js stockCounts. */
export function stockCounts(shipments: Shipment[]): StockCounts {
  const c: StockCounts = { received: 0, available: 0, sold: 0, withdrawn: 0 };
  shipments.forEach(sh => {
    if (sh.receipt) {
      c.received += sh.receipt.received;
    }
    if (!sh.receipt) {
      return;
    }
    for (let i = 1; i <= sh.receipt.received; i++) {
      const st = packStateFor(sh, i);
      if (!st) {
        continue;
      }
      if (st.status === 'AVAILABLE') {
        c.available++;
      } else if (st.status === 'SOLD') {
        c.sold++;
      } else if (st.status === 'WITHDRAWN') {
        c.withdrawn++;
      }
    }
  });
  return c;
}

export interface FoundPack {
  id: string;
  shipment: Shipment;
  idx: number;
}

/** Mirrors mart.js findPack. */
export function findPack(shipments: Shipment[], id: string): FoundPack | null {
  let found: FoundPack | null = null;
  shipments.forEach(sh => {
    const prefix = 'PACK-' + sh.batch.slice(4) + '-';
    if (id.indexOf(prefix) === 0) {
      const idx = parseInt(id.slice(prefix.length), 10);
      if (idx >= 1 && idx <= sh.packsSent) {
        found = { id, shipment: sh, idx };
      }
    }
  });
  return found;
}

export function shipLabel(status: string): string {
  return status === 'AWAITING' ? 'Awaiting Receipt' : 'Received';
}

/** Pill tones from src/components/Pill.tsx. NOTE: Pill has no 'manual'
 *  (dark green-950) tone, so SOLD packs render 'gray' until the foundation
 *  adds it — the HTML SOLD pill is dark (.pill.manual). */
export type PillVariant = 'active' | 'pending' | 'suspended' | 'gray';

export function shipPillVariant(status: string): PillVariant {
  return status === 'AWAITING' ? 'pending' : 'active';
}

export function packPillVariant(status: PackStatus): PillVariant {
  if (status === 'AVAILABLE') {
    return 'active';
  }
  if (status === 'SOLD') {
    return 'gray';
  }
  return 'suspended';
}

export function packLabel(status: PackStatus): string {
  if (status === 'AVAILABLE') {
    return 'Available';
  }
  if (status === 'SOLD') {
    return 'Sold';
  }
  if (status === 'WITHDRAWN') {
    return 'Withdrawn';
  }
  return 'Rejected at receiving';
}

export interface HistoryLike {
  t: string;
  s: string;
  c: string;
}

/** Runtime (store) items first, then seed items not already present. */
export function mergeHistory<T extends HistoryLike>(runtime: T[], seed: T[]): T[] {
  const seen = new Set(runtime.map(a => a.t + '|' + a.s));
  const extra = seed.filter(a => !seen.has(a.t + '|' + a.s));
  return [...runtime, ...extra];
}

let seedNotificationsRead = false;

export function isSeedNotificationsRead(): boolean {
  return seedNotificationsRead;
}

export function markSeedNotificationsRead(): void {
  seedNotificationsRead = true;
}

// Farm helpers — count reconciliation and labels copied from farm.js.
// No UI here; screens import these so the math stays in one place.

import type {
  ActivityItem,
  AppNotification,
  AppUser,
  Application,
  Dispatch,
  FarmBatch,
} from '../../types/models';

/** "5,000" — farm.js fmt(). */
export function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

/** Deaths from Mortality events (farm.js deathsOf). */
export function deathsOf(b: FarmBatch): number {
  let d = 0;
  b.events.forEach(e => {
    if (e.type === 'Mortality') {
      if (e.count) {
        d += e.count;
      } else {
        const m = /(\d[\d,]*)\s*birds/.exec(e.sub || '');
        if (m) {
          d += parseInt(m[1].replace(/,/g, ''), 10);
        }
      }
    }
  });
  return d;
}

/** Birds already dispatched for this batch (farm.js dispatchedOf). */
export function dispatchedOf(b: FarmBatch, dispatches: Dispatch[]): number {
  let d = 0;
  dispatches.forEach(x => {
    if (x.batch === b.id) {
      d += x.birds;
    }
  });
  return d;
}

/** Live birds: placed − DOA − deaths (farm.js liveOf). */
export function liveOf(b: FarmBatch): number {
  return b.placed - b.doa - deathsOf(b);
}

/** Remaining birds: live − dispatched (farm.js balanceOf). */
export function balanceOf(b: FarmBatch, dispatches: Dispatch[]): number {
  return liveOf(b) - dispatchedOf(b, dispatches);
}

/** "03 Dec 2026" from a "YYYY-MM-DD" date input (farm.js nice date). */
export function formatInputDate(value: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) {
    return null;
  }
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (
    d.getFullYear() !== Number(m[1]) ||
    d.getMonth() !== Number(m[2]) - 1 ||
    d.getDate() !== Number(m[3])
  ) {
    return null;
  }
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** "03 Dec 2026" + N days, for the medication withdrawal end date. */
export function addDaysNice(value: string, days: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function statusLabel(s: FarmBatch['status']): string {
  switch (s) {
    case 'REARING':
      return 'Rearing';
    case 'VET_PENDING':
      return 'Vet Pending';
    case 'VET_APPROVED':
      return 'Vet Approved';
    case 'DISPATCHED':
      return 'Dispatched';
    default:
      return s;
  }
}

export type PillKind = 'active' | 'pending' | 'needs_info';

export function statusPillKind(s: FarmBatch['status']): PillKind {
  if (s === 'VET_APPROVED') {
    return 'active';
  }
  if (s === 'VET_PENDING') {
    return 'pending';
  }
  return 'needs_info';
}

export function dispatchPillKind(s: Dispatch['status']): PillKind {
  return s === 'RECEIVED' ? 'active' : 'pending';
}

export function dispatchLabel(s: Dispatch['status']): string {
  return s === 'RECEIVED' ? 'Received' : 'Dispatched';
}

/** "HT" from "Haji Tariq". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

/** New batch id, exactly as farm.js generates it. */
export function newBatchId(): string {
  return 'LOT-S2-' + String(Math.floor(100000 + Math.random() * 899999));
}

/** New dispatch id, exactly as farm.js generates it. */
export function newDispatchId(dispatchCount: number): string {
  return (
    'DISP-' +
    (102 + dispatchCount) +
    String.fromCharCode(65 + (dispatchCount % 26))
  );
}

/** Receivers per route (farm.js RECEIVERS). */
export const RECEIVERS: Record<Dispatch['route'], string[]> = {
  Shop: ['Madina Live Chicken Shop', 'City Chicken Shop'],
  Slaughterhouse: ['Punjab Fresh Abattoir'],
};

/**
 * Receiver business name -> demo account username, so a dispatch
 * notification reaches the receiver's own bell. The store keys
 * notifications by username (Shop = Zubair, Plant = Kashif).
 */
export const RECEIVER_USER: Record<string, string> = {
  'Madina Live Chicken Shop': 'Zubair',
  'City Chicken Shop': 'Zubair',
  'Punjab Fresh Abattoir': 'Kashif',
};

/** Demo farm identity, exactly as in farm.html (profile + home subtitle). */
export const DEMO_FARM = {
  farmName: 'Al-Barkat Broiler Farm',
  code: 'F12',
  owner: 'Haji Tariq',
  license: 'LIC-2026-006',
  email: 'albarkatfarm@gmail.com',
  mobile: '0300-1234567',
  address: 'Chak 45 GB, Samundri Road',
  district: 'Faisalabad · Samundri',
  place: 'Samundri, Faisalabad',
  sheds: '3',
  capacity: '15,000 birds',
} as const;

export interface FarmIdentity {
  farmName: string;
  code: string;
  owner: string;
  license: string;
  email: string;
  mobile: string;
  address: string;
  district: string;
  place: string;
  sheds: string;
  capacity: string;
}

/**
 * The farm identity to show. Demo users see the locked demo farm; a newly
 * approved user sees their own registered name / business / license, with
 * address and district from their own application. Sheds and capacity are
 * demo-only (a new user has none recorded), so those rows are omitted.
 */
export function farmIdentity(
  user: AppUser | null,
  scopeKey: string,
  applications: Application[],
): FarmIdentity {
  if (!user || scopeKey === '__demo__') {
    return { ...DEMO_FARM };
  }
  const app = applications.find(a => a.id === user.appId);
  return {
    farmName: user.business || user.name,
    code: '',
    owner: user.name,
    license: user.license || '',
    email: user.email || '',
    mobile: user.mobile || '',
    address: app?.address || '',
    district: app?.district || '',
    place: app?.district || '',
    sheds: '',
    capacity: '',
  };
}

/** Home subtitle line: "Al-Barkat Broiler Farm · F12 · Samundri". */
export function homeSubtitle(identity: FarmIdentity): string {
  const parts = [identity.farmName];
  if (identity.code) {
    parts.push(identity.code);
  }
  if (identity.district) {
    // Demo district is "Faisalabad · Samundri"; the subtitle shows Samundri.
    parts.push(identity.code ? 'Samundri' : identity.district);
  }
  return parts.join(' · ');
}

// ---------- Live + seed activity / notifications ----------
// The store's per-user activity/notifications start empty for the demo farm
// user; the seed lists live in data.activity.farm / data.notifications.farm.
// Demo scope renders live items first, then the seeds (deduped). A newly
// approved user sees only their own live items (empty at first).

export function mergeItems<T extends { t: string; s: string }>(
  live: T[],
  seeds: T[],
): T[] {
  const seen = new Set(live.map(a => a.t + '|' + a.s));
  return [...live, ...seeds.filter(a => !seen.has(a.t + '|' + a.s))];
}

export function demoSeeds<T>(scopeKey: string, seeds: T[]): T[] {
  return scopeKey === '__demo__' ? seeds : [];
}

// The seed notifications have no read state in the store; the bell badge
// counts them until the Notifications screen is opened once (session-only,
// like the HTML demo's notifUnread).
let seedNotifsRead = false;

export function isSeedNotifsRead(): boolean {
  return seedNotifsRead;
}

export function markSeedNotifsRead(): void {
  seedNotifsRead = true;
}

export type { ActivityItem, AppNotification };

// Shop helpers — pure data math copied from modules/shop.js, plus the
// demo identity and the seed merge for Latest Activity / Notifications.
// No UI here; screens in this folder import from './helpers'.

import type {
  ActivityItem,
  AppNotification,
  AppUser,
  Cage,
  Delivery,
} from '../../types/models';

export const DEMO_TODAY = '09 Dec 2026';

export function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export function acceptedCount(d: Delivery): number {
  return d.receipt ? Math.max(0, d.receipt.received - d.receipt.doa) : 0;
}

export function removedTotal(c: Cage): number {
  return c.removals.reduce((a, r) => a + r.count, 0);
}

export function inCage(c: Cage): number {
  return Math.max(0, c.received - c.sold - removedTotal(c));
}

export function cageStatus(c: Cage): 'ACTIVE' | 'DEPLETED' {
  return inCage(c) > 0 ? 'ACTIVE' : 'DEPLETED';
}

export function nextCageId(cages: Cage[]): string {
  const n = cages.length + 1;
  return 'C-' + (n < 10 ? '0' + n : '' + n);
}

export function shopTotals(deliveries: Delivery[], cages: Cage[]): {
  received: number;
  stock: number;
  sold: number;
  removed: number;
} {
  const t = { received: 0, stock: 0, sold: 0, removed: 0 };
  deliveries.forEach(d => {
    if (d.receipt) {
      t.received += d.receipt.received;
    }
  });
  cages.forEach(c => {
    t.stock += inCage(c);
    t.sold += c.sold;
    t.removed += removedTotal(c);
  });
  return t;
}

export function deliveryLabel(status: Delivery['status']): string {
  return status === 'AWAITING' ? 'Awaiting Receipt' : 'Received';
}

// Demo identity (shop.html / shop.js seed, verbatim). A non-demo user sees
// their own registered identity instead; see shopIdentity().
export const DEMO_SHOP = {
  name: 'Zubair',
  business: 'Madina Live Chicken Shop',
  shopType: 'Live chicken retail',
  license: 'LIC-2026-003',
  mobile: '0301-7772098',
  email: 'madinalivechicken@gmail.com',
  address: 'Main Samanabad Road, Faisalabad',
  district: 'Faisalabad / Samanabad',
  place: 'Samanabad, Faisalabad',
} as const;

export interface ShopIdentity {
  name: string;
  business: string;
  shopType: string;
  license: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  place: string;
}

export function shopIdentity(
  currentUser: AppUser | null,
  isDemo: boolean,
): ShopIdentity {
  if (isDemo || !currentUser) {
    return { ...DEMO_SHOP };
  }
  return {
    name: currentUser.name,
    business: currentUser.business || currentUser.name,
    shopType: 'Live chicken retail',
    license: currentUser.license || '',
    mobile: currentUser.mobile ?? '',
    email: currentUser.email,
    address: '',
    district: '',
    place: '',
  };
}

export function initialLetter(name: string): string {
  const first = name.trim().charAt(0);
  return first ? first.toUpperCase() : 'Z';
}

// The store's notifications/activity maps start empty for the demo Shop
// user; the seed lists live in data.activity.shop / data.notifications.shop.
// Merge store-first (new events on top), de-duplicated by title + subtitle,
// so a receipt/sale/removal recorded in-session appears above the seeds.
export function mergedActivity(
  storeItems: ActivityItem[],
  seedItems: ActivityItem[],
): ActivityItem[] {
  const seen = new Set(storeItems.map(a => a.t + '|' + a.s));
  return [
    ...storeItems,
    ...seedItems.filter(a => !seen.has(a.t + '|' + a.s)),
  ];
}

export function mergedNotifications(
  storeItems: AppNotification[],
  seedItems: AppNotification[],
): AppNotification[] {
  const seen = new Set(storeItems.map(n => n.t + '|' + n.s));
  return [
    ...storeItems,
    ...seedItems.filter(n => !seen.has(n.t + '|' + n.s)),
  ];
}

// Session-only flag: the seeded shop notifications count as unread until
// the user opens the bell once (the HTML sets notifUnread = 0 on bell tap).
// The store's markNotificationsRead covers in-session notifications only.
let shopSeedNotificationsRead = false;

export function isShopSeedNotificationsRead(): boolean {
  return shopSeedNotificationsRead;
}

export function markShopSeedNotificationsRead(): void {
  shopSeedNotificationsRead = true;
}

export interface TimelineStep {
  title: string;
  detail: string;
}

// Timeline for a delivery (shop.js renderDeliveryDetail), verbatim text.
export function deliveryTimeline(d: Delivery): TimelineStep[] {
  const rc = d.receipt;
  const steps: TimelineStep[] = [
    {
      title: 'Farm — ' + d.farm,
      detail:
        d.farmPlace +
        ' · ' +
        d.farmer +
        ' · Batch ' +
        d.batch +
        '\n' +
        d.farmDetail,
    },
    {
      title: 'Vet — Vet V3 · Dr. Usman',
      detail:
        'Health checks & vaccination at the farm · Certificate ' +
        d.cert +
        ' · Flock cleared',
    },
    {
      title: 'Dispatched by Farm',
      detail:
        fmt(d.birdsSent) +
        ' birds · Vehicle ' +
        d.vehicle +
        ' · Driver ' +
        d.driver +
        '\n' +
        d.dispatchDate +
        ' · ' +
        d.dispatchTime,
    },
  ];
  if (rc) {
    steps.push({
      title: 'Received at Shop',
      detail:
        fmt(rc.received) +
        ' birds received · ' +
        fmt(rc.doa) +
        ' DOA · ' +
        fmt(acceptedCount(d)) +
        ' into Cage ' +
        rc.cage +
        '\n' +
        rc.date +
        (rc.time ? ' · ' + rc.time : ''),
    });
  } else {
    steps.push({
      title: 'Awaiting Receipt',
      detail:
        'The birds are on the way from the farm. Confirm the receipt when the vehicle arrives and the birds are counted.',
    });
  }
  return steps;
}

// Trace timeline for a cage (shop.js renderCageDetail), verbatim text.
export function cageTimeline(c: Cage, d: Delivery | undefined): TimelineStep[] {
  if (!d) {
    return [];
  }
  const rc = d.receipt;
  const shopSmall = rc
    ? 'Received ' +
      rc.date +
      (rc.time ? ' · ' + rc.time : '') +
      ' · ' +
      fmt(rc.received) +
      ' birds · ' +
      fmt(rc.doa) +
      ' DOA · ' +
      fmt(c.received) +
      ' into this cage · Received by ' +
      rc.by +
      '\n' +
      fmt(c.sold) +
      ' sold · ' +
      fmt(removedTotal(c)) +
      ' removed · ' +
      fmt(inCage(c)) +
      ' birds in cage now'
    : 'Delivery dispatched — awaiting receipt at the shop';
  return [
    {
      title: 'Farm — ' + d.farm,
      detail:
        d.farmPlace +
        ' · ' +
        d.farmer +
        ' · Batch ' +
        d.batch +
        '\n' +
        d.farmDetail,
    },
    {
      title: 'Vet — Vet V3 · Dr. Usman',
      detail:
        'Health checks & vaccination at the farm · Certificate ' +
        d.cert +
        ' · Flock cleared',
    },
    {
      title: 'Dispatched by Farm',
      detail:
        fmt(d.birdsSent) +
        ' birds · Vehicle ' +
        d.vehicle +
        ' · Driver ' +
        d.driver +
        '\n' +
        d.dispatchDate +
        ' · ' +
        d.dispatchTime,
    },
    {
      title: 'Shop — Madina Live Chicken Shop, Samanabad',
      detail: shopSmall,
    },
  ];
}

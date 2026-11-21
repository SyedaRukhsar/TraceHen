// Plant (Slaughterhouse) module — shared helpers.
// Pure logic copied from modules/plant.js (seed data, pack maths, date
// formatting, status labels). No UI text is invented here: every label the
// screens render comes from modules/plant.html / plant.js.

import { StyleSheet } from 'react-native';
import type { ThemeColors } from '../../theme/colors';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import type {
  ActivityItem,
  AppNotification,
  AppUser,
  DemoData,
  Lot,
  LotStatus,
} from '../../types/models';

export function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export function pad4(n: number): string {
  return `000${n}`.slice(-4);
}

/** Packs in a lot = accepted birds minus post-mortem rejects (plant.js). */
export function packCount(lot: Lot): number {
  return lot.receipt && lot.qc ? lot.receipt.accepted - lot.qc.rejects : 0;
}

export function packId(lot: Lot, i: number): string {
  return `PACK-${lot.batch.slice(4)}-${pad4(i)}`;
}

export function statusLabel(s: LotStatus): string {
  switch (s) {
    case 'AWAITING':
      return 'Received';
    case 'IN_PROCESS':
      return 'In Process';
    case 'QC_HOLD':
      return 'QC Hold';
    case 'PACKED':
      return 'Packed';
    case 'SENT':
      return 'Sent to Mart';
    default:
      return s;
  }
}

/** Pill colour class from plant.js statusPill (maps to css.css .pill). */
export function statusPillClass(s: LotStatus): 'pending' | 'needs_info' | 'manual' | 'active' {
  if (s === 'AWAITING') {
    return 'pending';
  }
  if (s === 'QC_HOLD') {
    return 'needs_info';
  }
  if (s === 'SENT') {
    return 'manual';
  }
  return 'active';
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** '2026-12-03' -> '03 Dec 2026' (plant.js niceDate). */
export function niceDate(v: string): string {
  const parts = v.split('-');
  if (parts.length !== 3) {
    return v;
  }
  const day = parts[2].padStart(2, '0');
  const month = MONTHS[parseInt(parts[1], 10) - 1] ?? '';
  return `${day} ${month} ${parts[0]}`;
}

/** '08:15' -> '8:15 AM' (plant.js niceTime). */
export function niceTime(v: string): string {
  const parts = v.split(':');
  const hh = parseInt(parts[0], 10);
  const mm = parts[1] ?? '00';
  return `${hh % 12 || 12}:${mm} ${hh >= 12 ? 'PM' : 'AM'}`;
}

/** '2026-12-03T10:20' -> '03 Dec 2026 · 10:20 AM' (plant.js niceDT). */
export function niceDT(v: string): string {
  const parts = v.split('T');
  return `${niceDate(parts[0])} · ${niceTime(parts[1] ?? '00:00')}`;
}

export const DEFECT_TYPES = [
  'Bruises',
  'Broken wings',
  'Broken legs',
  'Skin lesions',
  'Weak / sick',
  'Other',
] as const;

export const HOLD_REASONS = [
  'Chilling temperature out of range',
  'Carcass condition needs re-check',
  'Chilling temperature variation',
  'Inspector re-inspection pending',
  'Other',
] as const;

export const DISPOSITIONS = ['Culled / destroyed', 'Returned to supplier'] as const;

/** The seeded lots/notifications/activity belong to the DEMO account only.
 * A newly registered (non-demo) user starts EMPTY. */
export function isDemoScope(scopeKey: string): boolean {
  return scopeKey === '__demo__';
}

export function visibleLots(data: DemoData, scopeKey: string): Lot[] {
  return isDemoScope(scopeKey) ? data.lots : [];
}

/** Demo plant identity exactly as in plant.html / plant.js. A non-demo user
 * sees their own registered name / business / license instead. */
export interface PlantIdentity {
  name: string;
  business: string;
  code: string;
  license: string;
  mobile: string;
  email: string;
  capacity: string;
  address: string;
  district: string;
}

export function plantIdentity(user: AppUser | null, scopeKey: string): PlantIdentity {
  if (isDemoScope(scopeKey)) {
    return {
      name: 'Kashif',
      business: 'Punjab Fresh Abattoir',
      code: 'S2',
      license: 'LIC-2026-008',
      mobile: '0333-6518870',
      email: 'punjabfreshabattoir@gmail.com',
      capacity: '6,000 birds',
      address: 'Industrial Area, Faisalabad',
      district: 'Faisalabad',
    };
  }
  return {
    name: user?.name ?? '',
    business: user?.business ?? '',
    code: '',
    license: user?.license ?? '',
    mobile: user?.mobile ?? '',
    email: user?.email ?? '',
    capacity: '',
    address: '',
    district: '',
  };
}

/** Merged Latest Activity: live entries (store, per user) first, then the
 * demo seed activity. Duplicates (same title + sub) are dropped. */
export function mergedActivity(
  live: ActivityItem[],
  data: DemoData,
  scopeKey: string,
): ActivityItem[] {
  const seed = isDemoScope(scopeKey) ? data.activity.plant : [];
  const out: ActivityItem[] = [...live];
  seed.forEach(item => {
    if (!out.some(o => o.t === item.t && o.s === item.s)) {
      out.push(item);
    }
  });
  return out;
}

// The store seeds per-user notifications empty, so the demo seed
// notifications live in data.notifications.plant. The bell badge counts
// them as unread until the user opens Notifications once (session-only).
let plantSeedNotifsRead = false;

export function isPlantSeedNotifsRead(): boolean {
  return plantSeedNotifsRead;
}

export function markPlantSeedNotifsRead(): void {
  plantSeedNotifsRead = true;
}

export function plantSeedNotifCount(data: DemoData, scopeKey: string): number {
  if (!isDemoScope(scopeKey) || plantSeedNotifsRead) {
    return 0;
  }
  return data.notifications.plant.length;
}

export function mergedNotifications(
  live: AppNotification[],
  data: DemoData,
  scopeKey: string,
): AppNotification[] {
  const seed = isDemoScope(scopeKey) ? data.notifications.plant : [];
  const out: AppNotification[] = [...live];
  seed.forEach(item => {
    if (!out.some(o => o.t === item.t && o.s === item.s)) {
      out.push(item);
    }
  });
  return out;
}

// ---------- Shared styles (theme tokens only, never hard-coded) ----------

export function plantStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
    content: {
      paddingHorizontal: spacing.screen,
      paddingTop: spacing.screenPaddingTop,
      paddingBottom: spacing.screenPaddingBottom,
    },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
    },
    pageSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    sectionLabel: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.sectionLabel,
      letterSpacing: 0.72,
      textTransform: 'uppercase',
      color: colors.muted,
      marginTop: spacing.sectionGap,
      marginBottom: spacing.sm,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginBottom: spacing.sm,
    },
    cardTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      letterSpacing: 0.65,
      textTransform: 'uppercase',
      color: colors.green700,
      marginBottom: spacing.md,
    },
    kvRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 14,
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    kvRowLast: {
      borderBottomWidth: 0,
    },
    kvLabel: {
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      color: colors.muted,
      flexShrink: 0,
    },
    kvValue: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13.5,
      color: colors.ink,
      textAlign: 'right',
      flexShrink: 1,
    },
    kvValueOk: {
      color: colors.green700,
    },
    pill: {
      flexShrink: 0,
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pill,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radius.pill,
      overflow: 'hidden',
    },
    pillPending: {
      backgroundColor: colors.amberBg,
      color: colors.amber,
    },
    pillActive: {
      backgroundColor: colors.green100,
      color: colors.green900,
    },
    pillNeedsInfo: {
      backgroundColor: colors.blueBg,
      color: colors.blue,
    },
    pillManual: {
      backgroundColor: colors.green950,
      color: colors.white,
    },
    chip: {
      flexGrow: 1,
      flexBasis: '33.333%',
      maxWidth: '33.333%',
      borderWidth: 1.5,
      borderColor: colors.line,
      backgroundColor: colors.card,
      borderRadius: radius.chip,
      paddingVertical: 8,
      paddingHorizontal: 4,
      minHeight: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipOn: {
      backgroundColor: colors.green,
      borderColor: colors.green,
    },
    chipText: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.chip,
      color: colors.muted,
    },
    chipTextOn: {
      color: colors.white,
    },
    rowItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      paddingHorizontal: spacing.rowPaddingX,
      paddingVertical: spacing.rowPaddingY,
    },
    rowItemLast: {
      borderBottomWidth: 0,
    },
    rowMain: {
      flex: 1,
    },
    rowTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 14.5,
      color: colors.ink,
    },
    rowSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12.5,
      color: colors.muted,
      marginTop: 2,
      lineHeight: 18,
    },
    rowChev: {
      fontFamily: fontFamily.regular,
      fontSize: 18,
      color: colors.chev,
      marginTop: 2,
    },
    listCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    emptyNote: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      textAlign: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    noteText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginTop: spacing.md,
    },
    fieldLabel: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
      marginBottom: spacing.labelMarginBottom,
    },
    fieldInput: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.input,
      color: colors.ink,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.input,
      paddingHorizontal: spacing.inputPaddingX,
      paddingVertical: spacing.inputPaddingY,
      minHeight: 44,
    },
    fieldHint: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.xs,
      color: colors.muted,
      marginTop: 6,
      lineHeight: 17,
    },
    fieldWrap: {
      marginBottom: spacing.fieldMarginBottom,
    },
    fieldRow: {
      flexDirection: 'row',
      gap: 10,
    },
    fieldFlex: {
      flex: 1,
    },
    errorBox: {
      backgroundColor: colors.redBg,
      borderWidth: 1,
      borderColor: colors.dangerBorder,
      borderRadius: radius.input,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    errorText: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.bodySm,
      color: colors.red,
    },
    autoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      backgroundColor: colors.green50,
      borderWidth: 1,
      borderColor: colors.green100,
      borderRadius: radius.input,
      paddingHorizontal: spacing.md,
      paddingVertical: 11,
      marginBottom: spacing.sm,
    },
    autoLabel: {
      fontFamily: fontFamily.bold,
      fontSize: 13,
      color: colors.muted,
    },
    autoValue: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      color: colors.green900,
    },
    infoBox: {
      flexDirection: 'row',
      gap: 10,
      backgroundColor: colors.blueBg,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.input,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    infoTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
    },
    infoText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13,
      color: colors.muted,
      lineHeight: 19,
      marginTop: 2,
    },
    primaryBtn: {
      backgroundColor: colors.green,
      borderRadius: radius.button,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.buttonPaddingX,
      paddingVertical: spacing.buttonPaddingY,
      marginTop: spacing.xs,
    },
    primaryBtnText: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.button,
      color: colors.white,
    },
    outlineBtn: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.green,
      borderRadius: radius.button,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.buttonPaddingX,
      paddingVertical: spacing.buttonPaddingY,
      marginTop: spacing.xs,
    },
    outlineBtnText: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.button,
      color: colors.green700,
    },
    amberBtn: {
      backgroundColor: colors.amber,
      borderRadius: radius.button,
      minHeight: 44,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.buttonPaddingX,
      paddingVertical: spacing.buttonPaddingY,
    },
    amberBtnText: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.button,
      color: colors.white,
    },
    btnRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: spacing.xs,
    },
    btnRowPrimary: {
      flex: 1,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.line,
      borderRadius: radius.input,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.sm,
      minHeight: 44,
    },
    optionRowOn: {
      borderColor: colors.green,
      backgroundColor: colors.green50,
    },
    optionRadio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.chev,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    optionRadioOn: {
      borderColor: colors.green,
    },
    optionRadioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.green,
    },
    optionText: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
      flexShrink: 1,
    },
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    statCard: {
      flexGrow: 1,
      flexBasis: '47%',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.statIcon,
      backgroundColor: colors.green50,
      borderWidth: 1,
      borderColor: colors.green100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    statIconWarn: {
      backgroundColor: colors.amberBg,
      borderColor: colors.amberBorder,
    },
    statValue: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.statNumber,
      color: colors.ink,
    },
    statLabel: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginTop: 2,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.green,
      marginTop: 5,
      flexShrink: 0,
    },
    dotAmber: {
      backgroundColor: colors.amber,
    },
    dotRed: {
      backgroundColor: colors.red,
    },
    dotGray: {
      backgroundColor: colors.chev,
    },
    historyRow: {
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    historyRowLast: {
      borderBottomWidth: 0,
    },
    historyTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
    },
    historySub: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12.5,
      color: colors.muted,
      marginTop: 2,
      lineHeight: 18,
    },
    timelineRow: {
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    timelineRowLast: {
      borderBottomWidth: 0,
    },
    timelineIcon: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.green100,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    qrThumb: {
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 9,
      backgroundColor: colors.white,
      padding: 3,
      flexShrink: 0,
      marginTop: 2,
    },
    qrFrame: {
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 14,
      padding: 12,
      backgroundColor: colors.white,
      alignSelf: 'center',
    },
    qrBigWrap: {
      alignItems: 'center',
      paddingVertical: 4,
      paddingBottom: spacing.sm,
    },
  });
}

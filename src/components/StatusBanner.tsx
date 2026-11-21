// Scan-result status banner — CSS `.status-banner`. Titles, notes and icons
// for VERIFIED / RECALLED / UNKNOWN / WITHDRAWN are the exact strings from
// modules/consumer.js `renderResult` (CHECK stroke 2.4, ALERT_IC and Q_IC
// stroke 2.2). SOLD / AVAILABLE / AT_PLANT have no consumer-banner text in
// the HTML, so the screen must pass label/note for those; they fall back to
// the status word and the green (available/at plant) or gray (sold) banner.
// The optional `notice` (e.g. the "not a guarantee" notice) is passed in by
// the screen — it is NOT hard-coded here — and renders as CSS `.notice`.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type ScanStatus = 'VERIFIED' | 'RECALLED' | 'UNKNOWN' | 'WITHDRAWN' | 'SOLD' | 'AVAILABLE' | 'AT_PLANT';

export interface StatusBannerProps {
  status: ScanStatus;
  label?: string;
  note?: string;
  notice?: string;
}

type BannerStyle = 'verified' | 'recalled' | 'unknown' | 'withdrawn';

interface BannerDefault {
  style: BannerStyle;
  label: string;
  note: string;
  icon: IconName;
  strokeWidth: number;
}

const DEFAULTS: Record<ScanStatus, BannerDefault> = {
  VERIFIED: {
    style: 'verified',
    label: 'VERIFIED',
    note: 'This code is genuine and matched in the TraceHen system.',
    icon: 'check',
    strokeWidth: 2.4,
  },
  RECALLED: {
    style: 'recalled',
    label: 'RECALLED',
    note: 'This pack has been recalled. Do not eat it.',
    icon: 'alert',
    strokeWidth: 2.2,
  },
  UNKNOWN: {
    style: 'unknown',
    label: 'UNKNOWN',
    note: 'This code was not found in the TraceHen system.',
    icon: 'helpCircle',
    strokeWidth: 2.2,
  },
  WITHDRAWN: {
    style: 'withdrawn',
    label: 'WITHDRAWN AT MART',
    note: 'This pack was withdrawn at the mart and should not be on sale.',
    icon: 'alert',
    strokeWidth: 2.2,
  },
  SOLD: { style: 'unknown', label: 'SOLD', note: '', icon: 'check', strokeWidth: 2.4 },
  AVAILABLE: { style: 'verified', label: 'AVAILABLE', note: '', icon: 'check', strokeWidth: 2.4 },
  AT_PLANT: { style: 'verified', label: 'AT PLANT', note: '', icon: 'package', strokeWidth: 2 },
};

export function StatusBanner({ status, label, note, notice }: StatusBannerProps) {
  const { colors, theme } = useApp();
  const def = DEFAULTS[status];

  const styleColors =
    def.style === 'verified'
      ? { bg: colors.green50, border: colors.green200, iconBg: colors.green, text: colors.green900 }
      : def.style === 'recalled'
        ? { bg: colors.redBg, border: colors.dangerBorderLight, iconBg: colors.badgeRed, text: colors.red }
        : def.style === 'withdrawn'
          ? { bg: colors.amberBg, border: colors.amberBorder, iconBg: '#d97706', text: colors.amber }
          : { bg: colors.grayBg, border: colors.line, iconBg: '#6b7280', text: colors.grayTx };

  const title = label ?? def.label;
  const sub = note ?? def.note;

  return (
    <View>
      <View style={[styles.banner, { backgroundColor: styleColors.bg, borderColor: styleColors.border }]}>
        <View style={[styles.bigIcon, { backgroundColor: styleColors.iconBg }]}>
          <Icon name={def.icon} size={32} color="#ffffff" strokeWidth={def.strokeWidth} />
        </View>
        <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
        {sub ? <Text style={[styles.note, { color: styleColors.text }]}>{sub}</Text> : null}
      </View>
      {notice ? (
        <View style={[styles.notice, { backgroundColor: colors.green100, borderColor: colors.green200 }]}>
          <Text style={[styles.noticeText, { color: theme === 'dark' ? colors.ink : colors.green950 }]}>{notice}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
  },
  bigIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 23,
    fontFamily: fontForWeight(800),
    letterSpacing: 0.46,
    textAlign: 'center',
  },
  note: {
    fontSize: 13.5,
    fontFamily: fontForWeight(600),
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 4,
  },
  notice: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  noticeText: {
    fontSize: 13.5,
    fontFamily: fontForWeight(700),
  },
});

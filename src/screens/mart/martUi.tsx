// Shared Mart screen shell and small presentational pieces, built from the
// locked HTML classes (.app-top, .app-body, .page-title, .page-sub,
// .detail-card, .kv, .list-card, .history, .form-error). Every Mart screen
// renders MartShell so the top bar (TraceHen Mart + view title, bell with
// badge, theme button, avatar → Profile) and the bottom nav
// (Home / Shipments / Stock / Settings) stay identical everywhere.

import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { ListCard } from '../../components/ListCard';
import { ScreenLayout } from '../../components/ScreenLayout';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import {
  isSeedNotificationsRead,
  type HistoryLike,
} from './packState';

export type MartTab = 'home' | 'shipments' | 'stock' | 'settings';

export interface MartShellProps {
  /** View title — the AppHeader subtitle and the TITLES[view] value. */
  title: string;
  /** Bottom-nav tab to highlight; omitted on Notifications (no tab, as in the HTML). */
  activeTab?: MartTab;
  showBack?: boolean;
  children: ReactNode;
}

export function MartShell({ title, activeTab, showBack = false, children }: MartShellProps) {
  const { colors, currentUser, unreadCount, scopeKey, data } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [, setTick] = useState(0);
  // Re-render on focus so the bell badge and counts stay live after an
  // action on another screen (the seed-read flag is module-level state).
  useFocusEffect(
    useCallback(() => {
      setTick(t => t + 1);
    }, []),
  );
  const isDemo = scopeKey === '__demo__';
  const seedNotifs = isDemo ? data.notifications.mart : [];
  const badge = unreadCount + (isSeedNotificationsRead() ? 0 : seedNotifs.length);
  const initial = (currentUser?.name ?? 'S').charAt(0).toUpperCase();
  const tabRoute: Record<MartTab, keyof RootStackParamList> = {
    home: 'MartHome',
    shipments: 'MartShipments',
    stock: 'MartStock',
    settings: 'MartSettings',
  };
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
  });
  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Mart"
        subtitle={title}
        showBack={showBack}
        onBack={() => navigation.goBack()}
        showBell
        unreadCount={badge}
        onBellPress={() => navigation.navigate('MartNotifications')}
        avatarInitial={initial}
        onAvatarPress={() => navigation.navigate('MartProfile')}
      />
      <ScreenLayout>{children}</ScreenLayout>
      <BottomNav
        role="mart"
        active={activeTab ?? ''}
        onTab={tab => {
          const route = tabRoute[tab as MartTab];
          if (route) {
            // Tab taps reset the stack to the tab root, as in mart.js
            // (stack = [view] on every bottom-nav tap).
            navigation.reset({ index: 0, routes: [{ name: route }] });
          }
        }}
      />
    </View>
  );
}

/** .page-title (21px, 800). */
export function PageTitle({ children }: { children: string }) {
  const { colors } = useApp();
  const styles = StyleSheet.create({
    title: {
      color: colors.ink,
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      marginBottom: spacing.xs,
    },
  });
  return <Text style={styles.title}>{children}</Text>;
}

/** .page-sub (13.5px muted, 600). */
export function PageSub({ children }: { children: string }) {
  const { colors } = useApp();
  const styles = StyleSheet.create({
    sub: {
      color: colors.muted,
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      marginBottom: spacing.md,
    },
  });
  return <Text style={styles.sub}>{children}</Text>;
}

/** Uppercase section label (.section-label, 12px, letter-spacing .06em). */
export function SectionLabel({ children }: { children: string }) {
  const { colors } = useApp();
  const styles = StyleSheet.create({
    label: {
      color: colors.muted,
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.sectionLabel,
      letterSpacing: 0.72,
      textTransform: 'uppercase',
      marginTop: spacing.sectionGap,
      marginBottom: spacing.sm,
    },
  });
  return <Text style={styles.label}>{children}</Text>;
}

/** .detail-card with an optional uppercase green heading. */
export function DetailCard({
  title,
  children,
  style,
}: {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useApp();
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.line,
      borderWidth: 1,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginBottom: spacing.md,
    },
    heading: {
      color: colors.green700,
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      letterSpacing: 0.65,
      textTransform: 'uppercase',
      marginBottom: spacing.md,
    },
  });
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.heading}>{title}</Text> : null}
      {children}
    </View>
  );
}

/** .kv row (label left, value right; `ok` paints the value green-700). */
export function KvRow({
  label,
  value,
  ok = false,
  last = false,
}: {
  label: string;
  value: string;
  ok?: boolean;
  last?: boolean;
}) {
  const { colors } = useApp();
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: 7,
      borderBottomWidth: last ? 0 : 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    label: {
      color: colors.muted,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.small,
      flexShrink: 0,
    },
    value: {
      color: ok ? colors.green700 : colors.ink,
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.small,
      textAlign: 'right',
      flexShrink: 1,
    },
  });
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/** .form-error (red-bg box, shown only when a message is set). */
export function FormError({ message }: { message: string | null }) {
  const { colors } = useApp();
  if (!message) {
    return null;
  }
  const styles = StyleSheet.create({
    error: {
      backgroundColor: colors.redBg,
      color: colors.red,
      fontFamily: fontFamily.bold,
      fontSize: 13,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
  });
  return <Text style={styles.error}>{message}</Text>;
}

/** .hint small text under a field (FormField itself renders no helper
 *  text, so hints from the HTML render as this line). */
export function Hint({ children }: { children: string }) {
  const { colors } = useApp();
  const styles = StyleSheet.create({
    hint: {
      color: colors.muted,
      fontFamily: fontFamily.semiBold,
      fontSize: 12,
      marginTop: -10,
      marginBottom: spacing.md,
    },
  });
  return <Text style={styles.hint}>{children}</Text>;
}

/** Field label matching FormField's label style, for controls that are not
 *  a FormField (e.g. the FilePicker row). */
export function FieldLabel({ children }: { children: string }) {
  const { colors, theme } = useApp();
  const styles = StyleSheet.create({
    label: {
      color: theme === 'dark' ? colors.ink : colors.green950,
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      marginBottom: 7,
    },
  });
  return <Text style={styles.label}>{children}</Text>;
}

/** .list-card containing a .history list (dot + bold title + muted sub).
 *  Dot colors follow the CSS (.dot amber #d97706 / red #dc2626 / gray
 *  #c3cec5 / blue #2563eb) through the nearest theme tokens. */
export function HistoryList({ items }: { items: HistoryLike[] }) {
  const { colors } = useApp();
  const dotColor = (c: string): string => {
    if (c === 'amber') {
      return colors.amber;
    }
    if (c === 'red') {
      return colors.badgeRed;
    }
    if (c === 'gray') {
      return colors.chev;
    }
    if (c === 'blue') {
      return colors.blue;
    }
    return colors.green;
  };
  const styles = StyleSheet.create({
    inner: {
      paddingVertical: 6,
      paddingHorizontal: spacing.rowPaddingX,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    dot: {
      width: 9,
      height: 9,
      borderRadius: 99,
      marginTop: 5,
      flexShrink: 0,
    },
    main: {
      flex: 1,
    },
    title: {
      color: colors.ink,
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
    },
    sub: {
      color: colors.muted,
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
    },
  });
  return (
    <ListCard>
      <View style={styles.inner}>
        {items.map((a, i) => (
          <View key={a.t + '|' + a.s} style={[styles.row, i === items.length - 1 ? styles.rowLast : null]}>
            <View style={[styles.dot, { backgroundColor: dotColor(a.c) }]} />
            <View style={styles.main}>
              <Text style={styles.title}>{a.t}</Text>
              <Text style={styles.sub}>{a.s}</Text>
            </View>
          </View>
        ))}
      </View>
    </ListCard>
  );
}

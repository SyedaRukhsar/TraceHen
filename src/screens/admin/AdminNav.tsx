// Shared Admin chrome + small building blocks for the Admin screens.
// The shared components named in the conversion spec (Icon, AppHeader,
// BottomNav, Pill, ListCard, Switch, DocViewer, ...) do not exist in this
// tree yet, and the existing components import a `colors` export the theme
// no longer provides — so the Admin screens use this local shared file
// (lucide-react-native glyphs + the theme tokens from useApp().colors).
// Everything here copies the locked admin.html / css.css exactly.

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  Building2,
  FileCheck,
  House,
  MapPin,
  Moon,
  Settings,
  Sun,
} from 'lucide-react-native';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { ReactNode } from 'react';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import type { ThemeColors } from '../../theme/colors';
import { images } from '../../theme/assets';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import type { ApplicationStatus, HistoryItem, OrgStatus, Site } from '../../types/models';

export type AdminTab = 'home' | 'applications' | 'organizations' | 'settings';

export const ADMIN_VIEW_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  applications: 'Applications',
  'app-detail': 'Application Review',
  organizations: 'Organizations',
  'org-detail': 'Organization',
  document: 'Document',
  batches: 'Batches',
  'batch-detail': 'Batch Detail',
  notifications: 'Notifications',
  settings: 'Settings',
  profile: 'Profile',
  password: 'Change Password',
};

export function fmtNum(n: number): string {
  return Number(n).toLocaleString('en-US');
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'DA';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type PillTone = 'pending' | 'active' | 'suspended' | 'needs_info' | 'rejected';

export function pillForApplication(status: ApplicationStatus): { label: string; tone: PillTone } {
  switch (status) {
    case 'PENDING':
      return { label: 'PENDING', tone: 'pending' };
    case 'NEEDS_INFO':
      return { label: 'NEEDS INFO', tone: 'needs_info' };
    case 'REJECTED':
      return { label: 'REJECTED', tone: 'rejected' };
    case 'APPROVED':
      // admin.js sets an approved application to ACTIVE; the store records
      // it as APPROVED. The pill the user sees is ACTIVE, as in the HTML.
      return { label: 'ACTIVE', tone: 'active' };
    default:
      return { label: status, tone: 'pending' };
  }
}

export function pillForOrg(status: OrgStatus): { label: string; tone: PillTone } {
  return status === 'ACTIVE'
    ? { label: 'ACTIVE', tone: 'active' }
    : { label: 'SUSPENDED', tone: 'suspended' };
}

export function pillForBatch(status: string): { label: string; tone: PillTone } {
  const label =
    status === 'REARING'
      ? 'Rearing'
      : status === 'VET_PENDING'
        ? 'Vet Pending'
        : status === 'VET_APPROVED'
          ? 'Vet Approved'
          : status === 'DISPATCHED'
            ? 'Dispatched'
            : status;
  const tone: PillTone =
    status === 'VET_PENDING'
      ? 'pending'
      : status === 'REARING'
        ? 'needs_info'
        : 'active';
  return { label, tone };
}

export function Pill({ label, tone }: { label: string; tone: PillTone }) {
  const { colors } = useApp();
  const bg =
    tone === 'pending'
      ? colors.amberBg
      : tone === 'active'
        ? colors.green100
        : tone === 'suspended'
          ? colors.redBg
          : tone === 'needs_info'
            ? colors.blueBg
            : colors.grayBg;
  const fg =
    tone === 'pending'
      ? colors.amber
      : tone === 'active'
        ? colors.green900
        : tone === 'suspended'
          ? colors.red
          : tone === 'needs_info'
            ? colors.blue
            : colors.grayTx;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function Dot({ c }: { c: string }) {
  const { colors } = useApp();
  const bg =
    c === 'amber'
      ? colors.amber
      : c === 'red'
        ? colors.badgeRed
        : c === 'blue'
          ? colors.blue
          : c === 'gray'
            ? colors.chev
            : colors.green;
  return <View style={[styles.dot, { backgroundColor: bg }]} />;
}

// ---- Shared stylesheet factory (theme tokens only, no hard-coded values) ----
export function adminStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBg },
    content: { paddingHorizontal: spacing.screen, paddingTop: spacing.screenPaddingTop, paddingBottom: spacing.screenPaddingBottom },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
      marginBottom: 4,
    },
    pageSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginBottom: spacing.lg,
      lineHeight: 20,
    },
    sectionLabel: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.sectionLabel,
      letterSpacing: 0.72,
      textTransform: 'uppercase',
      color: colors.muted,
      marginVertical: 10,
    },
    listCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      overflow: 'hidden',
    },
    detailCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginBottom: 14,
    },
    cardHeading: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      letterSpacing: 0.65,
      textTransform: 'uppercase',
      color: colors.green700,
      marginBottom: spacing.md,
    },
    rowItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingVertical: 14,
      paddingHorizontal: 15,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    rowMain: { flex: 1, minWidth: 0 },
    rowTitle: { fontFamily: fontFamily.extraBold, fontSize: 14.5, color: colors.ink },
    rowSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12.5,
      color: colors.muted,
      marginTop: 2,
      lineHeight: 18,
    },
    chev: { color: colors.chev, marginTop: 4 },
    emptyNote: {
      paddingVertical: 22,
      paddingHorizontal: spacing.lg,
      textAlign: 'center',
      color: colors.muted,
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    chip: {
      flexGrow: 1,
      flexBasis: '30%',
      minHeight: 40,
      borderWidth: 1.5,
      borderColor: colors.line,
      backgroundColor: colors.card,
      borderRadius: radius.chip,
      paddingVertical: 8,
      paddingHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipOn: { backgroundColor: colors.green, borderColor: colors.green },
    chipText: { fontFamily: fontFamily.extraBold, fontSize: fontSize.chip, color: colors.muted },
    chipTextOn: { color: colors.white },
    kv: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 14,
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
      fontSize: 13.5,
    },
    kvLabel: { fontFamily: fontFamily.semiBold, fontSize: 13.5, color: colors.muted },
    kvValue: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.ink, textAlign: 'right', flexShrink: 1 },
    kvValueOk: { color: colors.green700 },
    fieldLabel: {
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      color: colors.ink,
      marginBottom: 7,
    },
    input: {
      borderWidth: 1.5,
      borderColor: colors.line,
      backgroundColor: colors.inputBg,
      borderRadius: radius.input,
      paddingHorizontal: 14,
      paddingVertical: 12,
      minHeight: 44,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.input,
      color: colors.ink,
    },
    inputMultiline: { minHeight: 76, textAlignVertical: 'top' },
    errorText: {
      fontFamily: fontFamily.bold,
      fontSize: 13,
      color: colors.red,
      marginTop: 8,
    },
    btnPrimary: {
      backgroundColor: colors.green,
      borderRadius: radius.button,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 13,
      paddingHorizontal: 18,
    },
    btnPrimaryText: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.white },
    btnOutlineAmber: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.amberBorder,
      borderRadius: radius.button,
      minHeight: 48,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 13,
      paddingHorizontal: 18,
    },
    btnOutlineAmberText: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.amber },
    btnOutlineDanger: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.dangerBorder,
      borderRadius: radius.button,
      minHeight: 48,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 13,
      paddingHorizontal: 18,
    },
    btnOutlineDangerText: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.red },
    btnRow: { flexDirection: 'row', gap: 10 },
    historyItem: {
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    historyTitle: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.ink },
    historySub: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.muted, marginTop: 1, lineHeight: 18 },
    siteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    pinBadge: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.redBg,
      borderWidth: 1.5,
      borderColor: colors.dangerBorderLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    siteMain: { flex: 1, minWidth: 0 },
    siteName: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.ink, lineHeight: 18 },
    sitePlace: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.muted, marginTop: 2 },
    pinBtn: {
      backgroundColor: colors.green,
      borderRadius: radius.pill,
      paddingVertical: 8,
      paddingHorizontal: 12,
      minHeight: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pinBtnText: { fontFamily: fontFamily.extraBold, fontSize: 12, color: colors.white },
    docRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    docName: { flex: 1, fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.ink },
    docType: { fontFamily: fontFamily.extraBold, fontSize: 11, color: colors.muted },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    setMain: { flex: 1 },
    setTitle: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.ink },
    setSub: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.muted, marginTop: 1 },
    setIconBox: {
      width: 38,
      height: 38,
      borderRadius: 11,
      backgroundColor: colors.green50,
      borderWidth: 1,
      borderColor: colors.green100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    verTag: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.muted },
    switchTrack: {
      width: 52,
      height: 30,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: colors.line,
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    switchKnob: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.white,
    },
  });
}

export function DetailCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const { colors } = useApp();
  const s = adminStyles(colors);
  return (
    <View style={s.detailCard}>
      {title ? <Text style={s.cardHeading}>{title}</Text> : null}
      {children}
    </View>
  );
}

export function KvRow({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  const { colors } = useApp();
  const s = adminStyles(colors);
  return (
    <View style={s.kv}>
      <Text style={s.kvLabel}>{label}</Text>
      <Text style={[s.kvValue, ok === true ? s.kvValueOk : null]}>{value}</Text>
    </View>
  );
}

export function HistoryList({ items }: { items: HistoryItem[] }) {
  const { colors } = useApp();
  const s = adminStyles(colors);
  return (
    <View>
      {items.map((item, i) => (
        <View
          key={`${item.t}-${i}`}
          style={[s.historyItem, i === items.length - 1 ? { borderBottomWidth: 0 } : null]}
        >
          <Dot c={item.c} />
          <View style={{ flex: 1 }}>
            <Text style={s.historyTitle}>{item.t}</Text>
            <Text style={s.historySub}>{item.s}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function SiteRow({
  site,
  onViewPin,
}: {
  site: Site;
  onViewPin: () => void;
}) {
  const { colors } = useApp();
  const s = adminStyles(colors);
  return (
    <View style={s.siteRow}>
      <View style={s.pinBadge}>
        <MapPin size={22} color={colors.red} strokeWidth={2} />
      </View>
      <View style={s.siteMain}>
        <Text style={s.siteName}>{site.name}</Text>
        <Text style={s.sitePlace}>{site.place}</Text>
      </View>
      <Pressable style={s.pinBtn} onPress={onViewPin} accessibilityRole="button">
        <Text style={s.pinBtnText}>View pin</Text>
      </Pressable>
    </View>
  );
}

// ---- App top bar (admin.html `.app-top`): logo photo, "TraceHen Admin" +
// subtitle, bell with badge, theme button, avatar. ----
export function AdminHeader({
  subtitle,
  showBack = true,
}: {
  subtitle: string;
  showBack?: boolean;
}) {
  const { colors, theme, toggleTheme, unreadCount, markNotificationsRead, currentUser, showToast } =
    useApp();
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const adminName = currentUser?.name ?? 'Demo Admin';

  const onBell = () => {
    markNotificationsRead();
    navigation.navigate('AdminNotifications');
  };
  const onTheme = () => {
    toggleTheme();
    showToast(theme === 'dark' ? 'Light mode on.' : 'Dark mode on.');
  };

  return (
    <View style={headerStyles(colors, compact).bar}>
      {showBack ? (
        <Pressable
          style={headerStyles(colors, compact).backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.green900} strokeWidth={2.4} />
        </Pressable>
      ) : null}
      <Image source={images.heroFarm} style={headerStyles(colors, compact).logo} />
      <View style={headerStyles(colors, compact).who}>
        <Text style={headerStyles(colors, compact).whoTitle} numberOfLines={1}>
          TraceHen Admin
        </Text>
        <Text style={headerStyles(colors, compact).whoSub} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Pressable
        style={headerStyles(colors, compact).iconBtn}
        onPress={onBell}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <Bell size={20} color={colors.green900} strokeWidth={2} />
        {unreadCount > 0 ? (
          <View style={headerStyles(colors, compact).badge}>
            <Text style={headerStyles(colors, compact).badgeText}>{unreadCount}</Text>
          </View>
        ) : null}
      </Pressable>
      <Pressable
        style={headerStyles(colors, compact).iconBtn}
        onPress={onTheme}
        accessibilityRole="button"
        accessibilityLabel={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? (
          <Sun size={20} color={colors.green900} strokeWidth={2} />
        ) : (
          <Moon size={20} color={colors.green900} strokeWidth={2} />
        )}
      </Pressable>
      <Pressable
        style={headerStyles(colors, compact).avatar}
        onPress={() => navigation.navigate('AdminProfile')}
        accessibilityRole="button"
        accessibilityLabel="Open admin profile"
      >
        <Text style={headerStyles(colors, compact).avatarText}>{initialsOf(adminName)}</Text>
      </Pressable>
    </View>
  );
}

// Narrow phones (< 380dp) use a compact bar so the title and all buttons
// fit with safe margins; wider screens keep the exact locked sizes.
const headerStyles = (colors: ThemeColors, compact: boolean) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: compact ? 6 : 8,
      paddingHorizontal: compact ? 12 : 18,
      paddingTop: 14,
      paddingBottom: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    backBtn: { padding: 4 },
    logo: { width: compact ? 34 : 40, height: compact ? 34 : 40, borderRadius: radius.logoSm },
    who: { flex: 1, minWidth: 0 },
    whoTitle: { fontFamily: fontFamily.extraBold, fontSize: compact ? 14 : 15, color: colors.ink },
    whoSub: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.muted },
    iconBtn: {
      width: compact ? 34 : 40,
      height: compact ? 34 : 40,
      borderRadius: radius.appTopIcon,
      borderWidth: 1,
      borderColor: colors.line,
      backgroundColor: colors.green50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: colors.badgeRed,
      minWidth: 18,
      height: 18,
      borderRadius: 99,
      borderWidth: 2,
      borderColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    badgeText: { fontFamily: fontFamily.extraBold, fontSize: 10, color: colors.white },
    avatar: {
      width: compact ? 34 : 40,
      height: compact ? 34 : 40,
      borderRadius: compact ? 17 : 20,
      backgroundColor: colors.green,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.white },
  });

// ---- Bottom nav (admin.html `.bottom-nav`): Home, Applications (badge =
// pending count), Organizations, Settings. NOTE: the task brief listed
// Batches as the 4th tab, but the locked HTML has Settings there; Batches
// is reached from the Dashboard stat card, as in the HTML. ----
export function AdminBottomNav({ active }: { active: AdminTab }) {
  const { colors, applications } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pending = applications.filter(a => a.status === 'PENDING').length;

  const tabs: {
    key: AdminTab;
    label: string;
    route: 'AdminDashboard' | 'AdminApplications' | 'AdminOrganizations' | 'AdminSettings';
    icon: ReactNode;
    badge?: number;
  }[] = [
    {
      key: 'home',
      label: 'Home',
      route: 'AdminDashboard',
      icon: <House size={24} color={active === 'home' ? colors.green700 : colors.muted} strokeWidth={2} />,
    },
    {
      key: 'applications',
      label: 'Applications',
      route: 'AdminApplications',
      icon: <FileCheck size={24} color={active === 'applications' ? colors.green700 : colors.muted} strokeWidth={2} />,
      badge: pending,
    },
    {
      key: 'organizations',
      label: 'Organizations',
      route: 'AdminOrganizations',
      icon: <Building2 size={24} color={active === 'organizations' ? colors.green700 : colors.muted} strokeWidth={2} />,
    },
    {
      key: 'settings',
      label: 'Settings',
      route: 'AdminSettings',
      icon: <Settings size={24} color={active === 'settings' ? colors.green700 : colors.muted} strokeWidth={2} />,
    },
  ];

  return (
    <View style={navStyles(colors).bar}>
      {tabs.map(tab => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            style={navStyles(colors).tab}
            onPress={() => navigation.navigate(tab.route)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <View>
              {tab.icon}
              {tab.badge !== undefined && tab.badge > 0 ? (
                <View style={navStyles(colors).navBadge}>
                  <Text style={navStyles(colors).navBadgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[
                navStyles(colors).label,
                {
                  color: isActive ? colors.green700 : colors.muted,
                  fontFamily: isActive ? fontFamily.extraBold : fontFamily.semiBold,
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const navStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.line,
      paddingVertical: 6,
    },
    tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 52 },
    label: { fontSize: fontSize.navLabel },
    navBadge: {
      position: 'absolute',
      top: -4,
      right: -14,
      backgroundColor: colors.badgeRed,
      minWidth: 18,
      height: 18,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    navBadgeText: { fontFamily: fontFamily.extraBold, fontSize: 10, color: colors.white },
  });

const styles = StyleSheet.create({
  pill: {
    flexShrink: 0,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
  },
  pillText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.pill,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  dot: { width: 9, height: 9, borderRadius: 5, marginTop: 5, flexShrink: 0 },
});
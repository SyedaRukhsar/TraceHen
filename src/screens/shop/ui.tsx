// Shop shared UI — header, bottom nav, toast and the small building blocks
// used by the Shop screens, styled from the locked theme (css.css) via
// useApp().colors. The shared src/components/ versions do not fit this
// module (old prototype: wrong tabs, wrong routes, and they read a `colors`
// export that theme/colors.ts does not provide), so the Shop renders its
// own faithful header/nav here instead of importing them.

import type { ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Bell,
  Check,
  ChevronRight,
  Grid2x2,
  House,
  Moon,
  Settings,
  Sun,
  Truck,
} from 'lucide-react-native';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch as RNSwitch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { QRCode } from '../../components/QRCode';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { images } from '../../theme/assets';
import { radius } from '../../theme/colors';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { ActivityItem } from '../../types/models';
import {
  initialLetter,
  isShopSeedNotificationsRead,
  markShopSeedNotificationsRead,
  shopIdentity,
} from './helpers';

type ShopNav = NativeStackNavigationProp<RootStackParamList>;

export type ShopTab = 'home' | 'deliveries' | 'stock' | 'settings';

const TAB_DEFS: {
  key: ShopTab;
  label: string;
  route: 'ShopHome' | 'ShopDeliveries' | 'ShopStock' | 'ShopSettings';
  icon: (color: string) => ReactNode;
}[] = [
  {
    key: 'home',
    label: 'Home',
    route: 'ShopHome',
    icon: color => <House size={22} color={color} strokeWidth={2} />,
  },
  {
    key: 'deliveries',
    label: 'Deliveries',
    route: 'ShopDeliveries',
    icon: color => <Truck size={22} color={color} strokeWidth={2} />,
  },
  {
    key: 'stock',
    label: 'Stock',
    route: 'ShopStock',
    icon: color => <Grid2x2 size={22} color={color} strokeWidth={2} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    route: 'ShopSettings',
    icon: color => <Settings size={22} color={color} strokeWidth={2} />,
  },
];

export function ShopLayout({
  title,
  activeTab,
  children,
}: {
  title: string;
  activeTab: ShopTab | null;
  children: ReactNode;
}) {
  const { colors, theme, toggleTheme, toast, currentUser, scopeKey, data, unreadCount, markNotificationsRead } =
    useApp();
  const navigation = useNavigation<ShopNav>();
  const isDemo = scopeKey === '__demo__';
  const identity = shopIdentity(currentUser, isDemo);
  const seedUnread =
    isDemo && !isShopSeedNotificationsRead() ? data.notifications.shop.length : 0;
  const badge = unreadCount + seedUnread;
  const canGoBack = navigation.canGoBack();

  const openNotifications = () => {
    markNotificationsRead();
    markShopSeedNotificationsRead();
    navigation.navigate('ShopNotifications');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.appBg }]}>
      <View
        style={[
          styles.topBar,
          { backgroundColor: colors.card, borderBottomColor: colors.line },
        ]}>
        {canGoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            style={styles.topIconBtn}>
            <Text style={[styles.backGlyph, { color: colors.ink }]}>{'←'}</Text>
          </Pressable>
        ) : null}
        <Image source={images.heroFarm} style={styles.logo} />
        <View style={styles.who}>
          <Text style={[styles.whoTitle, { color: colors.ink }]} numberOfLines={1}>
            TraceHen Shop
          </Text>
          <Text style={[styles.whoSub, { color: colors.muted }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <Pressable
          onPress={openNotifications}
          accessibilityLabel="Notifications"
          style={styles.topIconBtn}>
          <Bell size={22} color={colors.ink} strokeWidth={2} />
          {badge > 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.badgeRed }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          onPress={toggleTheme}
          accessibilityLabel={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
          style={styles.topIconBtn}>
          {theme === 'dark' ? (
            <Sun size={22} color={colors.ink} strokeWidth={2} />
          ) : (
            <Moon size={22} color={colors.ink} strokeWidth={2} />
          )}
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ShopProfile')}
          accessibilityLabel="Open profile"
          style={[styles.avatar, { backgroundColor: colors.green100 }]}>
          <Text style={[styles.avatarText, { color: colors.green700 }]}>
            {initialLetter(identity.name)}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          { backgroundColor: colors.card, borderTopColor: colors.line },
        ]}>
        {TAB_DEFS.map(tab => {
          const isActive = activeTab === tab.key;
          const color = isActive ? colors.green700 : colors.muted;
          return (
            <Pressable
              key={tab.key}
              onPress={() => navigation.navigate(tab.route)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[
                styles.tab,
                isActive ? { backgroundColor: colors.green50 } : null,
              ]}>
              {tab.icon(color)}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color,
                    fontFamily: isActive
                      ? fontFamily.bold
                      : fontFamily.medium,
                  },
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {toast ? (
        <View style={[styles.toast, { backgroundColor: colors.green950 }]}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function PageTitle({ children }: { children: ReactNode }) {
  const { colors } = useApp();
  return (
    <Text style={[styles.pageTitle, { color: colors.ink }]}>{children}</Text>
  );
}

export function PageSub({ children }: { children: ReactNode }) {
  const { colors } = useApp();
  return <Text style={[styles.pageSub, { color: colors.muted }]}>{children}</Text>;
}

export function SectionLabel({ children }: { children: string }) {
  const { colors } = useApp();
  return (
    <Text style={[styles.sectionLabel, { color: colors.muted }]}>{children}</Text>
  );
}

export function ListCard({ children }: { children: ReactNode }) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.listCard,
        { backgroundColor: colors.card, borderColor: colors.line },
      ]}>
      {children}
    </View>
  );
}

export function RowButton({
  onPress,
  leading,
  aside,
  children,
}: {
  onPress: () => void;
  leading?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.rowItem, { borderBottomColor: colors.line }]}>
      {leading}
      <View style={styles.rowMain}>{children}</View>
      {aside}
      <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
    </Pressable>
  );
}

export function RowTitle({ children }: { children: string }) {
  const { colors } = useApp();
  return <Text style={[styles.rowTitle, { color: colors.ink }]}>{children}</Text>;
}

export function RowSub({ children }: { children: ReactNode }) {
  const { colors } = useApp();
  return <Text style={[styles.rowSub, { color: colors.muted }]}>{children}</Text>;
}

export function Pill({
  tone,
  children,
}: {
  tone: 'pending' | 'active' | 'rejected';
  children: string;
}) {
  const { colors } = useApp();
  const style =
    tone === 'pending'
      ? { backgroundColor: colors.amberBg, color: colors.amber }
      : tone === 'active'
        ? { backgroundColor: colors.green100, color: colors.green900 }
        : { backgroundColor: colors.grayBg, color: colors.grayTx };
  return (
    <Text style={[styles.pill, { backgroundColor: style.backgroundColor, color: style.color }]}>
      {children}
    </Text>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.chipRow}>{children}</View>;
}

export function Chip({
  active,
  onPress,
  children,
}: {
  active: boolean;
  onPress: () => void;
  children: string;
}) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.green : colors.card,
          borderColor: active ? colors.green : colors.line,
        },
      ]}>
      <Text
        style={[
          styles.chipText,
          { color: active ? colors.white : colors.muted },
        ]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function DetailCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.detailCard,
        { backgroundColor: colors.card, borderColor: colors.line },
      ]}>
      {title ? (
        <Text style={[styles.detailTitle, { color: colors.green700 }]}>{title}</Text>
      ) : null}
      {children}
    </View>
  );
}

export function Kv({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  const { colors } = useApp();
  return (
    <View style={[styles.kv, { borderBottomColor: colors.line }]}>
      <Text style={[styles.kvLabel, { color: colors.muted }]}>{label}</Text>
      <Text
        style={[
          styles.kvValue,
          { color: ok ? colors.green700 : colors.ink },
        ]}>
        {value}
      </Text>
    </View>
  );
}

export function HistoryList({ items }: { items: ActivityItem[] }) {
  const { colors } = useApp();
  return (
    <View style={styles.historyWrap}>
      {items.map((a, i) => {
        const dot =
          a.c === 'amber'
            ? '#d97706'
            : a.c === 'red'
              ? colors.badgeRed
              : a.c === 'gray'
                ? '#c3cec5'
                : a.c === 'blue'
                  ? '#2563eb'
                  : colors.green;
        return (
          <View
            key={a.t + '|' + a.s + '|' + i}
            style={[
              styles.historyRow,
              i < items.length - 1
                ? { borderBottomColor: colors.line, borderBottomWidth: 1 }
                : null,
            ]}>
            <View style={[styles.dot, { backgroundColor: dot }]} />
            <View style={styles.flex}>
              <Text style={[styles.historyTitle, { color: colors.ink }]}>
                {a.t}
              </Text>
              <Text style={[styles.historySub, { color: colors.muted }]}>
                {a.s}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function TimelineList({
  steps,
}: {
  steps: { title: string; detail: string }[];
}) {
  const { colors } = useApp();
  return (
    <View style={styles.timeline}>
      <View style={[styles.timelineLine, { backgroundColor: colors.green200 }]} />
      {steps.map((s, i) => (
        <View
          key={s.title + '|' + i}
          style={[
            styles.timelineRow,
            i < steps.length - 1 ? { paddingBottom: 18 } : { paddingBottom: 2 },
          ]}>
          <View style={[styles.timelineIcon, { backgroundColor: colors.green }]}>
            <Check size={16} color={colors.white} strokeWidth={2.4} />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.timelineTitle, { color: colors.ink }]}>
              {s.title}
            </Text>
            <Text style={[styles.timelineDetail, { color: colors.muted }]}>
              {s.detail}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'email-address';
  secureTextEntry?: boolean;
  multiline?: boolean;
  hint?: string;
}) {
  const { colors } = useApp();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.ink }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.chev}
        keyboardType={keyboardType ?? 'default'}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.line,
            color: colors.ink,
          },
        ]}
      />
      {hint ? (
        <Text style={[styles.hint, { color: colors.muted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

export function ErrorText({ message }: { message: string }) {
  const { colors } = useApp();
  if (!message) {
    return null;
  }
  return (
    <Text style={[styles.errorText, { color: colors.red }]}>{message}</Text>
  );
}

export function AutoBox({ label, value }: { label: string; value: string }) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.autoBox,
        { backgroundColor: colors.green50, borderColor: colors.green100 },
      ]}>
      <Text style={[styles.autoBoxLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.autoBoxValue, { color: colors.green900 }]}>{value}</Text>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  danger,
  ghost,
}: {
  title: string;
  onPress: () => void;
  danger?: boolean;
  ghost?: boolean;
}) {
  const { colors } = useApp();
  const backgroundColor = danger
    ? colors.red
    : ghost
      ? 'transparent'
      : colors.green;
  const textColor = ghost ? colors.green700 : colors.white;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: ghost ? colors.line : 'transparent',
          borderWidth: ghost ? 1 : 0,
        },
      ]}>
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

export function EmptyNote({ children }: { children: string }) {
  const { colors } = useApp();
  return (
    <Text style={[styles.emptyNote, { color: colors.muted }]}>{children}</Text>
  );
}

export function QrThumb({ value }: { value: string }) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.qrThumb,
        { backgroundColor: colors.white, borderColor: colors.line },
      ]}>
      <QRCode value={value} size={34} />
    </View>
  );
}

export function QrBig({ value }: { value: string }) {
  const { colors } = useApp();
  return (
    <View style={styles.qrBig}>
      <View
        style={[
          styles.qrFrame,
          { backgroundColor: colors.white, borderColor: colors.line },
        ]}>
        <QRCode value={value} size={148} />
      </View>
    </View>
  );
}

export function SettingSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { colors } = useApp();
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.grayBg, true: colors.green }}
      thumbColor={colors.white}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: spacing.screen, paddingBottom: spacing.screenPaddingBottom },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.appTopPaddingX,
    paddingTop: spacing.appTopPaddingTop,
    paddingBottom: spacing.appTopPaddingBottom,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  topIconBtn: { minWidth: 40, minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  backGlyph: { fontSize: 22, fontFamily: fontFamily.bold },
  logo: { width: 40, height: 40, borderRadius: radius.logoSm },
  who: { flex: 1, minWidth: 0 },
  whoTitle: { fontSize: 16, fontFamily: fontFamily.extraBold },
  whoSub: { fontSize: 12, fontFamily: fontFamily.bold },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#ffffff', fontSize: 11, fontFamily: fontFamily.bold },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 17, fontFamily: fontFamily.extraBold },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: spacing.bottomNavPadding,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 2,
  },
  tabLabel: { fontSize: fontSize.navLabel },
  toast: {
    position: 'absolute',
    left: spacing.screen,
    right: spacing.screen,
    bottom: 84,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  toastText: { color: '#ffffff', fontSize: fontSize.toast, fontFamily: fontFamily.semiBold },
  pageTitle: {
    fontSize: fontSize.pageTitle,
    fontFamily: fontFamily.extraBold,
    letterSpacing: -0.21,
    marginTop: 2,
    marginBottom: 4,
  },
  pageSub: { fontSize: 13.5, fontFamily: fontFamily.semiBold, marginBottom: spacing.lg },
  sectionLabel: {
    fontSize: fontSize.sectionLabel,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.72,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 10,
  },
  listCard: { borderWidth: 1, borderRadius: radius.card, overflow: 'hidden' },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  rowMain: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 14.5, fontFamily: fontFamily.extraBold },
  rowSub: { fontSize: 12.5, fontFamily: fontFamily.semiBold, marginTop: 2, lineHeight: 18 },
  pill: {
    fontSize: fontSize.pill,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.3,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  chipRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  chip: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1.5,
    borderRadius: radius.chip,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  chipText: { fontSize: fontSize.chip, fontFamily: fontFamily.extraBold },
  detailCard: { borderWidth: 1, borderRadius: radius.card, padding: spacing.cardPadding, marginBottom: 14 },
  detailTitle: {
    fontSize: 13,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.65,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
  kvLabel: { fontSize: 13.5, fontFamily: fontFamily.bold },
  kvValue: { fontSize: 13.5, fontFamily: fontFamily.extraBold, textAlign: 'right', flexShrink: 1 },
  historyWrap: { paddingVertical: 6, paddingHorizontal: 15 },
  historyRow: { flexDirection: 'row', gap: 10, paddingVertical: 8 },
  dot: { width: 9, height: 9, borderRadius: 5, marginTop: 5 },
  historyTitle: { fontSize: 13, fontFamily: fontFamily.extraBold },
  historySub: { fontSize: 13, fontFamily: fontFamily.semiBold },
  timeline: { position: 'relative' },
  timelineLine: { position: 'absolute', left: 15, top: 10, bottom: 10, width: 2 },
  timelineRow: { flexDirection: 'row', paddingLeft: 0, gap: 14 },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineTitle: { fontSize: 14, fontFamily: fontFamily.extraBold },
  timelineDetail: { fontSize: 12.5, fontFamily: fontFamily.semiBold, lineHeight: 19, marginTop: 2 },
  field: { marginBottom: spacing.fieldMarginBottom },
  fieldLabel: { fontSize: 13.5, fontFamily: fontFamily.bold, marginBottom: spacing.labelMarginBottom },
  input: {
    borderWidth: 1,
    borderRadius: radius.input,
    minHeight: 44,
    paddingHorizontal: spacing.inputPaddingX,
    paddingVertical: spacing.inputPaddingY,
    fontSize: fontSize.input,
    fontFamily: fontFamily.regular,
  },
  hint: { fontSize: 12, fontFamily: fontFamily.semiBold, lineHeight: 17, marginTop: 6 },
  errorText: { fontSize: 13.5, fontFamily: fontFamily.bold, marginBottom: spacing.md },
  autoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingVertical: 11,
    paddingHorizontal: spacing.md,
    marginBottom: 14,
  },
  autoBoxLabel: { fontSize: 13, fontFamily: fontFamily.bold },
  autoBoxValue: { fontSize: 13, fontFamily: fontFamily.extraBold },
  button: {
    minHeight: 44,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
  },
  buttonText: { fontSize: fontSize.button, fontFamily: fontFamily.extraBold },
  emptyNote: {
    paddingVertical: 22,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
    fontSize: 13.5,
    fontFamily: fontFamily.bold,
  },
  qrThumb: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 9,
    padding: 3,
    marginTop: 2,
  },
  qrBig: { alignItems: 'center', paddingTop: 4, paddingBottom: 14 },
  qrFrame: { borderWidth: 1, borderRadius: 14, padding: 12 },
});

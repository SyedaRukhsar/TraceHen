// Farm app chrome — the .app-top header + .bottom-nav from farm.html,
// shared by every Farm screen. Header: back arrow (when there is a back
// stack), poultry logo photo, "TraceHen Farm" + view subtitle, bell with
// unread badge, theme button, avatar (→ Profile). Bottom nav: Home /
// Batches / Dispatch / Settings, active tab green-700 on green-50.

import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  House,
  Moon,
  Package,
  Settings,
  Sun,
  Truck,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { images } from '../../theme/assets';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { initials, isSeedNotifsRead } from './farmHelpers';

export type FarmTab = 'home' | 'batches' | 'dispatch' | 'settings';

const TAB_ROUTES: Record<FarmTab, keyof RootStackParamList> = {
  home: 'FarmHome',
  batches: 'FarmBatches',
  dispatch: 'FarmDispatch',
  settings: 'FarmSettings',
};

const TABS: { key: FarmTab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'batches', label: 'Batches' },
  { key: 'dispatch', label: 'Dispatch' },
  { key: 'settings', label: 'Settings' },
];

function TabIcon({ tab, color }: { tab: FarmTab; color: string }) {
  const props = { size: 22, color, strokeWidth: 2 };
  switch (tab) {
    case 'home':
      return <House {...props} />;
    case 'batches':
      return <Package {...props} />;
    case 'dispatch':
      return <Truck {...props} />;
    case 'settings':
      return <Settings {...props} />;
    default:
      return <House {...props} />;
  }
}

export function FarmScreen({
  subtitle,
  activeTab,
  children,
}: {
  subtitle: string;
  activeTab: FarmTab;
  children: ReactNode;
}) {
  const {
    colors,
    theme,
    toggleTheme,
    currentUser,
    data,
    unreadCount,
    scopeKey,
    toast,
  } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  // Narrow phones (< 380dp) use a compact header so the title and all
  // buttons fit with safe margins; wider screens keep the exact locked sizes.
  const { width } = useWindowDimensions();
  const compact = width < 380;

  // Bell badge (farm.js notifUnread): live unread + the demo seed
  // notifications until the Notifications screen is opened once.
  const seedCount =
    scopeKey === '__demo__' && !isSeedNotifsRead()
      ? data.notifications.farm.length
      : 0;
  const badge = unreadCount + seedCount;
  const avatarLabel = initials(currentUser?.name ?? 'Haji Tariq');
  const canGoBack = navigation.canGoBack();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.appBg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.line },
          compact ? { paddingHorizontal: 12, gap: 6 } : null,
        ]}
      >
        {canGoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            style={[
              styles.backBtn,
              {
                borderColor: colors.line,
                backgroundColor: colors.green50,
              },
              compact ? { width: 32, height: 32 } : null,
            ]}
          >
            <ArrowLeft size={20} color={colors.green900} strokeWidth={2.4} />
          </Pressable>
        ) : null}
        <Image
          source={images.heroFarm}
          style={[styles.logo, compact ? { width: 34, height: 34 } : null]}
        />
        <View style={styles.who}>
          <Text
            style={[
              styles.whoTitle,
              { color: colors.ink },
              compact ? { fontSize: 14 } : null,
            ]}
            numberOfLines={1}
          >
            TraceHen Farm
          </Text>
          <Text
            style={[styles.whoSub, { color: colors.muted }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('FarmNotifications')}
          accessibilityLabel="Notifications"
          style={[
            styles.iconBtn,
            { borderColor: colors.line, backgroundColor: colors.green50 },
            compact ? { width: 34, height: 34 } : null,
          ]}
        >
          <Bell size={20} color={colors.green900} />
          {badge > 0 ? (
            <View
              style={[styles.badge, { backgroundColor: colors.badgeRed }]}
            >
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          onPress={toggleTheme}
          accessibilityLabel={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
          style={[
            styles.iconBtn,
            { borderColor: colors.line, backgroundColor: colors.green50 },
            compact ? { width: 34, height: 34 } : null,
          ]}
        >
          {theme === 'dark' ? (
            <Sun size={20} color={colors.green900} />
          ) : (
            <Moon size={20} color={colors.green900} />
          )}
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('FarmProfile')}
          accessibilityLabel="Open profile"
          style={[
            styles.avatar,
            { backgroundColor: colors.green950 },
            compact ? { width: 34, height: 34, borderRadius: 17 } : null,
          ]}
        >
          <Text
            style={[styles.avatarText, compact ? { fontSize: 13 } : null]}
          >
            {avatarLabel}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          { backgroundColor: colors.card, borderTopColor: colors.line },
        ]}
      >
        {TABS.map(tab => {
          const active = tab.key === activeTab;
          const color = active ? colors.green700 : colors.muted;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                const target: { name: keyof RootStackParamList } = {
                  name: TAB_ROUTES[tab.key],
                };
                navigation.reset({ index: 0, routes: [target] });
              }}
              style={[
                styles.navBtn,
                active ? { backgroundColor: colors.green50 } : null,
              ]}
            >
              <TabIcon tab={tab.key} color={color} />
              <Text style={[styles.navLabel, { color }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {toast ? (
        <View
          style={[styles.toast, { backgroundColor: colors.green950 }]}
        >
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  } as ViewStyle,
  flex: {
    flex: 1,
  } as ViewStyle,
  content: {
    padding: spacing.screen,
    paddingTop: spacing.screenPaddingTop,
    paddingBottom: spacing.screenPaddingBottom,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: spacing.appTopPaddingX,
    borderBottomWidth: 1,
  } as ViewStyle,
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.appTopIcon,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,
  logo: {
    width: 40,
    height: 40,
    borderRadius: radius.logoSm,
  },
  who: {
    flex: 1,
    minWidth: 0,
  } as ViewStyle,
  whoTitle: {
    fontSize: 16,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  whoSub: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.appTopIcon,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
  } as ViewStyle,
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,
  avatarText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: spacing.bottomNavPadding,
  } as ViewStyle,
  navBtn: {
    flex: 1,
    borderRadius: radius.appTopIcon,
    paddingTop: 7,
    paddingBottom: 5,
    paddingHorizontal: 2,
    alignItems: 'center',
    gap: 3,
    minHeight: 52,
  } as ViewStyle,
  navLabel: {
    fontSize: fontSize.navLabel,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 92,
    borderRadius: radius.input,
    paddingVertical: 12,
    paddingHorizontal: 14,
  } as ViewStyle,
  toastText: {
    color: '#ffffff',
    fontSize: fontSize.toast,
    fontFamily: fontFamily.semiBold,
  } as TextStyle,
});

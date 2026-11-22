// Consumer app chrome — the `.app-top` header and the Scan / Settings bottom
// nav shared by the Consumer screens. Built from the locked consumer.html
// header + bottom nav, with the exact labels, icons and behaviour.
// (The shared src/components AppHeader / BottomNav do not match the current
// theme tokens or the Consumer routes, so the Consumer chrome lives here.)

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Bell, Moon, ScanLine, Settings, Sun } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../services/store';
import { images } from '../../theme/assets';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import type { ThemeColors } from '../../theme/colors';
import type { RootStackParamList } from '../../navigation/types';

// The store keeps the demo consumer's seeded notifications in the shared
// dataset (data.notifications.consumer) rather than in the per-user bell
// list, so the header badge counts them until the Notifications screen has
// been opened once this session. Session-only, like the rest of the demo.
let consumerSeedsRead = false;

export function markConsumerSeedsRead(): void {
  consumerSeedsRead = true;
}

export interface ConsumerHeaderProps {
  subtitle: string;
  showBack: boolean;
  onBack?: () => void;
}

export function ConsumerHeader({ subtitle, showBack, onBack }: ConsumerHeaderProps) {
  const { colors, theme, toggleTheme, currentUser, unreadCount, data, scopeKey } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Narrow phones (< 380dp) use a compact bar so the title and all buttons
  // fit with safe margins; wider screens keep the exact locked sizes.
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const styles = makeStyles(colors, compact);
  const initial = currentUser ? currentUser.name.trim().charAt(0).toUpperCase() : 'G';
  const isDemoConsumer = scopeKey === '__demo__' && currentUser?.role === 'consumer';
  const seedCount =
    isDemoConsumer && !consumerSeedsRead ? data.notifications.consumer.length : 0;
  const badge = unreadCount + seedCount;

  return (
    <View style={styles.top}>
      {showBack ? (
        <Pressable
          style={styles.backButton}
          onPress={onBack ?? (() => navigation.goBack())}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={colors.ink} strokeWidth={2.4} />
        </Pressable>
      ) : null}
      <Image source={images.heroFarm} style={styles.logo} />
      <View style={styles.who}>
        <Text style={styles.whoTitle} numberOfLines={1}>
          TraceHen Consumer
        </Text>
        <Text style={styles.whoSub} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Pressable
        style={styles.iconButton}
        onPress={() => navigation.navigate('ConsumerNotifications')}
        accessibilityLabel="Notifications"
      >
        <Bell size={20} color={colors.green900} strokeWidth={2} />
        {badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </Pressable>
      <Pressable
        style={styles.iconButton}
        onPress={toggleTheme}
        accessibilityLabel={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? (
          <Sun size={20} color={colors.green900} strokeWidth={2} />
        ) : (
          <Moon size={20} color={colors.green900} strokeWidth={2} />
        )}
      </Pressable>
      <Pressable
        style={styles.avatar}
        onPress={() => navigation.navigate('ConsumerProfile')}
        accessibilityLabel="Open profile"
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </Pressable>
    </View>
  );
}

export interface ConsumerBottomNavProps {
  active: 'scan' | 'settings';
}

export function ConsumerBottomNav({ active }: ConsumerBottomNavProps) {
  const { colors } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors);
  const tabs = [
    {
      key: 'scan' as const,
      label: 'Scan',
      route: 'ConsumerScan' as const,
      icon: <ScanLine size={22} color={active === 'scan' ? colors.green700 : colors.muted} strokeWidth={2} />,
    },
    {
      key: 'settings' as const,
      label: 'Settings',
      route: 'ConsumerSettings' as const,
      icon: <Settings size={22} color={active === 'settings' ? colors.green700 : colors.muted} strokeWidth={2} />,
    },
  ];
  return (
    <View style={[styles.bottomNav, { paddingBottom: spacing.bottomNavPadding + insets.bottom }]}>
      {tabs.map(tab => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive ? styles.tabActive : undefined]}
            onPress={() => navigation.navigate(tab.route)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            {tab.icon}
            <Text style={[styles.tabLabel, { color: isActive ? colors.green700 : colors.muted }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: ReactNode;
}

export function PrimaryButton({ title, onPress, icon }: PrimaryButtonProps) {
  const { colors } = useApp();
  const styles = makeStyles(colors);
  return (
    <Pressable
      style={({ pressed }) => [styles.primaryButton, pressed ? styles.primaryButtonPressed : undefined]}
      onPress={onPress}
    >
      {icon}
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

function makeStyles(colors: ThemeColors, compact = false) {
  return StyleSheet.create({
    top: {
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      paddingTop: spacing.appTopPaddingTop,
      paddingBottom: spacing.appTopPaddingBottom,
      paddingHorizontal: compact ? 12 : spacing.appTopPaddingX,
      flexDirection: 'row',
      alignItems: 'center',
      gap: compact ? 6 : spacing.gapSm + 3,
    },
    backButton: {
      width: compact ? 30 : 32,
      height: compact ? 30 : 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: compact ? 34 : 40,
      height: compact ? 34 : 40,
      borderRadius: radius.logoSm,
    },
    who: {
      flex: 1,
      minWidth: 0,
    },
    whoTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: compact ? 14 : fontSize.md,
      color: colors.ink,
    },
    whoSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.caption,
      color: colors.muted,
      marginTop: 1,
    },
    iconButton: {
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
      top: -6,
      right: -6,
      minWidth: 18,
      height: 18,
      borderRadius: radius.pill,
      backgroundColor: colors.badgeRed,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    badgeText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 10,
      color: colors.white,
    },
    avatar: {
      width: compact ? 34 : 42,
      height: compact ? 34 : 42,
      borderRadius: compact ? 17 : 21,
      backgroundColor: colors.green950,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: fontFamily.extraBold,
      fontSize: compact ? 13 : 15,
      color: colors.white,
    },
    bottomNav: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.line,
      paddingTop: spacing.bottomNavPadding,
      paddingHorizontal: spacing.bottomNavPadding,
    },
    tab: {
      flex: 1,
      borderRadius: radius.md,
      paddingTop: 7,
      paddingBottom: 5,
      alignItems: 'center',
      gap: 3,
      minHeight: 52,
    },
    tabActive: {
      backgroundColor: colors.green50,
    },
    tabLabel: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.navLabel,
    },
    primaryButton: {
      backgroundColor: colors.green,
      borderRadius: radius.button,
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.gapSm,
      paddingVertical: spacing.buttonPaddingY,
      paddingHorizontal: spacing.buttonPaddingX,
    },
    primaryButtonPressed: {
      opacity: 0.85,
    },
    primaryButtonText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.button,
      color: colors.white,
    },
  });
}

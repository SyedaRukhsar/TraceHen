// Top bar — CSS `.app-top`: back arrow (when onBack is provided), logo photo
// (sm 40px), title + subtitle, bell with unread badge, theme toggle, avatar.
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { images } from '../theme/assets';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showBell?: boolean;
  unreadCount?: number;
  onBellPress?: () => void;
  showTheme?: boolean;
  onThemePress?: () => void;
  avatarInitial?: string;
  onAvatarPress?: () => void;
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  showBell = false,
  unreadCount = 0,
  onBellPress,
  showTheme = true,
  onThemePress,
  avatarInitial,
  onAvatarPress,
}: AppHeaderProps) {
  const { colors, theme, toggleTheme, currentUser } = useApp();

  const initial = avatarInitial ?? (currentUser ? currentUser.name.charAt(0).toUpperCase() : '');
  const handleThemePress = onThemePress ?? toggleTheme;

  return (
    <View style={[styles.bar, { backgroundColor: colors.card, borderBottomColor: colors.line }]}>
      {showBack ? (
        <Pressable
          onPress={onBack}
          style={[styles.iconButton, { borderColor: colors.line, backgroundColor: colors.green50 }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrowLeft" size={20} color={colors.green900} strokeWidth={2.4} />
        </Pressable>
      ) : null}
      <Image source={images.heroFarm} style={styles.logo} />
      <View style={styles.who}>
        <Text style={[styles.title, { color: colors.ink }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.muted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {showBell ? (
        <Pressable
          onPress={onBellPress}
          style={[styles.iconButton, styles.bellButton, { borderColor: colors.line, backgroundColor: colors.green50 }]}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Icon name="bell" size={20} color={colors.green900} />
          {unreadCount > 0 ? (
            <View style={[styles.badge, { borderColor: colors.card }]}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : String(unreadCount)}</Text>
            </View>
          ) : null}
        </Pressable>
      ) : null}
      {showTheme ? (
        <Pressable
          onPress={handleThemePress}
          style={[styles.iconButton, { borderColor: colors.line, backgroundColor: colors.green50 }]}
          accessibilityRole="button"
          accessibilityLabel="Switch theme"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} color={colors.green900} />
        </Pressable>
      ) : null}
      <Pressable
        onPress={onAvatarPress}
        style={[styles.avatar, { backgroundColor: colors.green950 }]}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: 1,
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flexShrink: 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bellButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc2626',
    minWidth: 18,
    height: 18,
    borderRadius: 99,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: fontForWeight(800),
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    flexShrink: 0,
  },
  who: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontFamily: fontForWeight(800),
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fontForWeight(700),
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: fontForWeight(800),
  },
});

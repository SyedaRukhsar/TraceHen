// Vet Notifications — bell list (farm inspection requests, Admin approval).
// Locked source: modules/vet.html #vet-view-notifications, modules/vet.js
// renderNotifs. Marked read on open.

import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import type { AppNotification } from '../../types/models';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { ListCard } from '../../components/ListCard';
import { ScreenLayout } from '../../components/ScreenLayout';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

function dotColor(c: string, colors: { green: string; amber: string; red: string; chev: string }): string {
  if (c === 'amber') {
    return colors.amber;
  }
  if (c === 'red') {
    return colors.red;
  }
  if (c === 'gray') {
    return colors.chev;
  }
  return colors.green;
}

export default function VetNotificationsScreen() {
  const navigation = useNavigation<VetNavigation>();
  const { colors, data, scopeKey, notifications, unreadCount, currentUser, markNotificationsRead } =
    useApp();

  const isDemo = scopeKey === '__demo__';
  const vetName = currentUser ? currentUser.name : 'Dr. Usman';

  function goTab(tab: string): void {
    if (tab === 'home') {
      navigation.navigate('VetHome');
    } else if (tab === 'inspections') {
      navigation.navigate('VetInspections');
    } else if (tab === 'certificates') {
      navigation.navigate('VetCertificates');
    } else if (tab === 'settings') {
      navigation.navigate('VetSettings');
    }
  }

  useEffect(() => {
    markNotificationsRead();
  }, [markNotificationsRead]);

  // Bell list: live store notifications first, then the demo seed
  // notifications (the store does not seed them for the demo vet yet).
  // Dedupe on title + subtitle so a later store seeding cannot double-show.
  const list = useMemo<AppNotification[]>(() => {
    const seed = isDemo ? data.notifications.vet : [];
    const seen = new Set(notifications.map(n => `${n.t}|${n.s}`));
    const extra = seed.filter(n => !seen.has(`${n.t}|${n.s}`));
    return [...notifications, ...extra];
  }, [notifications, data.notifications.vet, isDemo]);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
    },
    historyRow: {
      flexDirection: 'row',
      gap: spacing.gapSm,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    historyRowLast: {
      borderBottomWidth: 0,
    },
    flexOne: {
      flex: 1,
    },
    dot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      marginTop: 5,
      flexShrink: 0,
    },
    historyTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.small,
      color: colors.ink,
    },
    historySub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
    },
  });

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Notifications"
        showBack
        onBack={() => navigation.goBack()}
        unreadCount={unreadCount}
        showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
        onAvatarPress={() => navigation.navigate('VetProfile')}
                avatarInitial={initials(vetName)}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>Notifications</Text>
        <ListCard>
          {list.map((item, index) => (
            <View
              key={`${item.t}|${item.s}`}
              style={[styles.historyRow, index === list.length - 1 ? styles.historyRowLast : null]}
            >
              <View style={[styles.dot, { backgroundColor: dotColor(item.c, colors) }]} />
              <View style={styles.flexOne}>
                <Text style={styles.historyTitle}>{item.t}</Text>
                <Text style={styles.historySub}>{item.s}</Text>
              </View>
            </View>
          ))}
        </ListCard>
      </ScreenLayout>
      <BottomNav role="vet" active="notifications" onTab={goTab} />
    </View>
  );
}

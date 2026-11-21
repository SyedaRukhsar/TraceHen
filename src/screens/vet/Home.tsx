// Vet Home (Dashboard) — stat cards + Latest Activity only.
// Locked source: modules/vet.html #vet-view-home, modules/vet.js renderHome.
// Demo: Dr. Usman, Usman Veterinary Clinic, V3. A new (non-demo) user sees
// an empty dashboard (0 counts, no activity).

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import type { ActivityItem } from '../../types/models';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { ListCard } from '../../components/ListCard';
import { ScreenLayout } from '../../components/ScreenLayout';
import { StatCard } from '../../components/StatCard';

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

export default function VetHomeScreen() {
  const navigation = useNavigation<VetNavigation>();
  const { colors, data, scopeKey, activity, unreadCount, currentUser } = useApp();

  const isDemo = scopeKey === '__demo__';
  const inspections = isDemo ? data.inspections : [];
  const certificates = isDemo ? data.certificates : [];
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
  const clinicName = isDemo ? 'Usman Veterinary Clinic' : (currentUser ? currentUser.business : '');

  const pending = inspections.filter(i => i.status === 'PENDING').length;
  const approved = inspections.filter(i => i.status === 'APPROVED').length;
  const hold = inspections.filter(i => i.status === 'HOLD').length;

  // Latest Activity: live store activity first, then the demo seed activity
  // (the store does not seed per-user activity for the demo vet yet).
  // Dedupe on title + subtitle so a later store seeding cannot double-show.
  const homeActivity = useMemo<ActivityItem[]>(() => {
    const seed = isDemo ? data.activity.vet : [];
    const seen = new Set(activity.map(a => `${a.t}|${a.s}`));
    const extra = seed.filter(a => !seen.has(`${a.t}|${a.s}`));
    return [...activity, ...extra];
  }, [activity, data.activity.vet, isDemo]);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBg,
    },    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
    },
    pageSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginTop: spacing.xs,
    },
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.gap,
      marginTop: spacing.lg,
    },
    statCell: {
      flexGrow: 1,
      flexBasis: '48%',
    },
    sectionLabel: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.sectionLabel,
      letterSpacing: 0.72,
      textTransform: 'uppercase',
      color: colors.muted,
      marginTop: spacing.sectionGap,
      marginBottom: spacing.sm,
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
        subtitle="Home"
        showBack={false}
        unreadCount={unreadCount}
        showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
        onAvatarPress={() => navigation.navigate('VetProfile')}
                avatarInitial={initials(vetName)}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>Home</Text>
        <Text style={styles.pageSub}>
          {isDemo ? 'Usman Veterinary Clinic · V3 · Faisalabad' : clinicName}
        </Text>
        <View style={styles.statGrid}>
          <View style={styles.statCell}>
            <StatCard label="Pending Inspections" value={String(pending)} icon="clock" tone="amber" />
          </View>
          <View style={styles.statCell}>
            <StatCard label="Approved" value={String(approved)} icon="checkCircle" />
          </View>
          <View style={styles.statCell}>
            <StatCard label="On Hold" value={String(hold)} icon="pause" tone="amber" />
          </View>
          <View style={styles.statCell}>
            <StatCard label="Certificates Issued" value={String(certificates.length)} icon="award" />
          </View>
        </View>
        <Text style={styles.sectionLabel}>Latest activity</Text>
        <ListCard>
          {homeActivity.map((item, index) => (
            <View
              key={`${item.t}|${item.s}`}
              style={[styles.historyRow, index === homeActivity.length - 1 ? styles.historyRowLast : null]}
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
      <BottomNav role="vet" active="home" onTab={goTab} />
    </View>
  );
}

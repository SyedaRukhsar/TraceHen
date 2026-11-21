// Vet Inspections — inspection list with filter chips.
// Locked source: modules/vet.html #vet-view-inspections, modules/vet.js
// renderInspections. Row: batch, farm (+ code), live count, visit date,
// status pill. Tap a row to open the inspection detail.

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import type { Inspection, InspectionStatus } from '../../types/models';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { Chip } from '../../components/Chip';
import { ChipRow } from '../../components/ChipRow';
import { ListCard } from '../../components/ListCard';
import { RowItem } from '../../components/RowItem';
import { ScreenLayout } from '../../components/ScreenLayout';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;

type Filter = 'ALL' | InspectionStatus;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'HOLD', label: 'On Hold' },
];

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function liveOf(i: Inspection): number {
  return i.placed - i.doa - i.deaths;
}

function statusLabel(s: InspectionStatus): string {
  if (s === 'PENDING') {
    return 'Pending';
  }
  if (s === 'APPROVED') {
    return 'Approved';
  }
  if (s === 'REJECTED') {
    return 'Rejected';
  }
  if (s === 'HOLD') {
    return 'On Hold';
  }
  return 'Follow-up';
}

function statusTone(s: InspectionStatus): 'active' | 'pending' | 'suspended' | 'info' | 'rejected' {
  if (s === 'APPROVED') {
    return 'active';
  }
  if (s === 'PENDING') {
    return 'pending';
  }
  if (s === 'REJECTED') {
    return 'suspended';
  }
  if (s === 'HOLD') {
    return 'info';
  }
  return 'rejected';
}

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

export default function VetInspectionsScreen() {
  const navigation = useNavigation<VetNavigation>();
  const { colors, data, scopeKey, unreadCount, currentUser } = useApp();
  const [filter, setFilter] = useState<Filter>('ALL');

  const isDemo = scopeKey === '__demo__';
  const inspections = isDemo ? data.inspections : [];
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
  const list = inspections.filter(i => filter === 'ALL' || i.status === filter);

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
    emptyNote: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      paddingVertical: spacing.md,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Inspections"
        showBack={false}
        unreadCount={unreadCount}
        showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
        onAvatarPress={() => navigation.navigate('VetProfile')}
                avatarInitial={initials(vetName)}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>Inspections</Text>
        <ChipRow>
          {FILTERS.map(f => (
            <Chip key={f.value} label={f.label} active={filter === f.value} onPress={() => setFilter(f.value)} />
          ))}
        </ChipRow>
        <ListCard>
          {list.map(i => (
            <RowItem
              key={i.batch}
              title={i.batch}
              subtitle={`${i.farm}${i.farmCode ? ` · ${i.farmCode}` : ''} · Live ${fmt(liveOf(i))}\nVisit date ${i.ready}`}
              pill={{ label: statusLabel(i.status), tone: statusTone(i.status) }}
              onPress={() => navigation.navigate('VetInspectionDetail', { id: i.batch })}
            />
          ))}
          {list.length === 0 ? <Text style={styles.emptyNote}>No inspections.</Text> : null}
        </ListCard>
      </ScreenLayout>
      <BottomNav role="vet" active="inspections" onTab={goTab} />
    </View>
  );
}

// Admin — Organizations & Sites (admin.html 1.3). Only live businesses
// (ACTIVE / SUSPENDED) ever appear here. Filter chips All / Active /
// Suspended, 3 per row. Tap a row to open the organization detail.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import {
  AdminBottomNav,
  AdminHeader,
  Pill,
  adminStyles,
  pillForOrg,
} from './AdminNav';

type OrgFilter = 'ALL' | 'ACTIVE' | 'SUSPENDED';

const FILTERS: { key: OrgFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'SUSPENDED', label: 'Suspended' },
];

export default function AdminOrganizationsScreen() {
  const { colors, organizations } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = adminStyles(colors);
  const [filter, setFilter] = useState<OrgFilter>('ALL');

  const list = organizations.filter(
    o =>
      (o.status === 'ACTIVE' || o.status === 'SUSPENDED') &&
      (filter === 'ALL' || o.status === filter),
  );

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Organizations" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>Organizations &amp; Sites</Text>
        <Text style={s.pageSub}>Approved businesses on TraceHen.</Text>
        <View style={s.chipRow}>
          {FILTERS.map(f => {
            const on = filter === f.key;
            return (
              <Pressable
                key={f.key}
                style={[s.chip, on ? s.chipOn : null]}
                onPress={() => setFilter(f.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
              >
                <Text style={[s.chipText, on ? s.chipTextOn : null]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={s.listCard}>
          {list.length === 0 ? (
            <Text style={s.emptyNote}>No organizations in this group yet.</Text>
          ) : (
            list.map((o, i) => {
              const pill = pillForOrg(o.status);
              return (
                <Pressable
                  key={o.id}
                  style={[s.rowItem, i === list.length - 1 ? { borderBottomWidth: 0 } : null]}
                  onPress={() => navigation.navigate('AdminOrganizationDetail', { id: o.id })}
                  accessibilityRole="button"
                >
                  <View style={s.rowMain}>
                    <Text style={s.rowTitle}>{o.name}</Text>
                    <Text style={s.rowSub}>
                      {o.type} · {o.tehsil} · License {o.license || '—'}
                      {'\n'}
                      {o.sites.length} site{o.sites.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <Pill label={pill.label} tone={pill.tone} />
                  <View style={s.chev}>
                    <ChevronRight size={18} color={colors.chev} strokeWidth={2} />
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
      <AdminBottomNav active="organizations" />
    </View>
  );
}

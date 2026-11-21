// Admin — Review Applications (admin.html 1.2). Filter chips in HTML order
// (All / Pending / More Info / Rejected / Approved), 3 per row. Tap a row
// to open the application detail.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import type { ApplicationStatus } from '../../types/models';
import {
  AdminBottomNav,
  AdminHeader,
  Pill,
  adminStyles,
  pillForApplication,
} from './AdminNav';

type AppFilter = 'ALL' | 'PENDING' | 'NEEDS_INFO' | 'REJECTED' | 'APPROVED';

const FILTERS: { key: AppFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'NEEDS_INFO', label: 'More Info' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'APPROVED', label: 'Approved' },
];

export default function AdminApplicationsScreen() {
  const { colors, applications } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = adminStyles(colors);
  const [filter, setFilter] = useState<AppFilter>('ALL');

  const list = applications.filter(a => {
    if (filter === 'ALL') {
      return true;
    }
    if (filter === 'APPROVED') {
      return a.status === 'APPROVED' || a.status === ('ACTIVE' as ApplicationStatus);
    }
    return a.status === filter;
  });

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Applications" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>Review Applications</Text>
        <Text style={s.pageSub}>New join requests waiting for review.</Text>
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
            <Text style={s.emptyNote}>No applications in this group yet.</Text>
          ) : (
            list.map((a, i) => {
              const pill = pillForApplication(a.status);
              return (
                <Pressable
                  key={a.id}
                  style={[s.rowItem, i === list.length - 1 ? { borderBottomWidth: 0 } : null]}
                  onPress={() => navigation.navigate('AdminApplicationDetail', { id: a.id })}
                  accessibilityRole="button"
                >
                  <View style={s.rowMain}>
                    <Text style={s.rowTitle}>{a.business}</Text>
                    <Text style={s.rowSub}>
                      {a.role} · {a.tehsil} · {a.documents.length} documents to check{'\n'}
                      By {a.person} · Submitted {a.submitted}
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
      <AdminBottomNav active="applications" />
    </View>
  );
}

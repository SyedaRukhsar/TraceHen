// Admin — Batches (admin.html batches list). Tap a batch to see its history.
// Rows copy the HTML seeded format: farm → plant, chicks placed → packs.

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
  fmtNum,
  pillForBatch,
} from './AdminNav';

export default function AdminBatchesScreen() {
  const { colors, adminBatches } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = adminStyles(colors);

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Batches" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>Batches</Text>
        <Text style={s.pageSub}>Tap a batch to see its history.</Text>
        <View style={s.listCard}>
          {adminBatches.length === 0 ? (
            <Text style={s.emptyNote}>No batches yet.</Text>
          ) : (
            adminBatches.map((b, i) => {
              const pill = pillForBatch(b.status);
              return (
                <Pressable
                  key={b.id}
                  style={[s.rowItem, i === adminBatches.length - 1 ? { borderBottomWidth: 0 } : null]}
                  onPress={() => navigation.navigate('AdminBatchDetail', { id: b.id })}
                  accessibilityRole="button"
                >
                  <View style={s.rowMain}>
                    <Text style={s.rowTitle}>{b.id}</Text>
                    <Text style={s.rowSub}>
                      {b.farm} → {b.plant}
                      {'\n'}
                      {fmtNum(b.placed)} chicks placed → {fmtNum(b.packs)} packs
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
      <AdminBottomNav active="home" />
    </View>
  );
}

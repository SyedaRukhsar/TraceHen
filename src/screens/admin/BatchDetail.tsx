// Admin — Batch detail (admin.html batch-detail). Count reconciliation
// (Placed − DOA = Started − lost = Ready = Loaded → At plant → Packs) and
// the chain history timeline — what the consumer sees. NO "CONSUMER SCAN
// RESULT" card (removed in the locked HTML). Batches mirrored from the
// Farm with no timeline yet show the Bird Count card instead.

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Check } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily } from '../../theme/typography';
import {
  AdminBottomNav,
  AdminHeader,
  DetailCard,
  KvRow,
  Pill,
  adminStyles,
  fmtNum,
  pillForBatch,
} from './AdminNav';

export default function AdminBatchDetailScreen() {
  const { colors, adminBatches } = useApp();
  const route = useRoute<RouteProp<RootStackParamList, 'AdminBatchDetail'>>();
  const s = adminStyles(colors);

  const batch = adminBatches.find(b => b.id === route.params.id);
  if (!batch) {
    return (
      <View style={s.root}>
        <AdminHeader subtitle="Batch Detail" />
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.emptyNote}>Batch not found.</Text>
        </ScrollView>
        <AdminBottomNav active="home" />
      </View>
    );
  }

  const pill = pillForBatch(batch.status);
  const alive = batch.placed - batch.doa;
  const afterDeaths = alive - batch.deaths;
  const live = afterDeaths;
  const remaining = live - batch.loaded;

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Batch Detail" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={[s.pageTitle, { marginTop: 6 }]}>{batch.id}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <Text style={[s.pageSub, { marginBottom: 0, flexShrink: 1 }]}>
            {batch.farm} → {batch.plant}
          </Text>
          <Pill label={pill.label} tone={pill.tone} />
        </View>

        <DetailCard title="Count reconciliation">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <ReconNum value={fmtNum(batch.placed)} label="Placed" />
            <Text style={reconStyles(colors).minus}>− {fmtNum(batch.doa)} DOA</Text>
            <ReconNum value={fmtNum(alive)} label="Started" />
            <Text style={reconStyles(colors).minus}>− {fmtNum(batch.deaths)} lost</Text>
            <ReconNum value={fmtNum(afterDeaths)} label="Ready" />
            <Text style={reconStyles(colors).eq}>=</Text>
            <ReconNum value={fmtNum(batch.loaded)} label="Loaded" />
            <Text style={reconStyles(colors).eq}>→</Text>
            <ReconNum value={fmtNum(batch.atPlant)} label="At plant" />
            <Text style={reconStyles(colors).eq}>→</Text>
            <ReconNum value={fmtNum(batch.packs)} label="Packs" highlight />
          </View>
        </DetailCard>

        {batch.timeline.length === 0 ? (
          <DetailCard title="Bird Count">
            <KvRow label="Placed" value={fmtNum(batch.placed)} />
            <KvRow label="Dead on arrival" value={fmtNum(batch.doa)} />
            <KvRow label="Deaths" value={fmtNum(batch.deaths)} />
            <KvRow label="Live birds" value={fmtNum(live)} />
            <KvRow label="Dispatched" value={fmtNum(batch.loaded)} />
            <KvRow label="Remaining" value={fmtNum(remaining)} ok />
          </DetailCard>
        ) : null}

        <DetailCard title="Chain history — what the consumer sees">
          {batch.timeline.length === 0 ? (
            <Text style={s.emptyNote}>No history yet.</Text>
          ) : (
            <View>
              {batch.timeline.map((t, i) => (
                <View
                  key={`${t.stage}-${i}`}
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    paddingBottom: i === batch.timeline.length - 1 ? 2 : 18,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.green,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={16} color={colors.white} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.extraBold,
                        fontSize: 14,
                        color: colors.ink,
                      }}
                    >
                      {t.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.semiBold,
                        fontSize: 12.5,
                        color: colors.muted,
                        lineHeight: 19,
                        marginTop: 2,
                      }}
                    >
                      {t.detail}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: 12,
                        color: colors.green700,
                        marginTop: 2,
                      }}
                    >
                      {t.when}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </DetailCard>
      </ScrollView>
      <AdminBottomNav active="home" />
    </View>
  );
}

function ReconNum({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  const { colors } = useApp();
  return (
    <View
      style={{
        backgroundColor: highlight === true ? colors.green100 : colors.green50,
        borderWidth: 1,
        borderColor: colors.green100,
        borderRadius: 9,
        paddingVertical: 6,
        paddingHorizontal: 9,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.ink }}>
        {value}
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.extraBold,
          fontSize: 10,
          color: colors.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const reconStyles = (colors: {
  red: string;
  green700: string;
}) => ({
  minus: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.red },
  eq: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.green700 },
});

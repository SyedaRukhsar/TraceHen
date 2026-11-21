// Mart Withdraw (MartWithdraw {packId}) — withdraw a pack. The reason is
// mandatory. On success the pack is marked Withdrawn with the reason and
// the activity is logged. This does NOT update the Consumer scan (no
// updateData call, no notification): pre-seeded withdrawn packs already
// scan as "Withdrawn at Mart — Damaged".

import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { AppButton } from '../../components/AppButton';
import { EmptyState } from '../../components/EmptyState';
import { FormField } from '../../components/FormField';
import { DEMO_TODAY, findPack, setPackOverride } from './packState';
import { DetailCard, FormError, Hint, MartShell, PageSub, PageTitle } from './martUi';

export default function MartWithdrawScreen() {
  const { data, scopeKey, currentUser, logActivity, showToast } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MartWithdraw'>>();
  const pack = findPack(scopeKey === '__demo__' ? data.shipments : [], route.params.packId);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!pack) {
    return (
      <MartShell title="Withdraw Pack" activeTab="stock" showBack>
        <EmptyState title="No packs." />
      </MartShell>
    );
  }
  const submit = () => {
    const reasonTrim = reason.trim();
    if (!reasonTrim) {
      setError('A reason is required to withdraw a pack.');
      return;
    }
    setError(null);
    setPackOverride(pack.id, { status: 'WITHDRAWN', reason: reasonTrim, date: DEMO_TODAY });
    logActivity(currentUser?.name ?? 'Salman', {
      t: `Pack withdrawn — ${pack.id}`,
      s: `${reasonTrim} · Removed from stock`,
      c: 'amber',
    });
    showToast(`Pack withdrawn — ${pack.id}.`);
    navigation.replace('MartPackDetail', { id: pack.id });
  };
  return (
    <MartShell title="Withdraw Pack" activeTab="stock" showBack>
      <PageTitle>Withdraw Pack</PageTitle>
      <PageSub>{`${pack.id} · Lot ${pack.shipment.lot}`}</PageSub>
      <DetailCard>
        <FormError message={error} />
        <FormField
          label="Reason"
          value={reason}
          onChangeText={setReason}
          placeholder="Why is this pack being withdrawn?"
          required
          multiline
        />
        <Hint>A reason is required — the pack leaves stock with this reason recorded.</Hint>
        <AppButton title="Withdraw Pack" variant="danger" onPress={submit} />
      </DetailCard>
    </MartShell>
  );
}

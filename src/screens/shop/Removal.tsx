// Shop Record Removal (shop.html shop-view-removal, shop.js openRemoval
// + removal submit). Count + mandatory reason.

import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { DEMO_TODAY, fmt, inCage } from './helpers';
import {
  AutoBox,
  DetailCard,
  EmptyNote,
  ErrorText,
  Field,
  PageSub,
  PageTitle,
  PrimaryButton,
  ShopLayout,
} from './ui';

export default function ShopRemovalScreen() {
  const { scopeKey, data, currentUser, updateData, logActivity, showToast } =
    useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ShopRemoval'>>();
  const isDemo = scopeKey === '__demo__';
  const c = (isDemo ? data.cages : []).find(x => x.id === route.params.cageId);
  const [countText, setCountText] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const byName = currentUser?.name ?? 'Zubair';

  if (!c) {
    return (
      <ShopLayout title="Record Removal" activeTab="stock">
        <EmptyNote>No cages.</EmptyNote>
      </ShopLayout>
    );
  }

  const confirm = () => {
    const n = parseInt(countText, 10);
    const reasonText = reason.trim();
    if (Number.isNaN(n) || n < 1) {
      setError('Enter the number of birds removed.');
      return;
    }
    if (n > inCage(c)) {
      setError('Only ' + fmt(inCage(c)) + ' birds are in the cage.');
      return;
    }
    if (!reasonText) {
      setError('A reason is required to remove birds from the cage.');
      return;
    }
    setError('');
    updateData(prev => ({
      ...prev,
      cages: prev.cages.map(x =>
        x.id === c.id
          ? {
              ...x,
              removals: [
                ...x.removals,
                { count: n, reason: reasonText, date: DEMO_TODAY },
              ],
            }
          : x,
      ),
    }));
    logActivity(byName, {
      t: fmt(n) + ' birds removed — Cage ' + c.id,
      s: reasonText + ' · ' + DEMO_TODAY,
      c: 'amber',
    });
    showToast(
      'Removal recorded — ' + fmt(n) + ' birds from Cage ' + c.id + '.',
    );
    navigation.replace('ShopCageDetail', { id: c.id });
  };

  return (
    <ShopLayout title="Record Removal" activeTab="stock">
      <PageTitle>Record Removal</PageTitle>
      <PageSub>
        {'Cage ' + c.id + ' · Batch ' + c.batch}
      </PageSub>
      <DetailCard>
        <ErrorText message={error} />
        <AutoBox label="Birds in cage" value={fmt(inCage(c)) + ' birds'} />
        <Field
          label="Birds removed *"
          value={countText}
          onChangeText={setCountText}
          placeholder="e.g. 2"
          keyboardType="number-pad"
        />
        <Field
          label="Reason *"
          value={reason}
          onChangeText={setReason}
          placeholder="Why are these birds being removed?"
          multiline
          hint="A reason is required — the birds leave the cage with this reason recorded."
        />
        <PrimaryButton title="Record Removal" danger onPress={confirm} />
      </DetailCard>
    </ShopLayout>
  );
}

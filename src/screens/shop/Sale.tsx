// Shop Record Sale (shop.html shop-view-sale, shop.js openSale +
// sale submit). Count + date only — no price.

import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fmt, inCage } from './helpers';
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

export default function ShopSaleScreen() {
  const { scopeKey, data, currentUser, updateData, logActivity, showToast } =
    useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ShopSale'>>();
  const isDemo = scopeKey === '__demo__';
  const c = (isDemo ? data.cages : []).find(x => x.id === route.params.cageId);
  const [countText, setCountText] = useState('');
  const [error, setError] = useState('');
  const byName = currentUser?.name ?? 'Zubair';

  if (!c) {
    return (
      <ShopLayout title="Record Sale" activeTab="stock">
        <EmptyNote>No cages.</EmptyNote>
      </ShopLayout>
    );
  }

  const confirm = () => {
    const n = parseInt(countText, 10);
    if (Number.isNaN(n) || n < 1) {
      setError('Enter the number of birds sold.');
      return;
    }
    if (n > inCage(c)) {
      setError('Only ' + fmt(inCage(c)) + ' birds are in the cage.');
      return;
    }
    setError('');
    updateData(prev => ({
      ...prev,
      cages: prev.cages.map(x =>
        x.id === c.id ? { ...x, sold: x.sold + n } : x,
      ),
    }));
    logActivity(byName, {
      t: fmt(n) + ' birds sold — Cage ' + c.id,
      s: 'Madina Live Chicken Shop',
      c: '',
    });
    showToast('Sale recorded — ' + fmt(n) + ' birds from Cage ' + c.id + '.');
    navigation.replace('ShopCageDetail', { id: c.id });
  };

  return (
    <ShopLayout title="Record Sale" activeTab="stock">
      <PageTitle>Record Sale</PageTitle>
      <PageSub>
        {'Cage ' + c.id + ' · Batch ' + c.batch}
      </PageSub>
      <DetailCard>
        <ErrorText message={error} />
        <AutoBox label="Birds in cage" value={fmt(inCage(c)) + ' birds'} />
        <Field
          label="Birds sold *"
          value={countText}
          onChangeText={setCountText}
          placeholder="e.g. 25"
          keyboardType="number-pad"
        />
        <PrimaryButton title="Record Sale" onPress={confirm} />
      </DetailCard>
    </ShopLayout>
  );
}

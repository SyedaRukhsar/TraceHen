// Shop Confirm Receipt (shop.html shop-view-receipt, shop.js openReceipt
// + receipt submit). Count only — no defect list, no inspection: the birds
// come directly from the farm. Accepted = received − DOA (auto).
// Confirm flips the Farm dispatch to RECEIVED once (guarded) and notifies
// the Farm (accepted / DOA counts, 'Dispatch Received').

import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { DEMO_TODAY, fmt, nextCageId } from './helpers';
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

function parseCount(text: string): number {
  const n = parseInt(text, 10);
  return Number.isNaN(n) ? NaN : n;
}

export default function ShopReceiptScreen() {
  const { scopeKey, data, currentUser, updateData, notify, logActivity, showToast } =
    useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ShopReceipt'>>();
  const isDemo = scopeKey === '__demo__';
  const d = (isDemo ? data.deliveries : []).find(
    x => x.id === route.params?.deliveryId,
  );
  const [vehicle, setVehicle] = useState(d ? d.vehicle : '');
  const [receivedText, setReceivedText] = useState(
    d ? String(d.birdsSent) : '',
  );
  const [doaText, setDoaText] = useState('0');
  const [error, setError] = useState('');

  if (!d) {
    return (
      <ShopLayout title="Confirm Receipt" activeTab="deliveries">
        <EmptyNote>No deliveries.</EmptyNote>
      </ShopLayout>
    );
  }

  const received = parseCount(receivedText);
  const doa = parseCount(doaText);
  const accepted = Math.max(
    0,
    (Number.isNaN(received) ? 0 : received) - (Number.isNaN(doa) ? 0 : doa),
  );
  const cageId = nextCageId(data.cages);
  const byName = currentUser?.name ?? 'Zubair';

  const confirm = () => {
    if (d.status !== 'AWAITING') {
      return;
    }
    if (!vehicle.trim()) {
      setError('Vehicle number is required.');
      return;
    }
    if (Number.isNaN(received) || received < 0) {
      setError('Enter the birds received.');
      return;
    }
    if (received > d.birdsSent) {
      setError(
        'Birds received cannot be more than the birds sent (' +
          fmt(d.birdsSent) +
          ').',
      );
      return;
    }
    if (Number.isNaN(doa) || doa < 0) {
      setError('Enter the dead on arrival (DOA) count.');
      return;
    }
    if (doa > received) {
      setError('DOA cannot be more than the birds received.');
      return;
    }
    setError('');
    const acceptedBirds = Math.max(0, received - doa);
    updateData(prev => ({
      ...prev,
      deliveries: prev.deliveries.map(x =>
        x.id === d.id
          ? {
              ...x,
              vehicle: vehicle.trim(),
              status: 'RECEIVED' as const,
              receipt: {
                received,
                doa,
                cage: cageId,
                date: DEMO_TODAY,
                time: '',
                by: byName,
              },
            }
          : x,
      ),
      cages: [
        ...prev.cages,
        {
          id: cageId,
          delivery: d.id,
          batch: d.batch,
          received: acceptedBirds,
          sold: 0,
          removals: [],
          receivedDate: DEMO_TODAY,
        },
      ],
      // The Farm dispatch flips to RECEIVED once — guarded against a
      // double receipt (DISP-104A has no Farm dispatch record, so
      // nothing flips for it).
      dispatches: prev.dispatches.map(x =>
        x.id === d.id && x.status !== 'RECEIVED'
          ? { ...x, status: 'RECEIVED' as const, received: acceptedBirds, doa }
          : x,
      ),
    }));
    notify('Haji Tariq', {
      t: 'Dispatch Received',
      s: d.id + ' · ' + fmt(acceptedBirds) + ' birds accepted · ' + fmt(doa) + ' DOA',
      c: '',
      read: false,
    });
    logActivity(byName, {
      t: 'Delivery received — ' + d.id,
      s: fmt(acceptedBirds) + ' birds into Cage ' + cageId + ' · ' + fmt(doa) + ' DOA',
      c: '',
    });
    notify(byName, {
      t: 'Delivery received',
      s: d.id + ' · ' + fmt(acceptedBirds) + ' birds into Cage ' + cageId,
      c: '',
      read: false,
    });
    showToast(
      'Receipt confirmed — ' + fmt(acceptedBirds) + ' birds in Cage ' + cageId + '.',
    );
    navigation.replace('ShopDeliveryDetail', { id: d.id });
  };

  return (
    <ShopLayout title="Confirm Receipt" activeTab="deliveries">
      <PageTitle>Confirm Receipt</PageTitle>
      <PageSub>
        {d.id} · {d.farm} · {fmt(d.birdsSent)} birds sent
      </PageSub>
      <DetailCard>
        <ErrorText message={error} />
        <Field
          label="Vehicle number *"
          value={vehicle}
          onChangeText={setVehicle}
          placeholder="e.g. FDN-4411"
        />
        <AutoBox label="Birds sent (system)" value={fmt(d.birdsSent) + ' birds'} />
        <Field
          label="Birds received *"
          value={receivedText}
          onChangeText={setReceivedText}
          keyboardType="number-pad"
          hint="Count the birds as they come off the vehicle, before they go into the cage."
        />
        <Field
          label="Dead on arrival (DOA) *"
          value={doaText}
          onChangeText={setDoaText}
          keyboardType="number-pad"
          hint="Birds found dead on arrival. They are recorded and never enter the cage."
        />
        <AutoBox label="Accepted into cage (auto)" value={fmt(accepted) + ' birds'} />
        <AutoBox label="Cage (auto)" value={'Cage ' + cageId} />
        <PrimaryButton title="Confirm Receipt" onPress={confirm} />
      </DetailCard>
    </ShopLayout>
  );
}

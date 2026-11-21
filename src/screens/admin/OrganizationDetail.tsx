// Admin — Organization detail (admin.html org-detail). Overview, site
// (View pin), members, history, and suspend. Suspending needs a reason,
// saved with the record. Re-activate is offered on a suspended account
// (the store toggles the status); the locked HTML shows only the
// "Account suspended" card there, with no button.

import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import {
  AdminBottomNav,
  AdminHeader,
  DetailCard,
  HistoryList,
  KvRow,
  Pill,
  SiteRow,
  adminStyles,
  pillForOrg,
} from './AdminNav';

export default function AdminOrganizationDetailScreen() {
  const { colors, organizations, suspendOrganization, logActivity, showToast } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AdminOrganizationDetail'>>();
  const s = adminStyles(colors);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const org = organizations.find(o => o.id === route.params.id);
  if (!org) {
    return (
      <View style={s.root}>
        <AdminHeader subtitle="Organization" />
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.emptyNote}>Organization not found.</Text>
        </ScrollView>
        <AdminBottomNav active="organizations" />
      </View>
    );
  }

  const pill = pillForOrg(org.status);

  const onSuspend = () => {
    const r = reason.trim();
    if (!r) {
      setError('A reason is required to suspend an account. It is saved with the record.');
      return;
    }
    setError('');
    suspendOrganization(org.id);
    // The store's suspend action takes no reason, so the reason is kept on
    // the Admin activity record, as in admin.js.
    logActivity('Demo Admin', { t: `Suspended: ${org.name}`, s: r, c: 'red' });
    setReason('');
    showToast(`Suspended. ${org.name} can no longer start new work.`);
  };
  const onReactivate = () => {
    suspendOrganization(org.id);
    showToast(`Re-activated. ${org.name} is now ACTIVE.`);
  };

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Organization" />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={[s.pageTitle, { marginTop: 6 }]}>{org.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <Text style={[s.pageSub, { marginBottom: 0, flexShrink: 1 }]}>
            {org.type} · {org.tehsil}, {org.district}
          </Text>
          <Pill label={pill.label} tone={pill.tone} />
        </View>

        <DetailCard title="Overview">
          <KvRow label="Owner" value={org.owner} />
          <KvRow label="Mobile" value={org.phone} />
          <KvRow label="Type" value={org.type} />
          <KvRow label="Status" value={org.status} />
          <KvRow label="License (verified)" value={org.license || '—'} />
        </DetailCard>

        <DetailCard title="Site">
          {org.sites.map(site => (
            <SiteRow
              key={site.name}
              site={site}
              onViewPin={() =>
                navigation.navigate('AdminDocument', {
                  docName: site.name,
                  docType: 'image',
                  docFile: 'map',
                })
              }
            />
          ))}
        </DetailCard>

        <DetailCard title="Members">
          {org.members.map(m => (
            <KvRow key={m.name} label={`${m.name} · ${m.role}`} value={m.status} />
          ))}
        </DetailCard>

        <DetailCard title="History">
          <HistoryList items={org.history} />
        </DetailCard>

        {org.status === 'ACTIVE' ? (
          <DetailCard title="Suspend account">
            <Text style={s.fieldLabel}>Reason — required</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={reason}
              onChangeText={text => {
                setReason(text);
                setError('');
              }}
              placeholder="e.g. Repeated record mismatch found in review."
              placeholderTextColor={colors.muted}
              multiline
            />
            {error !== '' ? <Text style={s.errorText}>{error}</Text> : null}
            <View style={{ marginTop: 14 }}>
              <Pressable style={s.btnOutlineDanger} onPress={onSuspend} accessibilityRole="button">
                <Text style={s.btnOutlineDangerText}>Suspend Organization</Text>
              </Pressable>
            </View>
          </DetailCard>
        ) : (
          <DetailCard title="Account suspended">
            <Pressable style={s.btnPrimary} onPress={onReactivate} accessibilityRole="button">
              <Text style={s.btnPrimaryText}>Re-activate Organization</Text>
            </Pressable>
          </DetailCard>
        )}
      </ScrollView>
      <AdminBottomNav active="organizations" />
    </View>
  );
}

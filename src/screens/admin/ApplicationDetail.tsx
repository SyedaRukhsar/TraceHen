// Admin — Application detail (admin.html app-detail). Full application:
// applicant & business, role details, site (View pin), documents
// (tap to open the document viewer), history, and the Admin decision.
// Approve creates the organization + activates the account (the store
// handles it); More Info / Reject need a reason. No self bell
// notification for Admin's own decision — the store logs activity only.

import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ChevronRight, File } from 'lucide-react-native';
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
  pillForApplication,
} from './AdminNav';

export default function AdminApplicationDetailScreen() {
  const { colors, applications, approveApplication, requestMoreInfo, rejectApplication, showToast } =
    useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AdminApplicationDetail'>>();
  const s = adminStyles(colors);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const app = applications.find(a => a.id === route.params.id);
  if (!app) {
    return (
      <View style={s.root}>
        <AdminHeader subtitle="Application Review" />
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.emptyNote}>Application not found.</Text>
        </ScrollView>
        <AdminBottomNav active="applications" />
      </View>
    );
  }

  const pill = pillForApplication(app.status);
  const decided = app.status === 'APPROVED' || app.status === 'REJECTED';

  const onApprove = () => {
    approveApplication(app.id);
    showToast(
      `Approved. ${app.business} is now ACTIVE. Notification sent to ${app.person} (${app.phone}).`,
    );
  };
  const onMoreInfo = () => {
    const r = reason.trim();
    if (!r) {
      setError('Please write a reason first — the applicant will see exactly this message.');
      return;
    }
    setError('');
    requestMoreInfo(app.id, r);
    setReason('');
    showToast(`Request sent. ${app.person} has been asked for more information.`);
  };
  const onReject = () => {
    const r = reason.trim();
    if (!r) {
      setError('A reason is required to reject an application. It is saved with the record.');
      return;
    }
    setError('');
    rejectApplication(app.id, r);
    setReason('');
    showToast(`Rejected. ${app.business} — reason saved with the record.`);
  };

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Application Review" />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={[s.pageTitle, { marginTop: 6 }]}>{app.business}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <Text style={[s.pageSub, { marginBottom: 0, flexShrink: 1 }]}>
            {app.role} · {app.tehsil}, {app.district}
          </Text>
          <Pill label={pill.label} tone={pill.tone} />
        </View>

        <DetailCard title="Applicant & business">
          <KvRow label="Applicant" value={app.person} />
          <KvRow label="Business" value={app.business} />
          <KvRow label="Role applied for" value={app.role} />
          <KvRow label="Mobile" value={app.phone} />
          <KvRow label="Phone verified" value={app.phoneVerified ? 'Yes — OTP verified' : 'No'} ok={app.phoneVerified} />
          <KvRow label="District / Tehsil" value={`${app.district} / ${app.tehsil}`} />
          <KvRow label="Address" value={app.address} />
          <KvRow label="Submitted" value={app.submitted} />
        </DetailCard>

        <DetailCard title={`${app.role} details`}>
          {app.roleDetails.map(([k, v]) => (
            <KvRow key={k} label={k} value={v} />
          ))}
        </DetailCard>

        <DetailCard title="Site">
          {app.sites.map(site => (
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

        <DetailCard title="Documents">
          {app.documents.map((d, i) => (
            <Pressable
              key={`${d.name}-${i}`}
              style={[s.docRow, i === app.documents.length - 1 ? { borderBottomWidth: 0 } : null]}
              onPress={() =>
                navigation.navigate('AdminDocument', {
                  docName: d.name,
                  docType: d.type,
                  docFile: d.file,
                })
              }
              accessibilityRole="button"
            >
              <File size={20} color={colors.muted} strokeWidth={2} />
              <Text style={s.docName}>{d.name}</Text>
              <Text style={s.docType}>{d.type === 'pdf' ? 'PDF' : 'JPG'}</Text>
              <ChevronRight size={18} color={colors.chev} strokeWidth={2} />
            </Pressable>
          ))}
        </DetailCard>

        <DetailCard title="History">
          <HistoryList items={app.history} />
        </DetailCard>

        {!decided ? (
          <DetailCard title="Admin decision">
            <Pressable style={s.btnPrimary} onPress={onApprove} accessibilityRole="button">
              <Text style={s.btnPrimaryText}>Approve Application</Text>
            </Pressable>
            <View style={{ marginTop: 16 }}>
              <Text style={s.fieldLabel}>Reason — required for More Info and Reject</Text>
              <TextInput
                style={[s.input, s.inputMultiline]}
                value={reason}
                onChangeText={text => {
                  setReason(text);
                  setError('');
                }}
                placeholder="e.g. Signboard photo is blurry — please upload a clear photo."
                placeholderTextColor={colors.muted}
                multiline
              />
            </View>
            {error !== '' ? <Text style={s.errorText}>{error}</Text> : null}
            <View style={[s.btnRow, { marginTop: 14 }]}>
              <Pressable style={s.btnOutlineAmber} onPress={onMoreInfo} accessibilityRole="button">
                <Text style={s.btnOutlineAmberText}>Request More Info</Text>
              </Pressable>
              <Pressable style={s.btnOutlineDanger} onPress={onReject} accessibilityRole="button">
                <Text style={s.btnOutlineDangerText}>Reject</Text>
              </Pressable>
            </View>
          </DetailCard>
        ) : app.status === 'REJECTED' ? (
          <DetailCard title="Decision">
            <KvRow label="Final status" value="Rejected" />
          </DetailCard>
        ) : null}
      </ScrollView>
      <AdminBottomNav active="applications" />
    </View>
  );
}

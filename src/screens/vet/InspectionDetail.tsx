// Vet Inspection Detail — batch, bird count, status, batch history and the
// inspection & decision form (or the recorded decision).
// Locked source: modules/vet.html #vet-view-inspection-detail, modules/vet.js
// openInspection. Decision buttons verbatim from the HTML: Approve, Reject,
// Request Follow-up, Hold. On Hold = vet visited, flock not yet fit,
// mandatory Recheck date (a recorded status, NOT a block).
// Lab testing is NOT in v1 — no lab field. "Farmer" label is correct.

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import type { Inspection, InspectionStatus } from '../../types/models';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { DecisionGrid } from '../../components/DecisionGrid';
import { FilePicker } from '../../components/FilePicker';
import type { PickedFile } from '../../components/FilePicker';
import { FormField } from '../../components/FormField';
import { Icon } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Timeline } from '../../components/Timeline';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;
type VetRoute = RouteProp<RootStackParamList, 'VetInspectionDetail'>;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function liveOf(i: Inspection): number {
  return i.placed - i.doa - i.deaths;
}

function niceDate(value: string): string {
  const parts = value.split('-');
  if (parts.length !== 3) {
    return value;
  }
  const month = MONTHS[parseInt(parts[1] ?? '1', 10) - 1] ?? '';
  return `${parts[2]} ${month} ${parts[0]}`;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function certNoFor(value: string): string {
  const parts = value.split('-');
  const day = pad(parseInt(parts[2] ?? '1', 10));
  const month = pad(parseInt(parts[1] ?? '1', 10));
  const year = (parts[0] ?? '').slice(2);
  return `CERT-V3-${day}${month}${year}`;
}

function formatTime12h(time: string): string {
  const parts = time.split(':');
  const hh = parseInt(parts[0] ?? '0', 10);
  const mm = parts[1] ?? '00';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${hour12}:${mm} ${hh >= 12 ? 'PM' : 'AM'}`;
}

function statusLabel(s: InspectionStatus): string {
  if (s === 'PENDING') {
    return 'Pending';
  }
  if (s === 'APPROVED') {
    return 'Approved';
  }
  if (s === 'REJECTED') {
    return 'Rejected';
  }
  if (s === 'HOLD') {
    return 'On Hold';
  }
  return 'Follow-up';
}

function statusTone(s: InspectionStatus): 'active' | 'pending' | 'suspended' | 'info' | 'rejected' {
  if (s === 'APPROVED') {
    return 'active';
  }
  if (s === 'PENDING') {
    return 'pending';
  }
  if (s === 'REJECTED') {
    return 'suspended';
  }
  if (s === 'HOLD') {
    return 'info';
  }
  return 'rejected';
}

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

const DECISION_OPTIONS: Array<{ key: string; label: string; tone: 'green' | 'red' | 'amber' | 'blue' }> = [
  { key: 'APPROVED', label: 'Approve', tone: 'green' },
  { key: 'REJECTED', label: 'Reject', tone: 'red' },
  { key: 'FOLLOWUP', label: 'Request Follow-up', tone: 'blue' },
  { key: 'HOLD', label: 'Hold', tone: 'amber' },
];

export default function VetInspectionDetailScreen() {
  const navigation = useNavigation<VetNavigation>();
  const route = useRoute<VetRoute>();
  const { colors, data, scopeKey, unreadCount, currentUser, updateData, notify, logActivity, showToast } =
    useApp();

  const isDemo = scopeKey === '__demo__';
  const inspections = isDemo ? data.inspections : [];
  const insp = inspections.find(i => i.batch === route.params.id);
  const vetName = currentUser ? currentUser.name : 'Dr. Usman';

  function goTab(tab: string): void {
    if (tab === 'home') {
      navigation.navigate('VetHome');
    } else if (tab === 'inspections') {
      navigation.navigate('VetInspections');
    } else if (tab === 'certificates') {
      navigation.navigate('VetCertificates');
    } else if (tab === 'settings') {
      navigation.navigate('VetSettings');
    }
  }

  const [decision, setDecision] = useState<InspectionStatus | ''>('');
  const [date, setDate] = useState('2026-12-01');
  const [time, setTime] = useState('10:00');
  const [location, setLocation] = useState(insp ? `${insp.farm}, ${insp.place}` : '');
  const [finding, setFinding] = useState('');
  const [reason, setReason] = useState('');
  const [recheck, setRecheck] = useState('2026-12-04');
  const [certFile, setCertFile] = useState<PickedFile | null>(null);
  const [error, setError] = useState('');

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
    },
    pageSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginTop: spacing.xs,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginTop: spacing.lg,
    },
    cardTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.body,
      color: colors.ink,
      marginBottom: spacing.sm,
    },
    kvRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 14,
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    kvRowLast: {
      borderBottomWidth: 0,
    },
    kvLabel: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
      flexShrink: 0,
    },
    kvValue: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.small,
      color: colors.ink,
      textAlign: 'right',
    },
    kvValueOk: {
      color: colors.green700,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.gap,
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    statusRowLast: {
      borderBottomWidth: 0,
    },
    statusLabel: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
    },
    statusSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
    },
    infoBox: {
      flexDirection: 'row',
      gap: 11,
      backgroundColor: colors.green50,
      borderWidth: 1,
      borderColor: colors.green100,
      borderRadius: radius.md,
      paddingVertical: 13,
      paddingHorizontal: 14,
      marginBottom: spacing.md,
    },
    infoTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
    },
    infoSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
    },
    flexOne: {
      flex: 1,
    },
    errorText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.red,
      marginBottom: spacing.sm,
    },
    hintText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
      marginTop: -spacing.sm,
      marginBottom: spacing.md,
    },
    fileHint: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },
    fieldLabel: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
      marginBottom: spacing.labelMarginBottom,
    },
    dateTimeRow: {
      flexDirection: 'row',
      gap: spacing.gapSm,
    },
    dateTimeField: {
      flex: 1,
    },
    certAutoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
    },
    certAutoLabel: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
    },
    certAutoValue: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
    },
    docRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.gapSm,
      backgroundColor: colors.green50,
      borderWidth: 1,
      borderColor: colors.green100,
      borderRadius: radius.md,
      paddingVertical: 11,
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
    },
    docRowLabel: {
      flex: 1,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.small,
      color: colors.ink,
    },
    docBadge: {
      fontFamily: fontFamily.extraBold,
      fontSize: 11,
      color: colors.green700,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.green200,
      paddingVertical: 3,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.pill,
    },
    emptyNote: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      paddingVertical: spacing.md,
      textAlign: 'center',
    },
  });

  if (!insp) {
    return (
      <View style={styles.root}>
        <AppHeader
          title="TraceHen Vet"
          subtitle="Inspection"
          showBack
          onBack={() => navigation.goBack()}
          unreadCount={unreadCount}
          showBell
          onBellPress={() => navigation.navigate('VetNotifications')}
          onAvatarPress={() => navigation.navigate('VetProfile')}
          avatarInitial={initials(vetName)}
        />
        <ScreenLayout>
          <Text style={styles.emptyNote}>No inspections.</Text>
        </ScreenLayout>
        <BottomNav role="vet" active="inspections" onTab={goTab} />
      </View>
    );
  }

  const inspection = insp;

  const d = inspection.decision;
  const showForm = inspection.status === 'PENDING' || inspection.status === 'FOLLOWUP';
  const clinicalSub = d ? `${d.date} · ${d.location}` : 'Awaiting inspection';
  const farmTag = `${inspection.farm}${inspection.farmCode ? ` · ${inspection.farmCode}` : ''}`;

  function submitDecision(): void {
    if (!decision) {
      setError('Select a decision.');
      return;
    }
    if (!date || !time || !location.trim() || !finding.trim()) {
      setError('Inspection date, time, location and finding are required.');
      return;
    }
    if ((decision === 'REJECTED' || decision === 'HOLD') && !reason.trim()) {
      setError('Reason is required for Reject and Hold.');
      return;
    }
    if (decision === 'HOLD' && !recheck) {
      setError('Recheck date is required for Hold.');
      return;
    }
    if (decision === 'APPROVED' && !certFile) {
      setError('Upload the signed certificate.');
      return;
    }
    setError('');
    const nice = niceDate(date);
    const niceTime = formatTime12h(time);
    const loc = location.trim();
    const find = finding.trim();
    const why = reason.trim();
    if (decision === 'APPROVED' && certFile) {
      const no = certNoFor(date);
      updateData(prev => ({
        ...prev,
        inspections: prev.inspections.map(x =>
          x.batch === inspection.batch
            ? {
                ...x,
                status: 'APPROVED' as InspectionStatus,
                decision: { date: nice, time: niceTime, location: loc, finding: find, reason: why, recheck: '', certNo: no },
              }
            : x,
        ),
        certificates: [
          { no, batch: inspection.batch, farm: inspection.farm, issued: nice, fileName: certFile.name, url: certFile.file },
          ...prev.certificates,
        ],
      }));
      logActivity(vetName, { t: `Certificate issued — ${no}`, s: `${inspection.batch} · ${inspection.farm}`, c: '' });
      logActivity(vetName, { t: `Inspection approved — ${inspection.batch}`, s: farmTag, c: '' });
      notify(inspection.farmer, { t: 'Vet inspection approved', s: `${inspection.batch} · ${no} · ${vetName}`, c: '' });
      showToast(`Approved — ${no} issued. Farm notified.`);
      return;
    }
    const label = statusLabel(decision);
    const niceRecheck = decision === 'HOLD' ? niceDate(recheck) : '';
    updateData(prev => ({
      ...prev,
      inspections: prev.inspections.map(x =>
        x.batch === inspection.batch
          ? {
              ...x,
              status: decision,
              decision: {
                date: nice,
                time: niceTime,
                location: loc,
                finding: find,
                reason: why,
                recheck: niceRecheck,
                certNo: '',
              },
            }
          : x,
      ),
    }));
    logActivity(vetName, { t: `Inspection ${label.toLowerCase()} — ${inspection.batch}`, s: farmTag, c: 'amber' });
    if (decision === 'REJECTED') {
      notify(inspection.farmer, { t: 'Vet inspection rejected', s: `${inspection.batch} · ${vetName}`, c: 'amber' });
    } else if (decision === 'HOLD') {
      notify(inspection.farmer, { t: 'Vet inspection on hold', s: `${inspection.batch} · Recheck ${niceRecheck} · ${vetName}`, c: 'amber' });
    } else {
      notify(inspection.farmer, { t: 'Vet inspection follow-up requested', s: `${inspection.batch} · ${vetName}`, c: 'amber' });
    }
    showToast(`${label} recorded. Farm notified.`);
  }

  const batchRows: Array<[string, string, boolean]> = [
    ['Farm', inspection.farm, false],
    ['Farmer', inspection.farmer, false],
    ['Breed', inspection.breed, false],
    ['Shed', inspection.shed, false],
    ['Arrival', inspection.arrival, false],
    ['Visit date', inspection.ready, false],
    ['Average weight', inspection.weight, false],
  ];
  if (inspection.notes) {
    batchRows.push(['Farm notes', inspection.notes, false]);
  }
  const countRows: Array<[string, string, boolean]> = [
    ['Placed', fmt(inspection.placed), false],
    ['Dead on arrival', fmt(inspection.doa), false],
    ['Deaths', fmt(inspection.deaths), false],
    ['Live birds', fmt(liveOf(insp)), true],
  ];

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Inspection"
        showBack
        onBack={() => navigation.goBack()}
        unreadCount={unreadCount}
        showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
        onAvatarPress={() => navigation.navigate('VetProfile')}
                avatarInitial={initials(vetName)}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>{inspection.batch}</Text>
        <Text style={styles.pageSub}>
          {inspection.farm}
          {inspection.farmCode ? ` · ${inspection.farmCode}` : ''} · {inspection.place}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Batch</Text>
          {batchRows.map(([label, value], index) => (
            <View key={label} style={[styles.kvRow, index === batchRows.length - 1 ? styles.kvRowLast : null]}>
              <Text style={styles.kvLabel}>{label}</Text>
              <Text style={styles.kvValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bird Count</Text>
          {countRows.map(([label, value, ok], index) => (
            <View key={label} style={[styles.kvRow, index === countRows.length - 1 ? styles.kvRowLast : null]}>
              <Text style={styles.kvLabel}>{label}</Text>
              <Text style={[styles.kvValue, ok ? styles.kvValueOk : null]}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.flexOne}>
              <Text style={styles.statusLabel}>Clinical inspection</Text>
              <Text style={styles.statusSub}>{clinicalSub}</Text>
            </View>
            <Pill label={statusLabel(inspection.status)} tone={statusTone(inspection.status)} />
          </View>
          {inspection.meds.length > 0
            ? inspection.meds.map((m, index) => (
                <View
                  key={m.name}
                  style={[styles.statusRow, index === inspection.meds.length - 1 ? styles.statusRowLast : null]}
                >
                  <View style={styles.flexOne}>
                    <Text style={styles.statusLabel}>Withdrawal</Text>
                    <Text style={styles.statusSub}>
                      {m.name} · {m.sub}
                    </Text>
                  </View>
                  <Pill label="Completed" tone="active" />
                </View>
              ))
            : (
              <View style={[styles.statusRow, styles.statusRowLast]}>
                <View style={styles.flexOne}>
                  <Text style={styles.statusLabel}>Withdrawal</Text>
                  <Text style={styles.statusSub}>No medication recorded</Text>
                </View>
                <Pill label="None" tone="rejected" />
              </View>
            )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Batch History</Text>
          <Timeline
            steps={inspection.events.map(e => ({
              stage: e.title,
              title: e.title,
              detail: e.sub,
              when: e.date,
              done: true,
            }))}
          />
        </View>

        {showForm ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Inspection & Decision</Text>
            <View style={styles.infoBox}>
              <Icon name="mapPin" size={20} color={colors.green700} />
              <View style={styles.flexOne}>
                <Text style={styles.infoTitle}>In-person visit</Text>
                <Text style={styles.infoSub}>Inspect the birds at the farm, then record your decision here.</Text>
              </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Text style={styles.fieldLabel}>Decision *</Text>
            <DecisionGrid options={DECISION_OPTIONS} value={decision} onChange={key => setDecision(key as InspectionStatus)} />
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeField}>
                <FormField label="Inspection date *" value={date} onChangeText={setDate} />
              </View>
              <View style={styles.dateTimeField}>
                <FormField label="Time *" value={time} onChangeText={setTime} />
              </View>
            </View>
            <FormField label="Inspection location *" value={location} onChangeText={setLocation} />
            <FormField
              label="Finding *"
              value={finding}
              onChangeText={setFinding}
              placeholder="Your professional finding"
              multiline
            />
            {decision === 'REJECTED' || decision === 'HOLD' ? (
              <FormField
                label="Reason *"
                value={reason}
                onChangeText={setReason}
                placeholder="Reason for this decision"
                multiline
              />
            ) : null}
            {decision === 'HOLD' ? (
              <View>
                <FormField label="Recheck date *" value={recheck} onChangeText={setRecheck} />
                <Text style={styles.hintText}>
                  On Hold = batch paused, not approved or rejected. You visit again on this date and decide then.
                </Text>
              </View>
            ) : null}
            {decision === 'APPROVED' ? (
              <View>
                <View style={styles.certAutoRow}>
                  <Text style={styles.certAutoLabel}>Certificate no. (auto)</Text>
                  <Text style={styles.certAutoValue}>{certNoFor(date)}</Text>
                </View>
                <Text style={styles.fieldLabel}>Signed certificate *</Text>
                <FilePicker
                  label="signed certificate"
                  value={certFile}
                  onPick={setCertFile}
                />
                <Text style={styles.fileHint}>PDF or photo of the signed certificate</Text>
              </View>
            ) : null}
            <AppButton title="Record Decision" onPress={submitDecision} variant="primary" />
          </View>
        ) : null}

        {!showForm && d ? (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Decision</Text>
              {(
                [
                  ['Decision', statusLabel(inspection.status)],
                  ['Date', d.date],
                  ['Time', d.time],
                  ['Location', d.location],
                  ['Finding', d.finding],
                ] as Array<[string, string]>
              )
                .concat(d.reason ? [['Reason', d.reason] as [string, string]] : [])
                .concat(d.recheck ? [['Recheck date', d.recheck] as [string, string]] : [])
                .concat(d.certNo ? [['Certificate', d.certNo] as [string, string]] : [])
                .map(([label, value], index, arr) => (
                  <View key={label} style={[styles.kvRow, index === arr.length - 1 ? styles.kvRowLast : null]}>
                    <Text style={styles.kvLabel}>{label}</Text>
                    <Text style={styles.kvValue}>{value}</Text>
                  </View>
                ))}
            </View>
            {d.certNo ? (
              <Pressable
                style={styles.docRow}
                onPress={() => navigation.navigate('VetCertificateDetail', { id: d.certNo })}
              >
                <Icon name="award" size={18} color={colors.green700} />
                <Text style={styles.docRowLabel}>{d.certNo}</Text>
                <Text style={styles.docBadge}>PDF</Text>
                <Icon name="chevronRight" size={18} color={colors.chev} />
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScreenLayout>
      <BottomNav role="vet" active="inspections" onTab={goTab} />
    </View>
  );
}

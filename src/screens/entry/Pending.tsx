// TraceHen application-status screen (locked v51 shell).
// Shows the newest application: clock icon + "Application Submitted" +
// "Status: PENDING" + applicant name and business + the Admin-review note.
// When Admin asked for more info or rejected it, the title, status colour
// and note change and the Admin reason shows. [Back to Sign In].

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useApp } from '../../services/store';
import type { ThemeColors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily, fontSize } from '../../theme/typography';
import type { ApplicationStatus } from '../../types/models';
import type { RootStackNavigationProp } from '../../navigation/types';

interface PendingCopy {
  icon: IconName;
  title: string;
  statusText: string;
  statusColor: string;
  iconBg: string;
  iconColor: string;
  note: string;
}

function copyFor(status: ApplicationStatus, colors: ThemeColors): PendingCopy {
  switch (status) {
    case 'NEEDS_INFO':
      return {
        icon: 'info',
        title: 'More Information Needed',
        statusText: 'NEEDS INFO',
        statusColor: colors.blue,
        iconBg: colors.blueBg,
        iconColor: colors.blue,
        note: 'Admin needs more information before your account can be approved.',
      };
    case 'REJECTED':
      return {
        icon: 'x',
        title: 'Application Rejected',
        statusText: 'REJECTED',
        statusColor: colors.badgeRed,
        iconBg: colors.redBg,
        iconColor: colors.red,
        note: 'Your application was not approved, so this account cannot sign in.',
      };
    case 'APPROVED':
    case 'PENDING':
    default:
      return {
        icon: 'clock',
        title: 'Application Submitted',
        statusText: 'PENDING',
        statusColor: colors.amber,
        iconBg: colors.amberBg,
        iconColor: colors.amber,
        note: 'Admin will review your application. You will be notified when your account is approved — then sign in with your username and password.',
      };
  }
}

// The Admin reason lives in the application's history line
// ("Application rejected by Demo Admin: <reason>" /
// "More information requested by Demo Admin: <reason>").
function reasonFromHistory(historyLine: string | undefined): string {
  if (!historyLine) {
    return '';
  }
  const match = historyLine.match(/: (.+)$/);
  return match ? match[1].trim() : '';
}

interface PendingProps {
  navigation: RootStackNavigationProp;
}

export default function Pending({ navigation }: PendingProps) {
  const { colors, applications, users } = useApp();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // The newest application is the one just submitted from SignUp
  // (the store prepends new applications).
  const app = applications[0];
  const status: ApplicationStatus = app?.status ?? 'PENDING';
  const copy = copyFor(status, colors);

  let reason = '';
  if (status === 'NEEDS_INFO' || status === 'REJECTED') {
    reason = reasonFromHistory(app?.history?.[0]?.t);
    if (!reason && app) {
      const owner = users.find(
        u => u.name.toLowerCase() === app.person.toLowerCase(),
      );
      reason = owner?.notifs?.[0]?.s ?? '';
    }
  }

  const who = app
    ? app.business
      ? `${app.person} · ${app.business}`
      : app.person
    : '';

  return (
    <ScreenLayout scroll={false} paddingX={0}>
      <View style={styles.box}>
        <View style={[styles.bigIcon, { backgroundColor: copy.iconBg }]}>
          <Icon name={copy.icon} size={34} color={copy.iconColor} strokeWidth={2} />
        </View>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.statusLine}>
          Status: <Text style={[styles.statusText, { color: copy.statusColor }]}>{copy.statusText}</Text>
        </Text>
        {who ? <Text style={styles.biz}>{who}</Text> : null}
        <Text style={styles.note}>{copy.note}</Text>
        {reason ? (
          <Text style={styles.reason}>Admin: “{reason}”</Text>
        ) : null}
        <AppButton
          title="Back to Sign In"
          onPress={() => navigation.navigate('SignIn')}
          variant="primary"
        />
      </View>
    </ScreenLayout>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    box: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      paddingVertical: 34,
      paddingHorizontal: 22,
    },
    bigIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
      marginBottom: 6,
      textAlign: 'center',
    },
    statusLine: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginBottom: spacing.sm,
    },
    statusText: {
      fontFamily: fontFamily.bold,
    },
    biz: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    note: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13.5,
      lineHeight: 21,
      color: colors.muted,
      marginBottom: 22,
      textAlign: 'center',
    },
    reason: {
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      lineHeight: 21,
      color: colors.ink,
      marginBottom: 22,
      textAlign: 'center',
    },
  });
}

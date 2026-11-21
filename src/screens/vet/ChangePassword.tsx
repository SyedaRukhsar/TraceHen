// Vet Change Password — Current + New + Confirm (eye toggles, min 8, must
// differ). Locked source: modules/vet.html #vet-view-password, modules/vet.js
// password submit. Uses the store changePassword action. FormField shows
// its own eye toggle on password fields.

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { FormField } from '../../components/FormField';
import { ScreenLayout } from '../../components/ScreenLayout';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

export default function VetChangePasswordScreen() {
  const navigation = useNavigation<VetNavigation>();
  const { colors, unreadCount, currentUser, changePassword, showToast } = useApp();

  const vetName = currentUser ? currentUser.name : 'Dr. Usman';
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

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
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginTop: spacing.lg,
    },
    errorText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.red,
      marginBottom: spacing.sm,
    },
  });

  function submit(): void {
    const result = changePassword(current, next, confirm);
    if (!result.ok) {
      setError(result.error ?? 'Could not update the password.');
      return;
    }
    setError('');
    navigation.goBack();
    showToast('Password updated.');
  }

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Change Password"
        showBack
        onBack={() => navigation.goBack()}
        showBell
        unreadCount={unreadCount}
        onBellPress={() => navigation.navigate('VetNotifications')}
        avatarInitial={initials(vetName)}
        onAvatarPress={() => navigation.navigate('VetProfile')}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>Change Password</Text>
        <View style={styles.card}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <FormField label="Current password" value={current} onChangeText={setCurrent} secureTextEntry />
          <FormField label="New password" value={next} onChangeText={setNext} secureTextEntry />
          <FormField label="Confirm new password" value={confirm} onChangeText={setConfirm} secureTextEntry />
          <AppButton title="Update Password" onPress={submit} variant="primary" />
        </View>
      </ScreenLayout>
      <BottomNav role="vet" active="settings" onTab={goTab} />
    </View>
  );
}

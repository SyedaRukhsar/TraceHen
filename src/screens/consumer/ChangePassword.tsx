// Consumer Change Password — modules/consumer.html #consumer-view-password
// + modules/consumer.js pwdForm. Current + New + Confirm, eye toggles,
// minimum 8 characters, new must differ from current.
//
// STORE GAP (see the module report): the store has no changePassword action
// yet, so this screen cannot persist the new password. It validates the
// current password against the signed-in user's registry password (exactly
// what the HTML's currentUserPassword() check does), updates the remembered
// login so a saved login stays in sync, and reports success. The store's
// changePassword(currentPass, newPass) action must be added at integration;
// until then the new password is NOT written to the registry.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import { ConsumerBottomNav, ConsumerHeader, PrimaryButton } from './ConsumerChrome';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import type { ThemeColors } from '../../theme/colors';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerChangePassword'>;

export default function ConsumerChangePasswordScreen({ navigation }: Props) {
  const { colors, currentUser, showToast, updateRememberedPassword } = useApp();
  const styles = makeStyles(colors);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!currentUser || currentPass !== currentUser.password) {
      setError('Current password is wrong.');
      return;
    }
    if (newPass.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPass === currentPass) {
      setError('New password must be different from the old one.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }
    setError('');
    // TODO (integration): replace with useApp().changePassword(currentPass,
    // newPass) once the store action exists — see the file header.
    updateRememberedPassword(currentUser.name, newPass);
    showToast('Password updated.');
    navigation.goBack();
  };

  const passwordField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    visible: boolean,
    onToggle: () => void,
  ) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          placeholderTextColor={colors.chev}
        />
        <Pressable
          style={styles.eyeButton}
          onPress={onToggle}
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff size={20} color={colors.muted} strokeWidth={2} />
          ) : (
            <Eye size={20} color={colors.muted} strokeWidth={2} />
          )}
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ConsumerHeader subtitle="Change Password" showBack onBack={() => navigation.goBack()} />
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.pageTitle}>Change Password</Text>
        <View style={styles.detailCard}>
          {error ? <Text style={styles.formError}>{error}</Text> : null}
          {passwordField('Current password', currentPass, setCurrentPass, showCurrent, () =>
            setShowCurrent(v => !v),
          )}
          {passwordField('New password', newPass, setNewPass, showNew, () => setShowNew(v => !v))}
          {passwordField('Confirm new password', confirmPass, setConfirmPass, showConfirm, () =>
            setShowConfirm(v => !v),
          )}
          <PrimaryButton title="Update Password" onPress={handleSubmit} />
        </View>
      </ScrollView>
      <ConsumerBottomNav active="settings" />
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
    body: {
      flex: 1,
    },
    bodyContent: {
      paddingHorizontal: spacing.screenPaddingX,
      paddingTop: spacing.screenPaddingTop,
      paddingBottom: spacing.screenPaddingBottom,
    },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
      marginBottom: spacing.lg,
    },
    detailCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginBottom: 14,
    },
    formError: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13,
      color: colors.red,
      marginBottom: spacing.md,
    },
    field: {
      marginBottom: spacing.fieldMarginBottom,
    },
    fieldLabel: {
      fontFamily: fontFamily.bold,
      fontSize: 13,
      color: colors.ink,
      marginBottom: spacing.labelMarginBottom,
    },
    inputWrap: {
      position: 'relative',
      justifyContent: 'center',
    },
    input: {
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.input,
      paddingHorizontal: spacing.inputPaddingX,
      paddingVertical: spacing.inputPaddingY,
      paddingRight: 48,
      minHeight: 44,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.input,
      color: colors.ink,
    },
    eyeButton: {
      position: 'absolute',
      right: 6,
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

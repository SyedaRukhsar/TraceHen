// Admin — Change Password (admin.html password view). Current password +
// New password + Confirm, eye toggles, min 8, must differ from current.
// Error strings are verbatim from admin.js.
//
// STORE GAP (blocking): the store exposes NO changePassword action, so
// this screen cannot write the new password onto the registry account.
// It calls `changePassword` from useApp() through a typed optional
// access — the call site is ready and compiles — and reports clearly
// when the action is still missing. Do NOT work around it via updateData:
// the users registry is not part of DemoData, and the current-password
// check belongs in the store action, as in admin.js.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import {
  AdminBottomNav,
  AdminHeader,
  DetailCard,
  adminStyles,
} from './AdminNav';

type ChangePasswordFn = (
  currentPass: string,
  newPass: string,
) => { ok: boolean; error?: string };

export default function AdminChangePasswordScreen() {
  const store = useApp();
  const { colors, currentUser, showToast, updateRememberedPassword } = store;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = adminStyles(colors);

  // changePassword does not exist on the store yet (see header comment).
  // Typed optional access keeps the call site exact for integration.
  const changePassword = (
    store as unknown as { changePassword?: ChangePasswordFn }
  ).changePassword;

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = () => {
    setError('');
    if (!changePassword) {
      setError(
        'Password change is not available yet — the store needs a changePassword action.',
      );
      return;
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next === current) {
      setError('New password must be different from the current password.');
      return;
    }
    if (next !== confirm) {
      setError('New password and confirm password do not match.');
      return;
    }
    const result = changePassword(current, next);
    if (!result.ok) {
      setError(result.error ?? 'Current password is wrong.');
      return;
    }
    if (currentUser) {
      updateRememberedPassword(currentUser.name, next);
    }
    setCurrent('');
    setNext('');
    setConfirm('');
    navigation.navigate('AdminSettings');
    showToast('Password updated. Use the new password at your next sign in.');
  };

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Change Password" />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.pageTitle}>Change Password</Text>
        <DetailCard>
          {error !== '' ? <Text style={[s.errorText, { marginTop: 0, marginBottom: 12 }]}>{error}</Text> : null}
          <PasswordField
            label="Current password"
            value={current}
            onChangeText={setCurrent}
            shown={showCurrent}
            onToggleShown={() => setShowCurrent(v => !v)}
          />
          <PasswordField
            label="New password"
            value={next}
            onChangeText={setNext}
            shown={showNext}
            onToggleShown={() => setShowNext(v => !v)}
          />
          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChangeText={setConfirm}
            shown={showConfirm}
            onToggleShown={() => setShowConfirm(v => !v)}
          />
          <Pressable style={s.btnPrimary} onPress={onSubmit} accessibilityRole="button">
            <Text style={s.btnPrimaryText}>Update Password</Text>
          </Pressable>
        </DetailCard>
      </ScrollView>
      <AdminBottomNav active="settings" />
    </View>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  shown,
  onToggleShown,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  shown: boolean;
  onToggleShown: () => void;
}) {
  const { colors } = useApp();
  const s = adminStyles(colors);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View
        style={[
          s.input,
          { flexDirection: 'row', alignItems: 'center', paddingVertical: 0, paddingRight: 8 },
        ]}
      >
        <TextInput
          style={{ flex: 1, fontSize: 15, color: colors.ink, minHeight: 44 }}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!shown}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.muted}
        />
        <Pressable
          onPress={onToggleShown}
          accessibilityRole="button"
          accessibilityLabel={shown ? 'Hide password' : 'Show password'}
          style={{ padding: 8 }}
        >
          {shown ? (
            <EyeOff size={20} color={colors.muted} strokeWidth={2} />
          ) : (
            <Eye size={20} color={colors.muted} strokeWidth={2} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

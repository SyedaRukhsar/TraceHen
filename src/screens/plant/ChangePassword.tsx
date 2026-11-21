// PlantChangePassword — Change Password (plant.html #plant-view-password).
// Current + New + Confirm (eye toggles, min 8, must differ).
// NOTE (store gap): the store does not expose changePassword yet. This
// screen calls useApp().changePassword when it exists (it will be added at
// integration) and otherwise reports that the change is not available yet.
// It does NOT invent a different mechanism.

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { plantStyles } from './helpers';
import { ErrorBox, PasswordField, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;

type ChangePasswordFn = (
  currentPass: string,
  newPass: string,
) => { ok: boolean; error?: string };

export function PlantChangePasswordScreen() {
  const app = useApp();
  const { colors, currentUser, showToast } = app;
  const navigation = useNavigation<PlantNav>();
  const styles = plantStyles(colors);

  // changePassword is added to the store at integration; until then this is
  // undefined and the screen reports the gap instead of inventing a flow.
  const changePassword = (
    app as unknown as { changePassword?: ChangePasswordFn }
  ).changePassword;

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (current !== (currentUser?.password ?? '')) {
      setError('Current password is wrong.');
      return;
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next === current) {
      setError('New password must be different from the old one.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (!changePassword) {
      setError('Password change is not available yet.');
      return;
    }
    const result = changePassword(current, next);
    if (!result.ok) {
      setError(result.error ?? 'Current password is wrong.');
      return;
    }
    setError('');
    showToast('Password updated.');
    navigation.goBack();
  };

  return (
    <PlantScreen subtitle="Change Password" showBack activeTab="settings">
      <Text style={styles.pageTitle}>Change Password</Text>
      <View style={[styles.card, { marginTop: 14 }]}>
        <ErrorBox message={error} />
        <PasswordField
          label="Current password"
          value={current}
          onChangeText={setCurrent}
        />
        <PasswordField
          label="New password"
          value={next}
          onChangeText={setNext}
        />
        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
        />
        <Pressable onPress={submit} accessibilityRole="button" style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Update Password</Text>
        </Pressable>
      </View>
    </PlantScreen>
  );
}

export default PlantChangePasswordScreen;

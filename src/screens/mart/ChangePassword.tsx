// Mart ChangePassword (MartChangePassword) — Current + New + Confirm
// password (eye toggles on every field via FormField secureTextEntry), new
// password min 8 characters and must differ from the old one. The store's
// changePassword(currentPass, newPass, confirmPass) owns the write (it
// updates the registry account and remembered logins); the screen checks
// the HTML's exact messages first ('Current password is wrong.',
// 'New passwords do not match.') and only then calls the store action.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { AppButton } from '../../components/AppButton';
import { FormField } from '../../components/FormField';
import { DetailCard, FormError, MartShell, PageTitle } from './martUi';

export default function MartChangePasswordScreen() {
  const { currentUser, demoPassword, showToast, changePassword } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const stored = currentUser?.password ?? demoPassword;
    if (current !== stored) {
      setError('Current password is wrong.');
      return;
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (next === current) {
      setError('New password must be different from the old one.');
      return;
    }
    const result = changePassword(current, next, confirm);
    if (!result.ok) {
      setError(result.error ?? 'Could not update password.');
      return;
    }
    setError(null);
    navigation.goBack();
    showToast('Password updated.');
  };
  return (
    <MartShell title="Change Password" activeTab="settings" showBack>
      <PageTitle>Change Password</PageTitle>
      <DetailCard>
        <FormError message={error} />
        <FormField label="Current password" value={current} onChangeText={setCurrent} secureTextEntry />
        <FormField label="New password" value={next} onChangeText={setNext} secureTextEntry />
        <FormField label="Confirm new password" value={confirm} onChangeText={setConfirm} secureTextEntry />
        <AppButton title="Update Password" variant="primary" onPress={submit} />
      </DetailCard>
    </MartShell>
  );
}

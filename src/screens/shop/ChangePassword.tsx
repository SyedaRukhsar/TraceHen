// Shop Change Password (shop.html shop-view-password, shop.js pwd form).
// Current + New + Confirm, eye toggles, min 8, must differ — enforced by
// the store's changePassword(currentPass, newPass, confirmPass), which
// already exists in src/services/store.tsx.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useApp } from '../../services/store';
import {
  DetailCard,
  ErrorText,
  Field,
  PageTitle,
  PrimaryButton,
  ShopLayout,
} from './ui';

function PasswordField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  const { colors } = useApp();
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Field
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
      />
      <Pressable
        onPress={() => setVisible(v => !v)}
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        style={styles.eye}>
        {visible ? (
          <EyeOff size={20} color={colors.muted} strokeWidth={2} />
        ) : (
          <Eye size={20} color={colors.muted} strokeWidth={2} />
        )}
      </Pressable>
    </View>
  );
}

export default function ShopChangePasswordScreen() {
  const { changePassword, showToast } = useApp();
  const navigation = useNavigation();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const result = changePassword(current, next, confirm);
    if (!result.ok) {
      setError(result.error ?? 'Could not update the password.');
      return;
    }
    setError('');
    showToast('Password updated.');
    navigation.goBack();
  };

  return (
    <ShopLayout title="Change Password" activeTab="settings">
      <PageTitle>Change Password</PageTitle>
      <DetailCard>
        <ErrorText message={error} />
        <PasswordField
          label="Current password"
          value={current}
          onChangeText={setCurrent}
        />
        <PasswordField label="New password" value={next} onChangeText={setNext} />
        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
        />
        <PrimaryButton title="Update Password" onPress={submit} />
      </DetailCard>
    </ShopLayout>
  );
}

const styles = StyleSheet.create({
  fieldWrap: { position: 'relative' },
  eye: {
    position: 'absolute',
    right: 8,
    top: 34,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

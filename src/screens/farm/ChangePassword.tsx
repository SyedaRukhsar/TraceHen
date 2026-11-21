// Farm Change Password (farm.html #farm-view-password).
// Current + New + Confirm (eye toggles, min 8, must differ).
// NOTE: the store does not yet expose changePassword — this screen calls
// useApp().changePassword when it exists (added at integration) and
// reports honestly when it does not. See the module report.

import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { useApp } from '../../services/store';
import type { AppContextValue } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { FarmScreen } from './FarmChrome';
import { DetailCard, ErrorBox, FarmButton, FarmField, PageTitle } from './farmUI';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmChangePassword'>;

// changePassword is added to the store at integration; until then it is
// absent and this screen reports that instead of pretending to work.
type AppWithChangePassword = AppContextValue & {
  changePassword?: (
    currentPass: string,
    newPass: string,
  ) => { ok: boolean; error?: string };
};

export default function FarmChangePassword({ navigation }: Props) {
  const app = useApp() as AppWithChangePassword;
  const { colors, currentUser, showToast } = app;
  const changePassword = app.changePassword;
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const eye = (shown: boolean, toggle: () => void) => (
    <Pressable onPress={toggle} style={styles.eye}>
      {shown ? (
        <EyeOff size={20} color={colors.muted} />
      ) : (
        <Eye size={20} color={colors.muted} />
      )}
    </Pressable>
  );

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
    <FarmScreen subtitle="Change Password" activeTab="settings">
      <PageTitle title="Change Password" />
      <DetailCard>
        <ErrorBox message={error} />
        <FarmField
          label="Current password"
          value={current}
          onChangeText={setCurrent}
          secureTextEntry={!showCurrent}
          right={eye(showCurrent, () => setShowCurrent(v => !v))}
        />
        <FarmField
          label="New password"
          value={next}
          onChangeText={setNext}
          secureTextEntry={!showNext}
          right={eye(showNext, () => setShowNext(v => !v))}
        />
        <FarmField
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showConfirm}
          right={eye(showConfirm, () => setShowConfirm(v => !v))}
        />
        <FarmButton title="Update Password" onPress={submit} />
      </DetailCard>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  eye: {
    paddingHorizontal: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
});

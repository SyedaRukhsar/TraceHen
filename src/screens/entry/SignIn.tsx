// TraceHen sign-in screen (locked v51 shell).
// "Welcome Back", blank Username / Password fields (eye toggle on the
// password), Remember me checkbox, "Forgot password?", [Sign In],
// "Password updated" notice (after a reset), "Don't have an account? Sign up".
// Saved-logins picker: tapping the Username or Password field while a saved
// login exists for form key 'signin' opens the floating picker; tapping an
// account fills both fields. Sign-in routes to the user's role home.
// The approval notice for the typed username shows above the form.

import { useCallback, useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { FormField } from '../../components/FormField';
import { Icon } from '../../components/Icon';
import { Modal } from '../../components/Modal';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useApp } from '../../services/store';
import type { SavedLogin } from '../../services/store';
import { images } from '../../theme/assets';
import type { ThemeColors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fontFamily, fontSize } from '../../theme/typography';
import type { Role, RootStackNavigationProp } from '../../navigation/types';

type RoleHomeRoute =
  | 'AdminDashboard'
  | 'FarmHome'
  | 'VetHome'
  | 'PlantHome'
  | 'ShopHome'
  | 'MartHome'
  | 'ConsumerScan';

function roleHome(role: Role): RoleHomeRoute {
  switch (role) {
    case 'admin':
      return 'AdminDashboard';
    case 'farm':
      return 'FarmHome';
    case 'vet':
      return 'VetHome';
    case 'plant':
      return 'PlantHome';
    case 'shop':
      return 'ShopHome';
    case 'mart':
      return 'MartHome';
    case 'consumer':
      return 'ConsumerScan';
  }
}

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  farm: 'Farm',
  vet: 'Vet',
  plant: 'Slaughterhouse',
  shop: 'Shop',
  mart: 'Mart',
  consumer: 'Consumer',
};

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface SignInProps {
  navigation: RootStackNavigationProp;
}

export default function SignIn({ navigation }: SignInProps) {
  const { colors, findUser, signIn, forgot, remembered, recordRemember, forgetRemembered } =
    useApp();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  // The sign-in form always opens blank, with the box unticked.
  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setPassword('');
      setRemember(false);
      setError('');
      setPickerOpen(false);
    }, []),
  );

  const saved: SavedLogin[] = useMemo(() => {
    const list = remembered.signin ?? [];
    const q = username.trim().toLowerCase();
    return q ? list.filter(l => l.name.toLowerCase().includes(q)) : list;
  }, [remembered, username]);

  // Approval notice for the account typed in the Username field
  // (first unread notification queued on that account).
  const typedUser = username.trim() ? findUser(username.trim()) : undefined;
  const approvalNotice = typedUser?.notifs?.find(n => !n.read) ?? null;

  const openPickerIfSaved = (fromPassword: boolean) => {
    if (saved.length === 0) {
      return;
    }
    if (fromPassword && password !== '') {
      return;
    }
    setPickerOpen(true);
  };

  const pickSaved = (login: SavedLogin) => {
    setUsername(login.name);
    setPassword(login.pass);
    setRemember(true);
    setPickerOpen(false);
  };

  const handleToggleRemember = () => {
    const next = !remember;
    setRemember(next);
    if (!next && username.trim()) {
      recordRemember('signin', { name: username.trim(), pass: password, role: 'consumer' }, false);
    }
  };

  const handleSignIn = () => {
    const name = username.trim();
    const result = signIn(name, password);
    if (!result.ok || !result.user) {
      setError(result.error ?? 'Wrong username or password.');
      return;
    }
    setError('');
    recordRemember(
      'signin',
      { name, pass: password, role: result.user.role },
      remember,
    );
    navigation.replace(roleHome(result.user.role));
  };

  return (
    <ScreenLayout scroll paddingX={24}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.head}>
          <Image source={images.heroFarm} style={styles.logo} />
          <Text style={styles.title}>Welcome Back</Text>
        </View>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        {approvalNotice ? (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              <Text style={styles.noticeBold}>{approvalNotice.t}.</Text>{' '}
              {approvalNotice.s}
            </Text>
          </View>
        ) : null}
        <View onTouchStart={() => openPickerIfSaved(false)}>
          <FormField
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
          />
        </View>
        <View onTouchStart={() => openPickerIfSaved(true)}>
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>
        <View style={styles.rememberRow}>
          <TouchableOpacity
            onPress={handleToggleRemember}
            style={styles.remember}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: remember }}
          >
            <View style={[styles.checkbox, remember && styles.checkboxOn]}>
              {remember ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <AppButton title="Sign In" onPress={handleSignIn} variant="primary" />
        {forgot.step === 4 ? (
          <View style={[styles.noticeBox, styles.resetNotice]}>
            <Text style={styles.noticeText}>
              Password updated — sign in with your new password.
            </Text>
          </View>
        ) : null}
        <View style={styles.linkLine}>
          <Text style={styles.linkText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkButton}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={pickerOpen} onClose={() => setPickerOpen(false)}>
        <Text style={styles.savedHead}>Saved logins</Text>
        {saved.map(login => (
          <View key={login.name.toLowerCase()} style={styles.savedRow}>
            <TouchableOpacity onPress={() => pickSaved(login)} style={styles.savedPick}>
              <View style={styles.savedAvatar}>
                <Text style={styles.savedAvatarText}>{initialsOf(login.name)}</Text>
              </View>
              <View style={styles.savedMain}>
                <Text style={styles.savedName}>{login.name}</Text>
                <Text style={styles.savedSub}>
                  {ROLE_LABELS[login.role]} · ••••••••
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => forgetRemembered('signin', login.name)}
              style={styles.savedX}
              accessibilityLabel={`Remove saved login for ${login.name}`}
            >
              <Text style={styles.savedXText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Modal>
    </ScreenLayout>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    inner: {
      paddingTop: spacing.md,
    },
    backLink: {
      alignSelf: 'flex-start',
      paddingVertical: 10,
      paddingHorizontal: 4,
      minHeight: 44,
      justifyContent: 'center',
    },
    backText: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.bodySm,
      color: colors.green700,
    },
    head: {
      alignItems: 'center',
      gap: spacing.lg,
      marginTop: 18,
      marginBottom: 26,
    },
    logo: {
      width: 64,
      height: 64,
      borderRadius: radius.logo,
    },
    title: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.h2SignIn,
      letterSpacing: -0.6,
      color: colors.ink,
    },
    errorBox: {
      backgroundColor: colors.redBg,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    errorText: {
      fontFamily: fontFamily.bold,
      fontSize: 13,
      color: colors.red,
    },
    noticeBox: {
      backgroundColor: colors.green100,
      borderWidth: 1,
      borderColor: colors.green200,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    noticeText: {
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      color: colors.green950,
    },
    noticeBold: {
      fontFamily: fontFamily.extraBold,
    },
    resetNotice: {
      marginTop: spacing.lg,
      marginBottom: 0,
    },
    rememberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: -4,
      marginBottom: spacing.lg,
    },
    remember: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 36,
    },
    checkbox: {
      width: 19,
      height: 19,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: colors.chev,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxOn: {
      backgroundColor: colors.green,
      borderColor: colors.green,
    },
    rememberText: {
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      color: colors.ink,
    },
    forgotText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      color: colors.green700,
      paddingVertical: 6,
      paddingHorizontal: 2,
      minHeight: 36,
    },
    linkLine: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
    },
    linkText: {
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      color: colors.muted,
    },
    linkButton: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13.5,
      color: colors.green700,
      padding: 6,
      minHeight: 36,
    },
    savedHead: {
      fontFamily: fontFamily.extraBold,
      fontSize: 11,
      letterSpacing: 0.55,
      textTransform: 'uppercase',
      color: colors.muted,
      paddingVertical: 9,
      paddingHorizontal: 13,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      backgroundColor: colors.green50,
      marginHorizontal: -18,
      marginTop: -20,
      marginBottom: 4,
    },
    savedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    savedPick: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      paddingVertical: 10,
      paddingLeft: spacing.md,
      paddingRight: 4,
      minHeight: 56,
    },
    savedAvatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.green950,
      alignItems: 'center',
      justifyContent: 'center',
    },
    savedAvatarText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13.5,
      color: colors.white,
    },
    savedMain: {
      flex: 1,
    },
    savedName: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
    },
    savedSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12,
      color: colors.muted,
    },
    savedX: {
      padding: 10,
      minWidth: 44,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    savedXText: {
      fontSize: 20,
      color: colors.muted,
    },
  });
}

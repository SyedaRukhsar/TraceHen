// TraceHen forgot-password screen (locked v51 shell).
// "← Back to Sign In" + logo + "Forgot Password" + 3 step pills
// (1 · Email, 2 · Code, 3 · New password).
// Step 1: email -> store.startForgot (wrong/unregistered email -> clear error).
// Step 2: 6-digit code + Demo inbox box showing the code (the demo has no
// mail server) + Verify + Resend after 30s (new code invalidates the old).
// Step 3: new password + confirm -> store.resetForgotPassword.
// Step 4: check icon + "Password Updated" + [Back to Sign In] (the SignIn
// screen then shows the "Password updated" notice).
// The store's forgot state is the source of truth — no parallel copy.

import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppButton } from '../../components/AppButton';
import { FormField } from '../../components/FormField';
import { Icon } from '../../components/Icon';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useApp } from '../../services/store';
import { images } from '../../theme/assets';
import type { ThemeColors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fontFamily, fontSize } from '../../theme/typography';
import type { RootStackNavigationProp } from '../../navigation/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STEP_LABELS = ['1 · Email', '2 · Code', '3 · New password'];

interface ForgotPasswordProps {
  navigation: RootStackNavigationProp;
}

export default function ForgotPassword({ navigation }: ForgotPasswordProps) {
  const {
    colors,
    forgot,
    startForgot,
    verifyForgotCode,
    resendForgotCode,
    resetForgotPassword,
    closeForgot,
  } = useApp();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [step1Error, setStep1Error] = useState('');
  const [resendIn, setResendIn] = useState(0);

  // Entering this screen always starts at step 1 with empty fields.
  useEffect(() => {
    closeForgot();
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resend countdown, from the store's resendAt timestamp.
  useEffect(() => {
    if (forgot.step !== 2 || forgot.resendAt <= 0) {
      setResendIn(0);
      return;
    }
    const tick = () => {
      setResendIn(Math.max(0, Math.ceil((forgot.resendAt - Date.now()) / 1000)));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [forgot.step, forgot.resendAt]);

  const step = forgot.step;
  const currentPill = Math.min(step, 3);

  const handleSendCode = () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStep1Error('Enter a valid email address.');
      return;
    }
    const result = startForgot(value);
    if (!result.ok) {
      setStep1Error(result.error ?? 'No account is linked to this email. Check the email, or create an account first.');
    } else {
      setStep1Error('');
    }
  };

  const handleVerifyCode = () => {
    verifyForgotCode(code.trim());
  };

  const handleResend = () => {
    resendForgotCode();
  };

  const handleReset = () => {
    resetForgotPassword(pass, pass2);
  };

  const goToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScreenLayout scroll paddingX={24}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={goToSignIn} style={styles.backLink}>
          <Text style={styles.backText}>← Back to Sign In</Text>
        </TouchableOpacity>
        <View style={styles.head}>
          <Image source={images.heroFarm} style={styles.logo} />
          <Text style={styles.title}>Forgot Password</Text>
        </View>
        <View style={styles.steps}>
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const isOn = n === currentPill && step !== 4;
            const isDone = n < currentPill || step === 4;
            return (
              <Text
                key={label}
                style={[styles.step, isOn && styles.stepOn, isDone && styles.stepDone]}
              >
                {label}
              </Text>
            );
          })}
        </View>

        {step === 1 ? (
          <View>
            {step1Error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{step1Error}</Text>
              </View>
            ) : null}
            <FormField
              label="Email address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your account email"
              keyboardType="email-address"
            />
            <AppButton
              title="Send Verification Code"
              onPress={handleSendCode}
              variant="primary"
            />
          </View>
        ) : null}

        {step === 2 ? (
          <View>
            <Text style={styles.fpText}>
              We sent a 6-digit code to{' '}
              <Text style={styles.fpTextBold}>{forgot.email}</Text>. Enter it
              below within 10 minutes.
            </Text>
            <View style={styles.demoInbox}>
              <Text style={styles.demoInboxTag}>Demo inbox</Text>
              <Text style={styles.demoInboxText}>
                This demo can&apos;t send real email, so your code arrives here
                instead:
              </Text>
              <Text style={styles.demoInboxCode}>{forgot.code}</Text>
            </View>
            {forgot.error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{forgot.error}</Text>
              </View>
            ) : null}
            <FormField
              label="Verification code"
              value={code}
              onChangeText={v => setCode(v.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              keyboardType="numeric"
            />
            <AppButton
              title="Verify Code"
              onPress={handleVerifyCode}
              variant="primary"
            />
            <Text style={styles.resendLine}>
              Didn&apos;t get the code?{' '}
              <Text
                style={[styles.resendLink, resendIn > 0 && styles.resendLinkDisabled]}
                onPress={resendIn > 0 ? undefined : handleResend}
              >
                Resend code
              </Text>
              {resendIn > 0 ? (
                <Text style={styles.resendNote}>
                  {'\n'}You can resend in {resendIn}s
                </Text>
              ) : null}
            </Text>
          </View>
        ) : null}

        {step === 3 ? (
          <View>
            <Text style={styles.fpText}>
              Code verified. Choose a new password for{' '}
              <Text style={styles.fpTextBold}>{forgot.accountName}</Text>.
            </Text>
            {forgot.error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{forgot.error}</Text>
              </View>
            ) : null}
            <FormField
              label="New password"
              value={pass}
              onChangeText={setPass}
              placeholder="Minimum 8 characters"
              secureTextEntry
            />
            <FormField
              label="Confirm new password"
              value={pass2}
              onChangeText={setPass2}
              placeholder="Repeat new password"
              secureTextEntry
            />
            <AppButton
              title="Reset Password"
              onPress={handleReset}
              variant="primary"
            />
          </View>
        ) : null}

        {step === 4 ? (
          <View style={styles.doneBox}>
            <View style={styles.bigIcon}>
              <Icon name="check" size={34} color={colors.green700} strokeWidth={2.4} />
            </View>
            <Text style={styles.doneTitle}>Password Updated</Text>
            <Text style={styles.doneText}>
              Your password has been reset. Sign in with your new password.
            </Text>
            <AppButton
              title="Back to Sign In"
              onPress={goToSignIn}
              variant="primary"
            />
          </View>
        ) : null}
      </View>
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
    steps: {
      flexDirection: 'row',
      gap: 6,
      marginTop: -4,
      marginBottom: 18,
    },
    step: {
      flex: 1,
      textAlign: 'center',
      fontFamily: fontFamily.extraBold,
      fontSize: 11,
      color: colors.muted,
      borderWidth: 1.5,
      borderColor: colors.line,
      borderRadius: radius.pill,
      paddingVertical: 8,
      paddingHorizontal: 1,
      backgroundColor: colors.card,
    },
    stepOn: {
      backgroundColor: colors.green,
      borderColor: colors.green,
      color: colors.white,
    },
    stepDone: {
      backgroundColor: colors.green50,
      borderColor: colors.green200,
      color: colors.green900,
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
    fpText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13.5,
      lineHeight: 21,
      color: colors.muted,
      marginBottom: spacing.lg,
    },
    fpTextBold: {
      fontFamily: fontFamily.bold,
      color: colors.ink,
    },
    demoInbox: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.green,
      backgroundColor: colors.green50,
      borderRadius: radius.md,
      paddingVertical: 13,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      alignItems: 'center',
    },
    demoInboxTag: {
      fontFamily: fontFamily.extraBold,
      fontSize: 10.5,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: colors.green700,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.green200,
      paddingVertical: 3,
      paddingHorizontal: 9,
      borderRadius: radius.pill,
      marginBottom: spacing.sm,
    },
    demoInboxText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12.5,
      lineHeight: 19,
      color: colors.muted,
      textAlign: 'center',
      marginBottom: 6,
    },
    demoInboxCode: {
      fontFamily: fontFamily.extraBold,
      fontSize: 26,
      letterSpacing: 7.8,
      color: colors.green950,
    },
    resendLine: {
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      color: colors.muted,
      marginTop: spacing.lg,
    },
    resendLink: {
      fontFamily: fontFamily.extraBold,
      color: colors.green700,
    },
    resendLinkDisabled: {
      opacity: 0.45,
    },
    resendNote: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12,
      color: colors.muted,
    },
    doneBox: {
      alignItems: 'center',
      textAlign: 'center',
      paddingVertical: 34,
      paddingHorizontal: 22,
    },
    bigIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.green100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    doneTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
      marginBottom: 6,
    },
    doneText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13.5,
      lineHeight: 21,
      color: colors.muted,
      marginBottom: 22,
      textAlign: 'center',
    },
  });
}

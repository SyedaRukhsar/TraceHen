// TraceHen sign-up screen (locked v51 shell).
// One unified form: Full name, Email, Password, Confirm password, Role
// (Farm / Vet / Slaughterhouse / Shop / Mart / Consumer — NO Admin), then
// Mobile (business roles only) and ONLY the selected role's own fields
// (labels/placeholders copied verbatim from shell.html). Site pin opens the
// MapPicker; Documents use the FilePicker (real file picker, shows the file
// by its real name). Consumer: immediately ACTIVE -> ConsumerScan.
// Business: PENDING -> Pending screen. The form opens BLANK every time;
// returning from the MapPicker must NOT clear in-progress entries.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { FilePicker } from '../../components/FilePicker';
import type { PickedFile } from '../../components/FilePicker';
import { FormField } from '../../components/FormField';
import { Icon } from '../../components/Icon';
import { Modal } from '../../components/Modal';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useApp } from '../../services/store';
import type { ThemeColors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fontFamily, fontSize } from '../../theme/typography';
import type { Role } from '../../types/models';
import type { RootStackNavigationProp } from '../../navigation/types';

type BusinessRole = 'farm' | 'vet' | 'plant' | 'shop' | 'mart';

interface RoleFieldDef {
  key: string;
  label: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
}

interface RoleDocDef {
  key: string;
  /** Document name stored on the application record. */
  name: string;
  /** Button label — FilePicker renders "Upload {label}". */
  label: string;
  accept: 'pdf' | 'image' | 'any';
}

interface RoleConfig {
  role: BusinessRole;
  selectLabel: string;
  fields: RoleFieldDef[];
  docs: RoleDocDef[];
}

const ROLE_CONFIGS: Record<BusinessRole, RoleConfig> = {
  farm: {
    role: 'farm',
    selectLabel: 'Farm',
    fields: [
      { key: 'farm-business', label: 'Farm name', placeholder: 'e.g. Al-Barkat Broiler Farm' },
      { key: 'farm-address', label: 'Address', placeholder: 'Chak / Road' },
      { key: 'farm-district', label: 'District / Tehsil', placeholder: 'Faisalabad / Samundri' },
      { key: 'farm-license', label: 'License number', placeholder: 'LIC-2026-___' },
    ],
    docs: [{ key: 'farmLic', name: 'Farm license', label: 'license', accept: 'any' }],
  },
  vet: {
    role: 'vet',
    selectLabel: 'Vet',
    fields: [
      { key: 'vet-business', label: 'Clinic name', placeholder: 'e.g. Usman Veterinary Clinic' },
      { key: 'vet-reg', label: 'Registration number', placeholder: 'RVMP ____' },
      { key: 'vet-license', label: 'License number', placeholder: 'LIC-2026-___' },
      { key: 'vet-address', label: 'Address', placeholder: 'Clinic address' },
      { key: 'vet-district', label: 'District / Tehsil', placeholder: 'Faisalabad / Samundri' },
    ],
    docs: [
      { key: 'vetReg', name: 'Vet registration card', label: 'registration card', accept: 'any' },
      { key: 'vetLic', name: 'Clinic license', label: 'clinic license', accept: 'any' },
    ],
  },
  plant: {
    role: 'plant',
    selectLabel: 'Slaughterhouse',
    fields: [
      { key: 'plant-business', label: 'Plant name', placeholder: 'e.g. Punjab Fresh Abattoir' },
      { key: 'plant-license', label: 'License number', placeholder: 'LIC-2026-___' },
      { key: 'plant-capacity', label: 'Daily capacity (birds)', placeholder: 'e.g. 6000', keyboardType: 'numeric' },
      { key: 'plant-address', label: 'Address', placeholder: 'Plant address' },
      { key: 'plant-district', label: 'District / Tehsil', placeholder: 'Faisalabad / Faisalabad' },
    ],
    docs: [
      { key: 'plantLic', name: 'Plant license', label: 'plant license', accept: 'any' },
      { key: 'plantCert', name: 'Plant registration certificate', label: 'registration certificate', accept: 'any' },
    ],
  },
  shop: {
    role: 'shop',
    selectLabel: 'Shop',
    fields: [
      { key: 'shop-business', label: 'Shop name', placeholder: 'e.g. Madina Live Chicken Shop' },
      { key: 'shop-address', label: 'Address', placeholder: 'Shop address' },
      { key: 'shop-district', label: 'District / Tehsil', placeholder: 'Faisalabad / Samanabad' },
    ],
    docs: [
      { key: 'shopLic', name: 'Shop license', label: 'shop license', accept: 'any' },
      { key: 'shopSign', name: 'Shop signboard photo', label: 'signboard photo', accept: 'image' },
    ],
  },
  mart: {
    role: 'mart',
    selectLabel: 'Mart',
    fields: [
      { key: 'mart-business', label: 'Mart name', placeholder: 'e.g. Imtiaz Mega Mart' },
      { key: 'mart-license', label: 'License number', placeholder: 'LIC-2026-___' },
      { key: 'mart-address', label: 'Address', placeholder: 'Mart address' },
      { key: 'mart-district', label: 'District / Tehsil', placeholder: 'Faisalabad / Faisalabad' },
    ],
    docs: [
      { key: 'martLic', name: 'Business license', label: 'business license', accept: 'any' },
      { key: 'martReg', name: 'Business registration', label: 'business registration', accept: 'any' },
    ],
  },
};

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'farm', label: 'Farm' },
  { value: 'vet', label: 'Vet' },
  { value: 'plant', label: 'Slaughterhouse' },
  { value: 'shop', label: 'Shop' },
  { value: 'mart', label: 'Mart' },
  { value: 'consumer', label: 'Consumer' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PinState {
  label: string;
  address: string;
}

interface SignUpProps {
  navigation: RootStackNavigationProp;
}

export default function SignUp({ navigation }: SignUpProps) {
  const { colors, signUp, pendingPin, clearPendingPin } = useApp();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [pins, setPins] = useState<Record<string, PinState>>({});
  const [docs, setDocs] = useState<Record<string, PickedFile>>({});
  const [error, setError] = useState('');
  const [rolePickerOpen, setRolePickerOpen] = useState(false);

  // Returning from the MapPicker must NOT clear in-progress entries.
  const skipResetRef = useRef(false);

  const resetForm = useCallback(() => {
    setName('');
    setEmail('');
    setMobile('');
    setPassword('');
    setPassword2('');
    setRole('');
    setFields({});
    setPins({});
    setDocs({});
    setError('');
    setRolePickerOpen(false);
    clearPendingPin();
  }, [clearPendingPin]);

  // The form opens BLANK every time — except when coming back from the
  // MapPicker, where the in-progress entries must survive.
  useFocusEffect(
    useCallback(() => {
      if (skipResetRef.current) {
        skipResetRef.current = false;
        return;
      }
      resetForm();
    }, [resetForm]),
  );

  // Consume the pin the MapPicker confirmed for this role.
  useEffect(() => {
    if (!pendingPin) {
      return;
    }
    setPins(prev => ({
      ...prev,
      [pendingPin.role]: { label: pendingPin.label, address: pendingPin.address },
    }));
    clearPendingPin();
  }, [pendingPin, clearPendingPin]);

  const setField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const isBusiness = role !== '' && role !== 'consumer';
  const config: RoleConfig | null = isBusiness
    ? ROLE_CONFIGS[role as BusinessRole]
    : null;

  const openMapPicker = () => {
    if (!config) {
      return;
    }
    skipResetRef.current = true;
    navigation.navigate('MapPicker', { role: config.role });
  };

  const handleSubmit = () => {
    if (!role) {
      setError('Please select your role.');
      return;
    }
    const isConsumer = role === 'consumer';
    const requiredMissing =
      !name.trim() ||
      !email.trim() ||
      !password ||
      !password2 ||
      (!isConsumer && !mobile.trim()) ||
      (config !== null &&
        config.fields.some(f => !(fields[f.key] ?? '').trim()));
    if (requiredMissing) {
      setError(
        isConsumer || role === 'shop'
          ? 'All fields are required.'
          : 'All fields are required. Email and license number are mandatory.',
      );
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }
    // Business roles: site pin and documents are required (same required
    // message as the HTML's required-field check — no separate copy exists).
    if (config !== null) {
      if (!pins[config.role]) {
        setError('All fields are required.');
        return;
      }
      if (config.docs.some(d => !docs[d.key])) {
        setError('All fields are required.');
        return;
      }
    }
    setError('');
    const result = signUp({
      name: name.trim(),
      email: email.trim(),
      mobile: isConsumer ? '' : mobile.trim(),
      password,
      role,
      business: config ? (fields[`${config.role}-business`] ?? '').trim() : '',
      address: config ? (fields[`${config.role}-address`] ?? '').trim() : '',
      district: config ? (fields[`${config.role}-district`] ?? '').trim() : '',
      license:
        config && role !== 'shop'
          ? (fields[`${config.role}-license`] ?? '').trim()
          : '',
      regNumber: role === 'vet' ? (fields['vet-reg'] ?? '').trim() : '',
      capacity: role === 'plant' ? (fields['plant-capacity'] ?? '').trim() : '',
      pinSet: config !== null && !!pins[config.role],
      docs: config
        ? config.docs
            .filter(d => docs[d.key])
            .map(d => ({
              name: d.name,
              type: docs[d.key].type,
              file: docs[d.key].file,
            }))
        : [],
    });
    if (!result.ok) {
      setError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }
    if (result.status === 'ACTIVE') {
      navigation.replace('ConsumerScan');
    } else {
      navigation.navigate('Pending');
    }
  };

  const roleLabel =
    ROLE_OPTIONS.find(o => o.value === role)?.label ?? 'Select your role';

  return (
    <ScreenLayout scroll paddingX={24}>
      <View style={styles.inner}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          style={styles.backLink}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <FormField
          label="Full name"
          required
          value={name}
          onChangeText={setName}
          placeholder="Full name"
        />
        <FormField
          label="Email"
          required
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          keyboardType="email-address"
        />
        <FormField
          label="Password"
          required
          value={password}
          onChangeText={setPassword}
          placeholder="Minimum 8 characters"
          secureTextEntry
        />
        <FormField
          label="Confirm password"
          required
          value={password2}
          onChangeText={setPassword2}
          placeholder="Repeat password"
          secureTextEntry
        />
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Role *</Text>
          <TouchableOpacity
            onPress={() => setRolePickerOpen(true)}
            style={styles.selectBox}
            accessibilityRole="button"
          >
            <Text
              style={[styles.selectText, role === '' && styles.selectPlaceholder]}
            >
              {roleLabel}
            </Text>
          </TouchableOpacity>
        </View>
        {isBusiness ? (
          <FormField
            label="Mobile number"
            required
            value={mobile}
            onChangeText={setMobile}
            placeholder="0300-0000000"
            keyboardType="phone-pad"
          />
        ) : null}
        {config !== null
          ? config.fields.map(f => (
              <FormField
                key={f.key}
                label={f.label}
                required
                value={fields[f.key] ?? ''}
                onChangeText={v => setField(f.key, v)}
                placeholder={f.placeholder}
                keyboardType={f.keyboardType}
              />
            ))
          : null}
        {config !== null ? (
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Site pin *</Text>
            <TouchableOpacity onPress={openMapPicker} style={styles.pinButton}>
              <View style={styles.pinButtonRow}>
                <Icon name="mapPin" size={17} color={colors.green900} />
                <Text style={styles.pinButtonText}>Set location pin</Text>
              </View>
              {pins[config.role] ? (
                <Text style={styles.pinState}>
                  Pin set · {pins[config.role].address}
                </Text>
              ) : null}
            </TouchableOpacity>
          </View>
        ) : null}
        {config !== null ? (
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Documents *</Text>
            {config.docs.map((d, i) => (
              <View
                key={d.key}
                style={i > 0 ? styles.docGap : undefined}
              >
                <FilePicker
                  label={d.label}
                  accept={d.accept}
                  value={docs[d.key] ?? null}
                  onPick={file =>
                    setDocs(prev => ({ ...prev, [d.key]: file }))
                  }
                />
              </View>
            ))}
          </View>
        ) : null}
        <AppButton
          title="Create Account"
          onPress={handleSubmit}
          variant="primary"
        />
        <View style={styles.linkLine}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.linkButton}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={rolePickerOpen}
        onClose={() => setRolePickerOpen(false)}
      >
        <Text style={styles.modalHead}>Select your role</Text>
        {ROLE_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            onPress={() => {
              setRole(option.value);
              setError('');
              setRolePickerOpen(false);
            }}
            style={styles.roleRow}
          >
            <Text
              style={[
                styles.roleRowText,
                role === option.value && styles.roleRowTextOn,
              ]}
            >
              {option.label}
            </Text>
            {role === option.value ? (
              <Icon name="check" size={18} color={colors.green} />
            ) : null}
          </TouchableOpacity>
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
    title: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.h2SignUp,
      color: colors.ink,
      marginTop: 6,
      marginBottom: 20,
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
    fieldWrap: {
      marginBottom: spacing.gapLg,
    },
    fieldLabel: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      color: colors.green950,
      marginBottom: 7,
    },
    selectBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1.5,
      borderColor: colors.line,
      borderRadius: radius.input,
      paddingVertical: 12,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.inputBg,
      minHeight: 44,
    },
    selectText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.input,
      color: colors.ink,
    },
    selectPlaceholder: {
      color: colors.muted,
    },
    pinButton: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.green200,
      backgroundColor: colors.green50,
      borderRadius: radius.md,
      padding: spacing.lg,
      alignItems: 'center',
      minHeight: 48,
    },
    pinButtonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    pinButtonText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13.5,
      color: colors.green900,
    },
    pinState: {
      fontFamily: fontFamily.bold,
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    docGap: {
      marginTop: spacing.sm,
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
    roleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 13,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      minHeight: 48,
    },
    modalHead: {
      fontFamily: fontFamily.extraBold,
      fontSize: 17,
      color: colors.ink,
      paddingBottom: spacing.md,
    },
    roleRowText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.input,
      color: colors.ink,
    },
    roleRowTextOn: {
      fontFamily: fontFamily.extraBold,
      color: colors.green700,
    },
  });
}

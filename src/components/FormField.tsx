// Label + input — CSS `.field` (+ `.pwd-wrap` / `.eye-btn` for passwords).
// Label 13px weight 800 with a red asterisk when required; input min-height
// 44, radius 12, input-bg. Only label + input + error — no helper text.
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import type { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  editable?: boolean;
  error?: string;
  icon?: IconName;
  rightIcon?: ReactNode;
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  editable = true,
  error,
  icon,
  rightIcon,
}: FormFieldProps) {
  const { colors, theme } = useApp();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const labelColor = theme === 'dark' ? colors.ink : colors.green950;

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: labelColor }]}>
        {label}
        {required ? <Text style={{ color: colors.red }}> *</Text> : null}
      </Text>
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            {
              borderColor: error ? colors.red : focused ? colors.green : colors.line,
              backgroundColor: focused ? colors.card : colors.inputBg,
              color: colors.ink,
              minHeight: multiline ? 78 : 44,
              paddingLeft: icon ? 44 : 14,
              paddingRight: secureTextEntry || rightIcon ? 48 : 14,
            },
          ]}
        />
        {icon ? (
          <View style={styles.leftIcon}>
            <Icon name={icon} size={20} color={colors.muted} />
          </View>
        ) : null}
        {secureTextEntry ? (
          <Pressable
            onPress={() => setShowPassword(v => !v)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'eyeOff' : 'eye'} size={21} color={colors.muted} />
          </Pressable>
        ) : rightIcon ? (
          <View style={styles.eyeButton}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: colors.red }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: fontForWeight(800),
    marginBottom: 7,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: fontForWeight(600),
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  eyeButton: {
    position: 'absolute',
    right: 6,
    top: 3,
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 13,
    fontFamily: fontForWeight(700),
    marginTop: 6,
  },
});

// Primary button — CSS `.btn` (radius 14, min-height 44, font-size 15,
// weight 800). Variants match the CSS button classes exactly.
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { radius } from '../theme/spacing';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type AppButtonVariant = 'primary' | 'outline' | 'ghost' | 'dark' | 'danger' | 'amber';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
}: AppButtonProps) {
  const { colors } = useApp();

  const textColor =
    variant === 'primary' || variant === 'dark'
      ? '#ffffff'
      : variant === 'outline'
        ? colors.green700
        : variant === 'ghost'
          ? colors.green900
          : variant === 'danger'
            ? colors.red
            : colors.amber;

  const variantStyle: ViewStyle =
    variant === 'primary'
      ? {
          backgroundColor: colors.green,
          shadowColor: colors.green,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 8,
        }
      : variant === 'outline'
        ? { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.green }
        : variant === 'ghost'
          ? { backgroundColor: colors.green50, borderWidth: 1, borderColor: colors.green100 }
          : variant === 'dark'
            ? { backgroundColor: colors.green950 }
            : variant === 'danger'
              ? { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.dangerBorder }
              : { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.amberBorder };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        fullWidth ? styles.fullWidth : styles.shrink,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
      accessibilityRole="button"
    >
      {icon && iconPosition === 'left' ? <Icon name={icon} size={18} color={textColor} /> : null}
      <Text style={[styles.label, { color: textColor }]}>{title}</Text>
      {icon && iconPosition === 'right' ? <Icon name={icon} size={18} color={textColor} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: radius.button,
    paddingVertical: 13,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  shrink: {
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  label: {
    fontSize: 15,
    fontFamily: fontForWeight(800),
  },
});

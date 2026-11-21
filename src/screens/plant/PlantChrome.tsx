// Plant (Slaughterhouse) module — shared chrome + small presentational pieces.
// Replicates the locked HTML `.app-top` header (logo photo, title, bell with
// badge, theme button, avatar) and `.bottom-nav` (Home / Lots / Packs /
// Settings), plus the repeated card / row / pill / field pieces from css.css.
// The shared components named in the conversion spec (Icon, ListCard,
// RowItem, Pill, ChipRow, DocViewer, QRCode, Toast, Switch, …) do not exist
// in this checkout yet, so the pieces live here inside the module instead of
// importing modules that do not resolve.

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Home,
  Info,
  List,
  Moon,
  Package,
  Settings,
  Sun,
} from 'lucide-react-native';
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { useApp } from '../../services/store';
import { QRCode } from '../../components/QRCode';
import type { RootStackParamList } from '../../navigation/types';
import { images } from '../../theme/assets';
import type { ThemeColors } from '../../theme/colors';
import type { LotStatus } from '../../types/models';
import {
  plantSeedNotifCount,
  plantStyles,
  statusLabel,
  statusPillClass,
} from './helpers';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;

export type PlantTab = 'home' | 'lots' | 'packs' | 'settings';

const TAB_ROUTES: Record<
  PlantTab,
  'PlantHome' | 'PlantLots' | 'PlantPacks' | 'PlantSettings'
> = {
  home: 'PlantHome',
  lots: 'PlantLots',
  packs: 'PlantPacks',
  settings: 'PlantSettings',
};

const TABS: { key: PlantTab; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'lots', label: 'Lots', icon: List },
  { key: 'packs', label: 'Packs', icon: Package },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function PlantHeader({
  subtitle,
  showBack = false,
}: {
  subtitle: string;
  showBack?: boolean;
}) {
  const { colors, theme, toggleTheme, currentUser, unreadCount, data, scopeKey } =
    useApp();
  const navigation = useNavigation<PlantNav>();
  const badge = unreadCount + plantSeedNotifCount(data, scopeKey);
  const initial = (currentUser?.name ?? 'K').trim().charAt(0).toUpperCase() || 'K';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 12,
      }}>
      {showBack ? (
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ArrowLeft size={22} color={colors.ink} strokeWidth={2.4} />
        </Pressable>
      ) : null}
      <Image
        source={images.heroFarm}
        style={{ width: 40, height: 40, borderRadius: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'Manrope-ExtraBold',
            fontSize: 15,
            color: colors.ink,
          }}>
          TraceHen Slaughterhouse
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'Manrope-SemiBold',
            fontSize: 12.5,
            color: colors.muted,
          }}>
          {subtitle}
        </Text>
      </View>
      <Pressable
        onPress={() => navigation.navigate('PlantNotifications')}
        accessibilityLabel="Notifications"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Bell size={22} color={colors.ink} strokeWidth={2} />
        {badge > 0 ? (
          <View
            style={{
              position: 'absolute',
              top: 2,
              right: 0,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.badgeRed,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 10.5,
                color: colors.white,
              }}>
              {badge}
            </Text>
          </View>
        ) : null}
      </Pressable>
      <Pressable
        onPress={toggleTheme}
        accessibilityLabel={
          theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        }
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {theme === 'dark' ? (
          <Sun size={22} color={colors.ink} strokeWidth={2} />
        ) : (
          <Moon size={22} color={colors.ink} strokeWidth={2} />
        )}
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('PlantProfile')}
        accessibilityLabel="Open profile"
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.green,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Manrope-ExtraBold',
            fontSize: 15,
            color: colors.white,
          }}>
          {initial}
        </Text>
      </Pressable>
    </View>
  );
}

export function PlantBottomNav({ active }: { active: PlantTab }) {
  const { colors } = useApp();
  const navigation = useNavigation<PlantNav>();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.line,
        paddingTop: 6,
        paddingBottom: 6,
      }}>
      {TABS.map(tab => {
        const isActive = tab.key === active;
        const color = isActive ? colors.green700 : colors.muted;
        const TabIcon = tab.icon;
        return (
          <Pressable
            key={tab.key}
            onPress={() => navigation.navigate(TAB_ROUTES[tab.key])}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              minHeight: 52,
              backgroundColor: isActive ? colors.green50 : 'transparent',
              borderRadius: 12,
              marginHorizontal: 2,
            }}>
            <TabIcon size={24} color={color} strokeWidth={2} />
            <Text
              style={{
                fontFamily: isActive ? 'Manrope-Bold' : 'Manrope-Medium',
                fontSize: 11,
                color,
              }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function PlantScreen({
  subtitle,
  showBack = false,
  activeTab,
  children,
}: {
  subtitle: string;
  showBack?: boolean;
  activeTab?: PlantTab;
  children: ReactNode;
}) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <View style={styles.root}>
      <PlantHeader subtitle={subtitle} showBack={showBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      {activeTab ? <PlantBottomNav active={activeTab} /> : null}
    </View>
  );
}

export function Pill({ status }: { status: LotStatus }) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  const cls = statusPillClass(status);
  const pillStyle =
    cls === 'pending'
      ? styles.pillPending
      : cls === 'needs_info'
        ? styles.pillNeedsInfo
        : cls === 'manual'
          ? styles.pillManual
          : styles.pillActive;
  return <Text style={[styles.pill, pillStyle]}>{statusLabel(status)}</Text>;
}

export function PillText({ label, tone }: { label: string; tone: 'active' | 'manual' }) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <Text
      style={[styles.pill, tone === 'manual' ? styles.pillManual : styles.pillActive]}>
      {label}
    </Text>
  );
}

export function KvRow({
  label,
  value,
  ok = false,
  last = false,
}: {
  label: string;
  value: string;
  ok?: boolean;
  last?: boolean;
}) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <View style={[styles.kvRow, last ? styles.kvRowLast : null]}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={[styles.kvValue, ok ? styles.kvValueOk : null]}>{value}</Text>
    </View>
  );
}

export function ErrorBox({ message }: { message: string }) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  if (!message) {
    return null;
  }
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  hint,
  secureTextEntry = false,
  multiline = false,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  hint?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
}) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        editable={editable}
        style={styles.fieldInput}
      />
      {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
    </View>
  );
}

export function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={!visible}
          autoCapitalize="none"
          style={[styles.fieldInput, { flex: 1, paddingRight: 44 }]}
        />
        <Pressable
          onPress={() => setVisible(v => !v)}
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: 4,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {visible ? (
            <EyeOff size={20} color={colors.muted} strokeWidth={2} />
          ) : (
            <Eye size={20} color={colors.muted} strokeWidth={2} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

export function OptionRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.optionRow, selected ? styles.optionRowOn : null]}>
      <View style={[styles.optionRadio, selected ? styles.optionRadioOn : null]}>
        {selected ? <View style={styles.optionRadioDot} /> : null}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </Pressable>
  );
}

export function AutoBox({ label, value }: { label: string; value: string }) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <View style={styles.autoBox}>
      <Text style={styles.autoLabel}>{label}</Text>
      <Text style={styles.autoValue}>{value}</Text>
    </View>
  );
}

export function InfoBox({ title, text }: { title: string; text: string }) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <View style={styles.infoBox}>
      <Info size={20} color={colors.blue} strokeWidth={2} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
}

export function dotStyle(c: string, colors: ThemeColors): string {
  if (c === 'amber') {
    return colors.amber;
  }
  if (c === 'red') {
    return colors.red;
  }
  if (c === 'gray') {
    return colors.chev;
  }
  return colors.green;
}

export function HistoryList({
  items,
}: {
  items: { t: string; s: string; c: string }[];
}) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <View>
      {items.map((item, i) => (
        <View
          key={`${item.t}-${i}`}
          style={[styles.historyRow, i === items.length - 1 ? styles.historyRowLast : null]}>
          <View style={[styles.dot, { backgroundColor: dotStyle(item.c, colors) }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle}>{item.t}</Text>
            <Text style={styles.historySub}>{item.s}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function TimelineList({
  items,
}: {
  items: { t: string; s: string }[];
}) {
  const { colors } = useApp();
  const styles = plantStyles(colors);
  return (
    <View>
      {items.map((item, i) => (
        <View
          key={`${item.t}-${i}`}
          style={[
            styles.timelineRow,
            i === items.length - 1 ? styles.timelineRowLast : null,
          ]}>
          <View style={styles.timelineIcon}>
            <Check size={15} color={colors.green700} strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle}>{item.t}</Text>
            <Text style={styles.historySub}>{item.s}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function Chevron() {
  const { colors } = useApp();
  return <ChevronRight size={20} color={colors.chev} strokeWidth={2} />;
}

/**
 * Pack QR — a REAL QR code encoding the pack ID (shared QRCode component).
 * The HTML's qrSVG is a decorative pseudo-QR that encodes nothing, so the
 * vision-camera scanner cannot read it; the RN app uses a real QR so a pack
 * can actually be scanned. Same value (the pack ID), same size.
 */
export function PackQr({ seed, size }: { seed: string; size: number }) {
  return <QRCode value={seed} size={size} />;
}

export function SettingsSwitch({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) {
  const { colors } = useApp();
  return (
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.grayBg, true: colors.green }}
      thumbColor={colors.white}
    />
  );
}

// Shared Farm UI pieces — styles copied from css.css (.btn, .field,
// .detail-card, .kv, .pill, .seg, .history, .timeline, .row-item).
// Every piece reads its colors from the store theme; no hard-coded values.

import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { KeyboardTypeOptions, TextStyle, ViewStyle } from 'react-native';
import { Check, ChevronRight, Truck } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../../services/store';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import type { PillKind } from './farmHelpers';

// ---------- Pill (css .pill) ----------

export function Pill({ kind, label }: { kind: PillKind; label: string }) {
  const { colors } = useApp();
  const bg =
    kind === 'active'
      ? colors.green100
      : kind === 'pending'
        ? colors.amberBg
        : colors.blueBg;
  const fg =
    kind === 'active'
      ? colors.green900
      : kind === 'pending'
        ? colors.amber
        : colors.blue;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

// ---------- Buttons (css .btn / .add-btn) ----------

export function FarmButton({
  title,
  onPress,
  variant = 'primary',
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
}) {
  const { colors } = useApp();
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.btn,
        primary
          ? { backgroundColor: colors.green }
          : [
              styles.btnOutline,
              { backgroundColor: colors.card, borderColor: colors.green },
            ],
        style,
      ]}
    >
      <Text
        style={[
          styles.btnText,
          { color: primary ? colors.white : colors.green700 },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function AddButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.addBtn,
        {
          borderColor: colors.green,
          backgroundColor: colors.green50,
        },
      ]}
    >
      <Text style={[styles.addBtnText, { color: colors.green900 }]}>
        {title}
      </Text>
    </Pressable>
  );
}

// ---------- Form field (css .field) ----------

export function FarmField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  editable = true,
  right,
}: {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
  right?: ReactNode;
}) {
  const { colors } = useApp();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.green950 }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputRow,
          {
            borderColor: colors.line,
            backgroundColor: colors.inputBg,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          editable={editable}
          style={[
            styles.input,
            { color: colors.ink },
            multiline ? styles.inputMultiline : null,
          ]}
        />
        {right}
      </View>
    </View>
  );
}

// ---------- Error box (css .form-error) ----------

export function ErrorBox({ message }: { message: string }) {
  const { colors } = useApp();
  if (!message) {
    return null;
  }
  return (
    <View
      style={[styles.errorBox, { backgroundColor: colors.redBg }]}
    >
      <Text style={[styles.errorText, { color: colors.red }]}>
        {message}
      </Text>
    </View>
  );
}

// ---------- Page title / subtitle (css .page-title / .page-sub) ----------

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  const { colors } = useApp();
  return (
    <View>
      <Text style={[styles.pageTitle, { color: colors.ink }]}>{title}</Text>
      {sub ? (
        <Text style={[styles.pageSub, { color: colors.muted }]}>{sub}</Text>
      ) : null}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  const { colors } = useApp();
  return (
    <Text style={[styles.sectionLabel, { color: colors.muted }]}>
      {children}
    </Text>
  );
}

// ---------- Detail card + kv rows (css .detail-card / .kv) ----------

export function DetailCard({
  title,
  children,
  style,
}: {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.detailCard,
        { backgroundColor: colors.card, borderColor: colors.line },
        style,
      ]}
    >
      {title ? (
        <Text style={[styles.detailTitle, { color: colors.green700 }]}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export function KvRow({
  label,
  value,
  ok = false,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  const { colors } = useApp();
  return (
    <View style={[styles.kv, { borderBottomColor: colors.line }]}>
      <Text style={[styles.kvLabel, { color: colors.muted }]}>{label}</Text>
      <Text
        style={[
          styles.kvValue,
          { color: ok ? colors.green700 : colors.ink },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// ---------- List card + row (css .list-card / .row-item) ----------

export function ListCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.listCard,
        { backgroundColor: colors.card, borderColor: colors.line },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function RowItem({
  title,
  sub,
  pill,
  onPress,
}: {
  title: string;
  sub: string;
  pill?: ReactNode;
  onPress: () => void;
}) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.rowItem, { borderBottomColor: colors.line }]}
    >
      <View style={styles.rowMain}>
        <Text style={[styles.rowTitle, { color: colors.ink }]}>{title}</Text>
        <Text style={[styles.rowSub, { color: colors.muted }]}>{sub}</Text>
      </View>
      {pill}
      <ChevronRight size={20} color={colors.chev} style={styles.rowChev} />
    </Pressable>
  );
}

export function EmptyNote({ text }: { text: string }) {
  const { colors } = useApp();
  return (
    <Text style={[styles.emptyNote, { color: colors.muted }]}>{text}</Text>
  );
}

// ---------- History list (css .history) ----------

export interface HistoryEntry {
  t: string;
  s: string;
  c: string;
}

export function dotColor(c: string, colors: { green: string; red: string }): string {
  if (c === 'gray') {
    return '#c3cec5';
  }
  if (c === 'red') {
    return colors.red;
  }
  if (c === 'amber') {
    return '#d97706';
  }
  if (c === 'blue') {
    return '#2563eb';
  }
  return colors.green;
}

export function HistoryList({ items }: { items: HistoryEntry[] }) {
  const { colors } = useApp();
  return (
    <View>
      {items.map((a, i) => (
        <View
          key={`${a.t}|${a.s}|${i}`}
          style={[
            styles.historyRow,
            i < items.length - 1
              ? { borderBottomColor: colors.line }
              : styles.historyRowLast,
          ]}
        >
          <View
            style={[
              styles.historyDot,
              { backgroundColor: dotColor(a.c, colors) },
            ]}
          />
          <View style={styles.historyBody}>
            <Text style={[styles.historyTitle, { color: colors.ink }]}>
              {a.t}
            </Text>
            <Text style={[styles.historySub, { color: colors.muted }]}>
              {a.s}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ---------- Segmented control (css .seg) ----------

export function SegControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { colors } = useApp();
  return (
    <View style={styles.seg}>
      {options.map(opt => {
        const on = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              styles.segBtn,
              {
                borderColor: on ? colors.green : colors.line,
                backgroundColor: on ? colors.green : colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.segText,
                { color: on ? colors.white : colors.muted },
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------- Option list (select replacement — no native picker installed) ----------

export function OptionList({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { colors } = useApp();
  return (
    <View style={styles.optionList}>
      {options.map(opt => {
        const on = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.optionRow, { borderBottomColor: colors.line }]}
          >
            <View
              style={[
                styles.radioOuter,
                { borderColor: on ? colors.green : colors.line },
              ]}
            >
              {on ? (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: colors.green },
                  ]}
                />
              ) : null}
            </View>
            <Text
              style={[
                styles.optionText,
                { color: on ? colors.ink : colors.muted },
              ]}
            >
              {opt}
            </Text>
            {on ? <Check size={18} color={colors.green700} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------- Timeline (css .timeline) ----------

export interface TimelineEntry {
  icon: 'check' | 'truck';
  title: string;
  sub: string;
}

export function TimelineList({ items }: { items: TimelineEntry[] }) {
  const { colors } = useApp();
  return (
    <View>
      {items.map((e, i) => (
        <View key={`${e.title}|${i}`} style={styles.timelineRow}>
          {i < items.length - 1 ? (
            <View
              style={[
                styles.timelineLine,
                { backgroundColor: colors.green200 },
              ]}
            />
          ) : null}
          <View
            style={[styles.timelineIc, { backgroundColor: colors.green }]}
          >
            {e.icon === 'check' ? (
              <Check size={16} color={colors.white} strokeWidth={2.4} />
            ) : (
              <Truck size={16} color={colors.white} strokeWidth={2} />
            )}
          </View>
          <View style={styles.timelineBody}>
            <Text style={[styles.timelineTitle, { color: colors.ink }]}>
              {e.title}
            </Text>
            <Text style={[styles.timelineSub, { color: colors.muted }]}>
              {e.sub}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ---------- Hen logo mark (spec §5 — custom chicken, NOT a Lucide icon) ----------

export function HenIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 3v3" />
      <Path d="M12 6c-3.5 0-6 2.8-6 6.2 0 1.2.3 2.3.9 3.3L5 21l3.4-1.4A7.4 7.4 0 0 0 12 20.5c3.9 0 6-3 6-6.8 0-1-.2-2-.6-2.9.8-.4 1.6-1.3 1.6-2.8-1 .2-1.9 0-2.6-.6A5.9 5.9 0 0 0 12 6Z" />
    </Svg>
  );
}

// ---------- Switch (css .switch) ----------

export function SwitchVisual({ on }: { on: boolean }) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.switch,
        {
          backgroundColor: on ? colors.green : colors.grayBg,
          borderColor: on ? colors.green : colors.line,
        },
      ]}
    >
      <View
        style={[
          styles.switchKnob,
          on ? styles.switchKnobOn : styles.switchKnobOff,
          { backgroundColor: colors.white },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 9,
  } as ViewStyle,
  pillText: {
    fontSize: fontSize.pill,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.03,
    textTransform: 'uppercase',
  } as TextStyle,
  btn: {
    borderRadius: radius.button,
    minHeight: 44,
    paddingVertical: spacing.buttonPaddingY,
    paddingHorizontal: spacing.buttonPaddingX,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  } as ViewStyle,
  btnText: {
    fontSize: fontSize.button,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  btnOutline: {
    borderWidth: 1.5,
  } as ViewStyle,
  addBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radius.button,
    paddingVertical: 13,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  } as ViewStyle,
  addBtnText: {
    fontSize: 14.5,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  field: {
    marginBottom: spacing.fieldMarginBottom,
  } as ViewStyle,
  fieldLabel: {
    fontSize: 13,
    fontFamily: fontFamily.extraBold,
    marginBottom: spacing.labelMarginBottom,
  } as TextStyle,
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.input,
    minHeight: 44,
  } as ViewStyle,
  input: {
    flex: 1,
    paddingVertical: spacing.inputPaddingY,
    paddingHorizontal: spacing.inputPaddingX,
    fontSize: fontSize.input,
    fontFamily: fontFamily.semiBold,
  } as TextStyle,
  inputMultiline: {
    minHeight: 78,
    textAlignVertical: 'top',
  } as TextStyle,
  errorBox: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  } as ViewStyle,
  errorText: {
    fontSize: 13,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  pageTitle: {
    fontSize: fontSize.pageTitle,
    fontFamily: fontFamily.extraBold,
    letterSpacing: -0.01,
    marginTop: 2,
    marginBottom: 4,
  } as TextStyle,
  pageSub: {
    fontSize: 13.5,
    fontFamily: fontFamily.semiBold,
    marginBottom: spacing.lg,
  } as TextStyle,
  sectionLabel: {
    fontSize: fontSize.sectionLabel,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.06,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 10,
  } as TextStyle,
  detailCard: {
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    marginBottom: 14,
  } as ViewStyle,
  detailTitle: {
    fontSize: 13,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.05,
    textTransform: 'uppercase',
    marginBottom: 12,
  } as TextStyle,
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
    fontSize: 13.5,
  } as ViewStyle,
  kvLabel: {
    fontSize: 13.5,
    fontFamily: fontFamily.bold,
    flexShrink: 1,
  } as TextStyle,
  kvValue: {
    fontSize: 13.5,
    fontFamily: fontFamily.extraBold,
    textAlign: 'right',
    flexShrink: 1,
  } as TextStyle,
  listCard: {
    borderWidth: 1,
    borderRadius: radius.card,
    overflow: 'hidden',
  } as ViewStyle,
  rowItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  } as ViewStyle,
  rowMain: {
    flex: 1,
    minWidth: 0,
  } as ViewStyle,
  rowTitle: {
    fontSize: 14.5,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  rowSub: {
    fontSize: 12.5,
    fontFamily: fontFamily.semiBold,
    marginTop: 2,
    lineHeight: 12.5 * 1.45,
  } as TextStyle,
  rowChev: {
    marginTop: 4,
    flexShrink: 0,
  } as ViewStyle,
  emptyNote: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    textAlign: 'center',
    fontSize: 13.5,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  historyRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
  } as ViewStyle,
  historyRowLast: {
    borderBottomWidth: 0,
  } as ViewStyle,
  historyDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 5,
    flexShrink: 0,
  } as ViewStyle,
  historyBody: {
    flex: 1,
  } as ViewStyle,
  historyTitle: {
    fontSize: 13,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  historySub: {
    fontSize: 12.5,
    fontFamily: fontFamily.semiBold,
  } as TextStyle,
  seg: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  } as ViewStyle,
  segBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingVertical: 9,
    paddingHorizontal: 4,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  segText: {
    fontSize: 12.5,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  optionList: {
    marginBottom: 2,
  } as ViewStyle,
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  } as ViewStyle,
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  } as ViewStyle,
  optionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  timelineRow: {
    position: 'relative',
    paddingLeft: 46,
    paddingBottom: 18,
  } as ViewStyle,
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 32,
    bottom: 0,
    width: 2,
  } as ViewStyle,
  timelineIc: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  timelineBody: {
    flex: 1,
  } as ViewStyle,
  timelineTitle: {
    fontSize: 14,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  timelineSub: {
    fontSize: 12.5,
    fontFamily: fontFamily.semiBold,
    lineHeight: 12.5 * 1.5,
  } as TextStyle,
  switch: {
    width: 52,
    height: 30,
    borderRadius: 99,
    borderWidth: 1,
    flexShrink: 0,
  } as ViewStyle,
  switchKnob: {
    position: 'absolute',
    top: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
  } as ViewStyle,
  switchKnobOn: {
    left: 25,
  } as ViewStyle,
  switchKnobOff: {
    left: 3,
  } as ViewStyle,
});

// Chain timeline — CSS `.timeline`: connecting line, 32px round icon per
// step (green when done, gray #9ca3af when not done, red #dc2626 + alert
// icon when `alert` — the recalled step in modules/consumer.js), bold title
// and muted detail. The HTML uses the Check glyph (stroke 2.4) in every
// step icon.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';

export interface TimelineStep {
  stage: string;
  title: string;
  detail: string;
  when?: string;
  done: boolean;
  /** Red step (e.g. the recalled step in the consumer trace). */
  alert?: boolean;
}

export interface TimelineProps {
  steps: TimelineStep[];
}

export function Timeline({ steps }: TimelineProps) {
  const { colors } = useApp();

  return (
    <View style={styles.list}>
      <View style={[styles.line, { backgroundColor: colors.green200 }]} />
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const iconBg = step.alert ? '#dc2626' : step.done ? colors.green : '#9ca3af';
        return (
          <View key={step.stage} style={[styles.item, isLast ? styles.lastItem : null]}>
            <View style={[styles.icon, { backgroundColor: iconBg }]}>
              <Icon name={step.alert ? 'alert' : 'check'} size={16} color="#ffffff" strokeWidth={step.alert ? 2.2 : 2.4} />
            </View>
            <Text style={[styles.title, { color: colors.ink }]}>{step.title}</Text>
            <Text style={[styles.detail, { color: colors.muted }]}>{step.detail}</Text>
            {step.when ? <Text style={[styles.detail, { color: colors.muted }]}>{step.when}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: 15,
    top: 10,
    bottom: 10,
    width: 2,
  },
  item: {
    position: 'relative',
    paddingLeft: 46,
    paddingBottom: 18,
  },
  lastItem: {
    paddingBottom: 2,
  },
  icon: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: fontForWeight(800),
  },
  detail: {
    fontSize: 12.5,
    fontFamily: fontForWeight(600),
    lineHeight: 19,
  },
});

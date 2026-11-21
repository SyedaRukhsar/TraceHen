// Consumer Notifications — the bell list (modules/consumer.html
// #consumer-view-notifications + modules/consumer.js renderNotifs).
// The list is the signed-in consumer's own notifications; for the demo
// consumer it also carries the three seeded notifications from the shared
// dataset. Opening the screen marks everything read, as the HTML bell does.

import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import { ConsumerBottomNav, ConsumerHeader, markConsumerSeedsRead } from './ConsumerChrome';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import type { ThemeColors } from '../../theme/colors';
import type { AppNotification } from '../../types/models';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerNotifications'>;

export default function ConsumerNotificationsScreen({ navigation }: Props) {
  const { colors, currentUser, data, scopeKey, notifications, markNotificationsRead } = useApp();
  const styles = makeStyles(colors);

  useEffect(() => {
    markNotificationsRead();
    markConsumerSeedsRead();
  }, [markNotificationsRead]);

  const isDemoConsumer = scopeKey === '__demo__' && currentUser?.role === 'consumer';
  const list: AppNotification[] = isDemoConsumer
    ? [...notifications, ...data.notifications.consumer]
    : notifications;

  return (
    <View style={styles.screen}>
      <ConsumerHeader subtitle="Notifications" showBack onBack={() => navigation.goBack()} />
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.pageTitle}>Notifications</Text>
        <View style={styles.listCard}>
          {list.map((n, i) => (
            <View key={`${n.t}-${i}`} style={styles.row}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      n.c === 'red' ? colors.red : n.c === 'amber' ? colors.amber : colors.green,
                  },
                ]}
              />
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{n.t}</Text>
                <Text style={styles.rowSub}>{n.s}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <ConsumerBottomNav active="scan" />
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
    body: {
      flex: 1,
    },
    bodyContent: {
      paddingHorizontal: spacing.screenPaddingX,
      paddingTop: spacing.screenPaddingTop,
      paddingBottom: spacing.screenPaddingBottom,
    },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
      marginBottom: spacing.lg,
    },
    listCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      paddingVertical: 6,
      paddingHorizontal: 15,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.gap,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 5,
    },
    rowText: {
      flex: 1,
    },
    rowTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 14,
      color: colors.ink,
    },
    rowSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12.5,
      lineHeight: 19,
      color: colors.muted,
      marginTop: 2,
    },
  });
}

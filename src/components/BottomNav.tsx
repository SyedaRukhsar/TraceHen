// Bottom navigation — CSS `.bottom-nav`. Tabs are taken from the locked HTML
// (each module's `.bottom-nav`), NOT from the task brief, which listed the
// wrong icons/tabs for Admin, Vet, Plant and Shop:
//  - Admin: Home, Applications (FileCheck, badge), Organizations
//    (organizations glyph, icons.txt #27), Settings — NO Batches tab; Batches
//    is reached from a dashboard card in the HTML.
//  - Vet Inspections uses the Search glyph; Plant Lots uses List;
//    Shop Stock uses Grid; Plant Packs and Mart Stock use Package.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../services/store';
import type { Role } from '../types/models';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export interface BottomNavTab {
  key: string;
  label: string;
  icon: IconName;
  /** Only the Admin Applications tab carries a badge in the HTML. */
  badge?: boolean;
}

const TABS: Record<Role, BottomNavTab[]> = {
  admin: [
    { key: 'home', label: 'Home', icon: 'house' },
    { key: 'applications', label: 'Applications', icon: 'fileCheck', badge: true },
    { key: 'organizations', label: 'Organizations', icon: 'organization' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ],
  farm: [
    { key: 'home', label: 'Home', icon: 'house' },
    { key: 'batches', label: 'Batches', icon: 'package' },
    { key: 'dispatch', label: 'Dispatch', icon: 'truck' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ],
  vet: [
    { key: 'home', label: 'Home', icon: 'house' },
    { key: 'inspections', label: 'Inspections', icon: 'search' },
    { key: 'certificates', label: 'Certificates', icon: 'award' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ],
  plant: [
    { key: 'home', label: 'Home', icon: 'house' },
    { key: 'lots', label: 'Lots', icon: 'list' },
    { key: 'packs', label: 'Packs', icon: 'package' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ],
  shop: [
    { key: 'home', label: 'Home', icon: 'house' },
    { key: 'deliveries', label: 'Deliveries', icon: 'truck' },
    { key: 'stock', label: 'Stock', icon: 'grid' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ],
  mart: [
    { key: 'home', label: 'Home', icon: 'house' },
    { key: 'shipments', label: 'Shipments', icon: 'truck' },
    { key: 'stock', label: 'Stock', icon: 'package' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ],
  consumer: [
    { key: 'scan', label: 'Scan', icon: 'scan' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ],
};

export interface BottomNavProps {
  role: Role;
  active: string;
  onTab: (tab: string) => void;
  unreadCount?: number;
}

export function BottomNav({ role, active, onTab, unreadCount = 0 }: BottomNavProps) {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const tabs = TABS[role];

  return (
    <View
      style={[
        styles.nav,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
          paddingBottom: 6 + insets.bottom,
        },
      ]}
    >
      {tabs.map(tab => {
        const isActive = tab.key === active;
        const color = isActive ? colors.green700 : colors.muted;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTab(tab.key)}
            style={[styles.tab, isActive ? { backgroundColor: colors.green50 } : null]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Icon name={tab.icon} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
            {tab.badge && unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : String(unreadCount)}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexShrink: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    paddingTop: 7,
    paddingBottom: 5,
    paddingHorizontal: 2,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    minHeight: 52,
    position: 'relative',
  },
  label: {
    fontSize: 11,
    fontFamily: fontForWeight(800),
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: '50%',
    marginRight: -20,
    backgroundColor: '#dc2626',
    minWidth: 18,
    height: 18,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: fontForWeight(800),
  },
});

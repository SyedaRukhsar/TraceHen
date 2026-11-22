// Session storage wrappers.
// Auth token → expo-secure-store (encrypted, backed by the Android
// Keystore). User profile + settings → AsyncStorage (non-sensitive only).
// Screens never touch SecureStore/AsyncStorage directly.

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { AppUser } from '../types/models';

const TOKEN_KEY = 'pk.edu.uaf.tracehen.auth.token';
const USER_KEY = 'tracehen.user';
const SETTINGS_KEY = 'tracehen.settings';

export interface SessionSettings {
  notificationsEnabled: boolean;
  autoSyncEnabled: boolean;
}

export const DEFAULT_SETTINGS: SessionSettings = {
  notificationsEnabled: true,
  autoSyncEnabled: true,
};

export async function saveSession(user: AppUser): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, `demo-token-${user.name}`);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** The stored auth token, or null when signed out. Used by the API layer. */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AppUser | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined);
  await AsyncStorage.removeItem(USER_KEY);
}

export async function getSettings(): Promise<SessionSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as SessionSettings) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: SessionSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

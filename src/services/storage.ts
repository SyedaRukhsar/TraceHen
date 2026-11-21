// Session storage wrappers.
// Auth token → react-native-keychain (encrypted, backed by the Android
// Keystore). User profile + settings → AsyncStorage (non-sensitive only).
// Screens never touch Keychain/AsyncStorage directly.

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import type { AppUser } from '../types/models';

const TOKEN_SERVICE = 'pk.edu.uaf.tracehen.auth';
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
  await Keychain.setGenericPassword(user.name, `demo-token-${user.name}`, {
    service: TOKEN_SERVICE,
  });
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** The stored auth token, or null when signed out. Used by the API layer. */
export async function getAuthToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_SERVICE,
    });
    return credentials ? credentials.password : null;
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
  await Keychain.resetGenericPassword({ service: TOKEN_SERVICE }).catch(
    () => undefined,
  );
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

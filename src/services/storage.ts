import AsyncStorage from '@react-native-async-storage/async-storage';

/** Thin, typed wrapper around AsyncStorage with JSON (de)serialisation. */

const PREFIX = 'vvshold:';

export async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`storage.loadJson(${key}) failed`, err);
    return fallback;
  }
}

export async function saveJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`storage.saveJson(${key}) failed`, err);
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.warn(`storage.removeKey(${key}) failed`, err);
  }
}

export const StorageKeys = {
  session: 'session',
  members: 'members',
  jobs: 'jobs',
  threads: 'threads',
  messages: 'messages',
  briefs: 'briefs',
  seeded: 'seeded',
} as const;

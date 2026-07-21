import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { app } from './config';

/**
 * Cross-platform push messaging built on Firebase Cloud Messaging.
 *
 * - On web, FCM tokens come from `firebase/messaging` (requires a service
 *   worker + VAPID key).
 * - On native (iOS/Android), Expo's notification service brokers FCM/APNs and
 *   issues a device push token. To deliver via FCM directly, configure your
 *   FCM server key / google-services.json in EAS and build a dev/standalone app.
 */

const VAPID_KEY = process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Request notification permission from the OS / browser. */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Register the device for push notifications and return a token.
 * Returns null when running on a simulator or when permission is denied.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return getWebFcmToken();
  }

  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device.');
    return null;
  }

  const granted = await requestNotificationPermission();
  if (!granted) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const token = await Notifications.getDevicePushTokenAsync();
  return token.data;
}

/** Web-only: retrieve an FCM registration token via firebase/messaging. */
async function getWebFcmToken(): Promise<string | null> {
  try {
    const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
    if (!(await isSupported())) return null;
    const messaging = getMessaging(app);
    return await getToken(messaging, { vapidKey: VAPID_KEY });
  } catch (err) {
    console.warn('Failed to obtain web FCM token', err);
    return null;
  }
}

/** Subscribe to foreground notifications. Returns an unsubscribe function. */
export function onForegroundMessage(callback: (notification: Notifications.Notification) => void) {
  const sub = Notifications.addNotificationReceivedListener(callback);
  return () => sub.remove();
}

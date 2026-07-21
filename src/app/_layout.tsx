import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import {
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/global.css';

import { ToastProvider } from '@/components/ui';
import { updateUserProfile } from '@/lib/firebase/repo';
import { registerForPushNotifications } from '@/lib/firebase/messaging';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });
  const initAuth = useAuthStore((s) => s.init);
  const authInitializing = useAuthStore((s) => s.initializing);
  const uid = useAuthStore((s) => s.user?.uid);

  useEffect(() => initAuth(), [initAuth]);

  // Best-effort: register this device for push once signed in, and save the
  // token on the profile so a future send can target it. Sending itself
  // still needs the Client's push credentials (§6) — this only wires the
  // receiving half, which doesn't depend on that.
  useEffect(() => {
    if (!uid) return;
    registerForPushNotifications()
      .then((token) => {
        if (token) updateUserProfile(uid, { pushToken: token });
      })
      .catch(() => {});
  }, [uid]);

  useEffect(() => {
    if (loaded && !authInitializing) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, authInitializing]);

  if (!loaded || authInitializing) return <View style={{ flex: 1, backgroundColor: colors.bg1 }} />;

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg1 },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="tracking/[id]" />
          <Stack.Screen name="notifs" />
          <Stack.Screen name="cotizar" />
          <Stack.Screen name="buscar" />
          <Stack.Screen name="direcciones" />
          <Stack.Screen name="pagos" />
          <Stack.Screen name="facturas" />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

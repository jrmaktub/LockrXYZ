import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';

// RootLayout blocks rendering until Firebase auth has resolved, so by the
// time this mounts `user` reflects the real signed-in state.
export default function Index() {
  const user = useAuthStore((s) => s.user);
  return <Redirect href={user ? '/(tabs)/home' : '/(auth)/login'} />;
}

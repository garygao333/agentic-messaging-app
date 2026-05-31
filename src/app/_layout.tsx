import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/authStore';
import { useAgentsStore } from '@/store/agentsStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const authHydrated = useAuthStore((s) => s.hydrated);
  const agentsHydrated = useAgentsStore((s) => s.hydrated);
  const session = useAuthStore((s) => s.session);
  const segments = useSegments();
  const router = useRouter();

  const ready = authHydrated && agentsHydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const seg = segments as string[];
    const inApp = seg[0] === '(app)';
    const atWelcome = seg.length === 0; // index route
    if (!session && inApp) {
      router.replace('/');
    } else if (session && atWelcome) {
      router.replace('/(app)/agents');
    }
  }, [ready, session, segments, router]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

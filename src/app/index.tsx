import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { api } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { openMessages } from '@/lib/messageLinks';
import { colors, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const startVerification = useAuthStore((s) => s.startVerification);
  const signInDemo = useAuthStore((s) => s.signInDemo);
  const [loading, setLoading] = useState(false);

  async function continueWithMessages() {
    setLoading(true);
    try {
      const { code, messageBody } = await api.authMessagesStart();
      startVerification(code);
      await openMessages(messageBody); // opens Messages prefilled with "LOGIN <code>"
      router.push({ pathname: '/verify', params: { code } });
    } finally {
      setLoading(false);
    }
  }

  function tryDemo() {
    signInDemo();
    router.replace('/(app)/agents');
  }

  return (
    <Screen
      scroll={false}
      contentStyle={styles.content}
      footer={
        <>
          <Button
            title="Continue with Messages"
            onPress={continueWithMessages}
            loading={loading}
          />
          <Button title="Try Demo Mode" variant="ghost" onPress={tryDemo} />
        </>
      }
    >
      <View style={styles.hero}>
        <Logo size={56} showWordmark={false} />
        <Text style={styles.name}>Agentic Messaging</Text>
        <Text style={styles.tagline}>
          Build and test Apple Messages for Business agents.
        </Text>
      </View>
      <Text style={styles.note}>
        Most setup starts inside Apple Messages for Business. Continue there to verify, or
        explore the full app in Demo Mode.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: spacing.xl },
  hero: { alignItems: 'center', gap: spacing.md },
  name: { ...typography.title, color: colors.navy, marginTop: spacing.sm },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  note: {
    ...typography.footnote,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});

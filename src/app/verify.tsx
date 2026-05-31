import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { api } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { colors, radius, spacing, typography } from '@/theme';

export default function VerifyScreen() {
  const router = useRouter();
  const { code: sentCode } = useLocalSearchParams<{ code?: string }>();
  const pendingCode = useAuthStore((s) => s.pendingCode);
  const completeSignIn = useAuthStore((s) => s.completeSignIn);
  const expected = (sentCode as string) ?? pendingCode ?? '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function verify() {
    setLoading(true);
    try {
      await api.authMessagesVerify('messages-user', code || expected);
      completeSignIn('messages-user');
      router.replace('/(app)/agents');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      footer={
        <>
          <Button title="Verify & Continue" onPress={verify} loading={loading} />
          <Button
            title="Simulate verification"
            variant="ghost"
            onPress={() => {
              setCode(expected);
              verify();
            }}
          />
        </>
      }
    >
      <ScreenHeader
        title="Check Messages"
        subtitle="We sent a code to the Agentic Messaging business account."
        showBack
      />
      <View style={styles.codeBox}>
        <Text style={styles.codeLabel}>Your code</Text>
        <Text style={styles.code}>{expected || '——————'}</Text>
        <Text style={styles.hint}>
          In the real flow, you’d send this from Messages to verify it’s you. For now, enter it
          below or simulate verification.
        </Text>
      </View>
      <Input
        label="Verification code"
        value={code}
        onChangeText={setCode}
        placeholder={expected || '123456'}
        keyboardType="number-pad"
        maxLength={6}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  codeBox: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  codeLabel: { ...typography.footnote, color: colors.textSecondary },
  code: { ...typography.largeTitle, letterSpacing: 8, color: colors.navy },
  hint: { ...typography.footnote, color: colors.textSecondary, textAlign: 'center' },
});

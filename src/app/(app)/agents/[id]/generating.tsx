import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { LogoMark } from '@/components/Logo';
import { ProgressSteps, type StepState } from '@/components/ProgressSteps';
import { api } from '@/services';
import { GENERATION_STEPS } from '@/lib/generate';
import { colors, spacing, typography } from '@/theme';

export default function GeneratingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [active, setActive] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    // Advance the visible checklist (~600ms/step) while the mock generate runs.
    const timers = GENERATION_STEPS.map((_, i) =>
      setTimeout(() => setActive(i + 1), (i + 1) * 600),
    );

    let cancelled = false;
    (async () => {
      const [agent] = await Promise.all([
        api.generateAgent(id),
        new Promise((r) => setTimeout(r, GENERATION_STEPS.length * 600 + 300)),
      ]);
      if (cancelled || done.current) return;
      done.current = true;
      router.replace(`/(app)/agents/${agent.id}/preview`);
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [id, router]);

  const steps = GENERATION_STEPS.map((label, i): { label: string; state: StepState } => ({
    label,
    state: i < active ? 'done' : i === active ? 'active' : 'pending',
  }));

  return (
    <Screen scroll={false} contentStyle={styles.content}>
      <View style={styles.hero}>
        <LogoMark size={48} />
        <Text style={styles.title}>Generating your Messages for Business agent…</Text>
      </View>
      <ProgressSteps steps={steps} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: spacing.xxl },
  hero: { alignItems: 'center', gap: spacing.lg },
  title: { ...typography.title2, color: colors.navy, textAlign: 'center' },
});

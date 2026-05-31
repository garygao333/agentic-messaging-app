import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export type StepState = 'pending' | 'active' | 'done';

/** Vertical checklist of steps; used on Generating and Review screens. */
export function ProgressSteps({
  steps,
}: {
  steps: { label: string; state: StepState }[];
}) {
  return (
    <View style={styles.wrap}>
      {steps.map((s) => (
        <View key={s.label} style={styles.row}>
          <StepIcon state={s.state} />
          <Text
            style={[
              styles.label,
              s.state === 'pending' ? styles.pending : null,
              s.state === 'done' ? styles.done : null,
            ]}
          >
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function StepIcon({ state }: { state: StepState }) {
  if (state === 'active') {
    return <ActivityIndicator size="small" color={colors.blue} style={styles.icon} />;
  }
  if (state === 'done') {
    return (
      <View style={[styles.dot, styles.dotDone]}>
        <Text style={styles.check}>✓</Text>
      </View>
    );
  }
  return <View style={[styles.dot, styles.dotPending]} />;
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { width: 22, height: 22 },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  dotPending: { borderWidth: 2, borderColor: colors.cardBorder },
  dotDone: { backgroundColor: colors.green },
  check: { color: colors.white, fontSize: 13, fontWeight: '700' },
  label: { ...typography.body, color: colors.text },
  pending: { color: colors.textTertiary },
  done: { color: colors.textSecondary },
});

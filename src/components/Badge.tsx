import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import type { AgentStatus, ConversationStatus, TestUserStatus } from '@/types/models';

type Tone = { bg: string; fg: string; dot: string };

const NEUTRAL: Tone = { bg: colors.graySoft, fg: colors.textSecondary, dot: colors.textTertiary };

const STATUS_TONES: Record<string, Tone> = {
  // Agent
  Draft: NEUTRAL,
  Generating: { bg: colors.blueSoft, fg: colors.blue, dot: colors.blue },
  'Test Mode': { bg: colors.amberSoft, fg: colors.amber, dot: colors.amber },
  Deployed: { bg: colors.greenSoft, fg: colors.green, dot: colors.green },
  // Conversation
  Open: { bg: colors.blueSoft, fg: colors.blue, dot: colors.blue },
  'Needs Human': { bg: colors.amberSoft, fg: colors.amber, dot: colors.amber },
  Resolved: { bg: colors.greenSoft, fg: colors.green, dot: colors.green },
  // Test user
  Invited: NEUTRAL,
  Active: { bg: colors.greenSoft, fg: colors.green, dot: colors.green },
};

export function Badge({
  label,
  dot = true,
}: {
  label: AgentStatus | ConversationStatus | TestUserStatus | string;
  dot?: boolean;
}) {
  const tone = STATUS_TONES[label] ?? NEUTRAL;
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      {dot ? <View style={[styles.dot, { backgroundColor: tone.dot }]} /> : null}
      <Text style={[styles.text, { color: tone.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { ...typography.caption, fontWeight: '600' },
});

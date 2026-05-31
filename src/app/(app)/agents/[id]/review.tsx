import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/Button';
import { ProgressSteps, type StepState } from '@/components/ProgressSteps';
import { LogoMark } from '@/components/Logo';
import { useAgentsStore, selectAgent } from '@/store/agentsStore';
import { api } from '@/services';
import { testAgentBody, openMessages } from '@/lib/messageLinks';
import { colors, radius, spacing, typography } from '@/theme';

export default function ReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const agent = useAgentsStore(selectAgent(id));
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  if (!agent) {
    return (
      <Screen>
        <ScreenHeader title="Review" showBack />
        <Text style={styles.missing}>Agent not found.</Text>
      </Screen>
    );
  }

  const checklist: { label: string; state: StepState }[] = [
    { label: 'Company profile created', state: 'done' },
    { label: 'Welcome flow generated', state: 'done' },
    { label: 'Guardrails configured', state: agent.guardrails ? 'done' : 'pending' },
    { label: 'Human handoff configured', state: agent.handoffDestination ? 'done' : 'pending' },
    { label: 'Test users added', state: agent.testUsers.length ? 'done' : 'pending' },
    { label: 'Apple Messages for Business review pending', state: 'pending' },
    { label: 'Production deployment pending', state: 'pending' },
  ];

  async function deploy() {
    setDeploying(true);
    try {
      await api.deployAgent(agent!.id);
      setDeployed(true);
    } finally {
      setDeploying(false);
    }
  }

  if (deployed) {
    return (
      <Screen scroll={false} contentStyle={styles.successWrap}>
        <View style={styles.successHero}>
          <View style={styles.successBadge}>
            <LogoMark size={40} variant="white" />
          </View>
          <Text style={styles.successTitle}>Agent deployed to test users.</Text>
          <Text style={styles.successBody}>
            {agent.name} is now in Test Mode. Test it internally through Apple Messages for
            Business. This is not a public Apple Messages for Business launch.
          </Text>
        </View>
        <View style={styles.successActions}>
          <Button title="Open in Messages" onPress={() => openMessages(testAgentBody(agent.id))} />
          <Button
            title="Manage Agent"
            variant="secondary"
            onPress={() => router.replace(`/(app)/agents/${agent.id}/manage`)}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      footer={<Button title="Deploy to Test Users" onPress={deploy} loading={deploying} />}
    >
      <ScreenHeader title="Review" subtitle={agent.name} showBack />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Deployment checklist</Text>
        <ProgressSteps steps={checklist} />
      </View>
      <Text style={styles.note}>
        Deploying makes this agent available to your test users only — it does not submit it for
        public Apple Messages for Business launch.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { ...typography.body, color: colors.textSecondary },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
  },
  cardTitle: { ...typography.headline, color: colors.navy },
  note: { ...typography.footnote, color: colors.textSecondary },
  successWrap: { flex: 1, justifyContent: 'center', gap: spacing.xxl },
  successHero: { alignItems: 'center', gap: spacing.md },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { ...typography.title2, color: colors.navy, textAlign: 'center' },
  successBody: { ...typography.subhead, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.md },
  successActions: { gap: spacing.sm },
});

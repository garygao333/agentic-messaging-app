import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Input } from '@/components/Input';
import { ChipSelect } from '@/components/Select';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useAgentsStore, selectAgent } from '@/store/agentsStore';
import { api } from '@/services';
import { INTEGRATIONS, type Integration } from '@/types/models';
import { colors, radius, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const agent = useAgentsStore(selectAgent(id));

  const [name, setName] = useState(agent?.name ?? '');
  const [prompt, setPrompt] = useState(agent?.prompt ?? '');
  const [guardrails, setGuardrails] = useState(agent?.guardrails ?? '');
  const [handoff, setHandoff] = useState(agent?.handoffDestination ?? '');
  const [integrations, setIntegrations] = useState<Integration[]>(agent?.integrations ?? ['None']);
  const [saving, setSaving] = useState(false);

  if (!agent) {
    return (
      <Screen>
        <ScreenHeader title="Settings" showBack />
        <Text style={styles.missing}>Agent not found.</Text>
      </Screen>
    );
  }

  async function save() {
    setSaving(true);
    try {
      await api.updateAgent(agent!.id, {
        name,
        prompt,
        guardrails,
        handoffDestination: handoff,
        integrations,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen footer={<Button title="Save Changes" onPress={save} loading={saving} />}>
      <ScreenHeader title="Settings" subtitle={agent.name} showBack />

      <Input label="Agent name" value={name} onChangeText={setName} />
      <Input label="Prompt" value={prompt} onChangeText={setPrompt} multiline style={styles.tall} />
      <Input label="Guardrails" value={guardrails} onChangeText={setGuardrails} multiline style={styles.tall} />
      <Input
        label="Human handoff destination"
        value={handoff}
        onChangeText={setHandoff}
        autoCapitalize="none"
      />
      <ChipSelect
        label="Integrations"
        options={[...INTEGRATIONS]}
        value={integrations}
        onChange={(v) => setIntegrations(v as Integration[])}
        multi
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Users</Text>
        {agent.testUsers.length === 0 ? (
          <Text style={styles.empty}>No test users yet.</Text>
        ) : (
          agent.testUsers.map((u) => (
            <View key={u.id} style={styles.userRow}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{u.name}</Text>
                <Text style={styles.userHandle}>{u.phoneOrAppleId}</Text>
              </View>
              <Badge label={u.status} />
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { ...typography.body, color: colors.textSecondary },
  tall: { minHeight: 110, textAlignVertical: 'top' },
  section: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
  },
  sectionTitle: { ...typography.headline, color: colors.navy },
  empty: { ...typography.subhead, color: colors.textSecondary },
  userRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userInfo: { gap: 2 },
  userName: { ...typography.body, color: colors.text },
  userHandle: { ...typography.footnote, color: colors.textSecondary },
});

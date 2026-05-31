import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ListGroup, ListRow } from '@/components/ListRow';
import { useAgentsStore, selectAgent, selectConversationsFor } from '@/store/agentsStore';
import { api } from '@/services';
import { redeployBody, testAgentBody, openMessages } from '@/lib/messageLinks';
import { timeAgo } from '@/lib/format';
import { colors, spacing, typography } from '@/theme';

export default function ManageScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const agent = useAgentsStore(selectAgent(id));
  const conversations = useAgentsStore(selectConversationsFor(id));
  const [redeploying, setRedeploying] = useState(false);

  if (!agent) {
    return (
      <Screen>
        <ScreenHeader title="Manage" showBack />
        <Text style={styles.missing}>Agent not found.</Text>
      </Screen>
    );
  }

  const goSettings = () => router.push(`/(app)/agents/${agent.id}/settings`);

  async function redeploy() {
    setRedeploying(true);
    try {
      const updated = await api.redeployAgent(agent!.id);
      await openMessages(redeployBody(agent!.id));
      Alert.alert('Redeployed', `Updated ${timeAgo(updated.lastDeployedAt ?? new Date().toISOString())} ago.`);
    } finally {
      setRedeploying(false);
    }
  }

  return (
    <Screen
      footer={
        <>
          <Button title="Redeploy Agent" onPress={redeploy} loading={redeploying} />
          <Button
            title="Open Test Conversation"
            variant="ghost"
            onPress={() => openMessages(testAgentBody(agent.id))}
          />
        </>
      }
    >
      <ScreenHeader title="Manage" subtitle={agent.name} showBack right={<Badge label={agent.status} />} />

      <ListGroup>
        <ListRow
          first
          icon="💬"
          label="Conversations"
          value={String(conversations.length)}
          onPress={() => router.push(`/(app)/agents/${agent.id}/conversations`)}
        />
        <ListRow icon="⚙️" label="Settings" onPress={goSettings} />
        <ListRow icon="📝" label="Prompt" onPress={goSettings} />
        <ListRow icon="🛡️" label="Guardrails" onPress={goSettings} />
        <ListRow icon="🤝" label="Handoff" value={agent.handoffDestination || undefined} onPress={goSettings} />
        <ListRow icon="👥" label="Test Users" value={String(agent.testUsers.length)} onPress={goSettings} />
        <ListRow
          icon="🔌"
          label="Integrations"
          value={agent.integrations.join(', ')}
          onPress={goSettings}
        />
        <ListRow
          last
          icon="🚀"
          label="Deployment Status"
          value={agent.lastDeployedAt ? `${timeAgo(agent.lastDeployedAt)} ago` : 'Not deployed'}
          showChevron={false}
        />
      </ListGroup>

      <View style={styles.metaCard}>
        <Text style={styles.metaText}>Created {timeAgo(agent.createdAt)} ago</Text>
        <Text style={styles.metaText}>Updated {timeAgo(agent.updatedAt)} ago</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { ...typography.body, color: colors.textSecondary },
  metaCard: { paddingHorizontal: spacing.xs, gap: 2 },
  metaText: { ...typography.footnote, color: colors.textTertiary },
});

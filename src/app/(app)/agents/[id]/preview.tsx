import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ChatBubble, SuggestedActions } from '@/components/ChatBubble';
import { useAgentsStore, selectAgent } from '@/store/agentsStore';
import { api } from '@/services';
import { previewFor } from '@/lib/generate';
import { testAgentBody, openMessages } from '@/lib/messageLinks';
import { colors, radius, spacing, typography } from '@/theme';

export default function PreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const agent = useAgentsStore(selectAgent(id));
  const [editing, setEditing] = useState(false);
  const [prompt, setPrompt] = useState(agent?.prompt ?? '');
  const [saving, setSaving] = useState(false);

  if (!agent) {
    return (
      <Screen>
        <ScreenHeader title="Preview" showBack />
        <Text style={styles.missing}>Agent not found.</Text>
      </Screen>
    );
  }

  const preview = previewFor(agent.businessType);

  async function savePrompt() {
    setSaving(true);
    try {
      await api.updateAgent(agent!.id, { prompt });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      footer={<Button title="Continue to Review" onPress={() => router.push(`/(app)/agents/${agent.id}/review`)} />}
    >
      <ScreenHeader title="Preview" subtitle={agent.name} showBack />

      <View style={styles.phone}>
        <View style={styles.phoneBar}>
          <Text style={styles.phoneTitle}>{agent.companyName || agent.name}</Text>
          <Text style={styles.phoneSub}>Apple Messages for Business</Text>
        </View>
        <View style={styles.thread}>
          <ChatBubble role="customer" text="Hi, I need help with an order." />
          <ChatBubble role="agent" text={preview.agent} />
          <SuggestedActions actions={preview.actions} />
        </View>
      </View>

      {editing ? (
        <View style={styles.editor}>
          <Input
            label="Agent prompt"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            style={styles.promptInput}
          />
          <View style={styles.editorRow}>
            <Button title="Cancel" variant="secondary" onPress={() => setEditing(false)} style={styles.flex} />
            <Button title="Save" onPress={savePrompt} loading={saving} style={styles.flex} />
          </View>
        </View>
      ) : (
        <View style={styles.actions}>
          <Button title="Edit Prompt" variant="secondary" onPress={() => { setPrompt(agent.prompt); setEditing(true); }} />
          <Button
            title="Open Test Conversation"
            variant="ghost"
            onPress={() => openMessages(testAgentBody(agent.id))}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { ...typography.body, color: colors.textSecondary },
  phone: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  phoneBar: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
    gap: 2,
  },
  phoneTitle: { ...typography.headline, color: colors.navy },
  phoneSub: { ...typography.caption, color: colors.textSecondary },
  thread: { padding: spacing.md, gap: 2 },
  actions: { gap: spacing.sm },
  editor: { gap: spacing.md },
  editorRow: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  promptInput: { minHeight: 120, textAlignVertical: 'top' },
});

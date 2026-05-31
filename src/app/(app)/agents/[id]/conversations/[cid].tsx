import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Badge } from '@/components/Badge';
import { ChatBubble } from '@/components/ChatBubble';
import { Button } from '@/components/Button';
import { useAgentsStore } from '@/store/agentsStore';
import { testAgentBody, openMessages } from '@/lib/messageLinks';
import { colors, spacing, typography } from '@/theme';

export default function ConversationDetailScreen() {
  const { id, cid } = useLocalSearchParams<{ id: string; cid: string }>();
  const conversation = useAgentsStore((s) => s.conversations.find((c) => c.id === cid));

  if (!conversation) {
    return (
      <Screen>
        <ScreenHeader title="Conversation" showBack />
        <Text style={styles.missing}>Conversation not found.</Text>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <Button
          title="Open in Messages"
          variant="ghost"
          onPress={() => openMessages(testAgentBody(id))}
        />
      }
    >
      <ScreenHeader
        title={conversation.customerName}
        showBack
        right={<Badge label={conversation.status} />}
      />
      <View style={styles.thread}>
        {conversation.messages.map((m) => (
          <ChatBubble key={m.id} role={m.role} text={m.text} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { ...typography.body, color: colors.textSecondary },
  thread: { gap: 2, paddingTop: spacing.sm },
});

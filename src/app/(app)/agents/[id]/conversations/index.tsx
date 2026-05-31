import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { useAgentsStore, selectConversationsFor, selectAgent } from '@/store/agentsStore';
import { timeAgo } from '@/lib/format';
import { colors, radius, spacing, typography } from '@/theme';

export default function ConversationsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const agent = useAgentsStore(selectAgent(id));
  const conversations = useAgentsStore(selectConversationsFor(id));
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) => c.customerName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  return (
    <Screen>
      <ScreenHeader title="Conversations" subtitle={agent?.name} showBack />

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search conversations"
        placeholderTextColor={colors.textTertiary}
        style={styles.search}
        autoCapitalize="none"
      />

      {filtered.length === 0 ? (
        <Text style={styles.empty}>No conversations yet.</Text>
      ) : (
        <View style={styles.list}>
          {filtered.map((c) => (
            <Card
              key={c.id}
              onPress={() => router.push(`/(app)/agents/${id}/conversations/${c.id}`)}
            >
              <View style={styles.rowTop}>
                <Text style={styles.name}>{c.customerName}</Text>
                <Text style={styles.time}>{timeAgo(c.timestamp)}</Text>
              </View>
              <Text style={styles.preview} numberOfLines={1}>
                {c.lastMessage}
              </Text>
              <View style={styles.badgeRow}>
                <Badge label={c.status} />
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    ...typography.body,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  list: { gap: spacing.md },
  empty: { ...typography.body, color: colors.textSecondary, paddingTop: spacing.lg },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.headline, color: colors.navy },
  time: { ...typography.footnote, color: colors.textTertiary },
  preview: { ...typography.subhead, color: colors.textSecondary, marginTop: 2 },
  badgeRow: { marginTop: spacing.sm },
});

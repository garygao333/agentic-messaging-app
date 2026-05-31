import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

/** iMessage-style bubble. `role` 'agent' = incoming gray (left), 'customer' = outgoing blue (right). */
export function ChatBubble({
  text,
  role,
}: {
  text: string;
  role: 'agent' | 'customer';
}) {
  const isCustomer = role === 'customer';
  return (
    <View style={[styles.row, isCustomer ? styles.rowRight : styles.rowLeft]}>
      <View
        style={[
          styles.bubble,
          isCustomer ? styles.customer : styles.agent,
        ]}
      >
        <Text style={[styles.text, isCustomer ? styles.textCustomer : styles.textAgent]}>
          {text}
        </Text>
      </View>
    </View>
  );
}

/** Tappable suggested-action chips shown under an agent message. */
export function SuggestedActions({
  actions,
  onPress,
}: {
  actions: string[];
  onPress?: (action: string) => void;
}) {
  return (
    <View style={styles.actions}>
      {actions.map((a) => (
        <Pressable key={a} style={styles.action} onPress={() => onPress?.(a)}>
          <Text style={styles.actionText}>{a}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', marginVertical: 3, flexDirection: 'row' },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '78%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  agent: { backgroundColor: colors.card, borderBottomLeftRadius: 5 },
  customer: { backgroundColor: colors.blue, borderBottomRightRadius: 5 },
  text: { ...typography.callout },
  textAgent: { color: colors.text },
  textCustomer: { color: colors.white },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm, justifyContent: 'flex-start' },
  action: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.blue,
    backgroundColor: colors.white,
  },
  actionText: { ...typography.subhead, color: colors.blue, fontWeight: '600' },
});

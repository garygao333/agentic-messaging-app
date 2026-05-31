import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

/** Grouped-list row with optional leading icon, value text, and chevron. */
export function ListRow({
  label,
  value,
  icon,
  right,
  onPress,
  showChevron = true,
  first = false,
  last = false,
}: {
  label: string;
  value?: string;
  icon?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        first ? styles.first : null,
        last ? styles.last : null,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rightWrap}>
        {value ? <Text style={styles.value} numberOfLines={1}>{value}</Text> : null}
        {right}
        {onPress && showChevron ? <Text style={styles.chevron}>›</Text> : null}
      </View>
    </Pressable>
  );
}

/** Container that visually groups ListRows into a single rounded card. */
export function ListGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.cardBorder,
    minHeight: 50,
  },
  first: { borderTopWidth: 0 },
  last: {},
  pressed: { backgroundColor: colors.graySoft },
  icon: { fontSize: 17, width: 24, textAlign: 'center' },
  label: { ...typography.body, color: colors.text, flex: 1 },
  rightWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, maxWidth: '55%' },
  value: { ...typography.subhead, color: colors.textSecondary, flexShrink: 1 },
  chevron: { fontSize: 22, color: colors.textTertiary, marginTop: -2 },
});

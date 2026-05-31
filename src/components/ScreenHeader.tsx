import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';

/** Large-title screen header with optional back chevron and right-side accessory. */
export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  right,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.back}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
      ) : null}
      <View style={styles.titleRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs, paddingBottom: spacing.md },
  back: { marginBottom: spacing.xs },
  backText: { ...typography.body, color: colors.blue },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  titleCol: { flex: 1, gap: 2 },
  title: { ...typography.largeTitle, color: colors.navy },
  subtitle: { ...typography.subhead, color: colors.textSecondary },
});

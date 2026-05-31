import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

/**
 * Chip-style selector. Single-select by default; pass `multi` for multi-select.
 * Controlled via `value` (string for single, string[] for multi).
 */
export function ChipSelect({
  label,
  options,
  value,
  onChange,
  multi = false,
}: {
  label?: string;
  options: string[];
  value: string | string[];
  onChange: (next: string | string[]) => void;
  multi?: boolean;
}) {
  const selected = (opt: string) =>
    multi ? (value as string[]).includes(opt) : value === opt;

  const toggle = (opt: string) => {
    if (multi) {
      const current = value as string[];
      onChange(
        current.includes(opt) ? current.filter((o) => o !== opt) : [...current, opt],
      );
    } else {
      onChange(opt);
    }
  };

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.chips}>
        {options.map((opt) => {
          const isOn = selected(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => toggle(opt)}
              style={[styles.chip, isOn ? styles.chipOn : null]}
            >
              <Text style={[styles.chipText, isOn ? styles.chipTextOn : null]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  label: { ...typography.subhead, fontWeight: '600', color: colors.navy },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
  },
  chipOn: { backgroundColor: colors.blueSoft, borderColor: colors.blue },
  chipText: { ...typography.subhead, color: colors.textSecondary },
  chipTextOn: { color: colors.blue, fontWeight: '600' },
});

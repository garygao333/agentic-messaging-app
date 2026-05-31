import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

export function Input({
  label,
  hint,
  style,
  ...props
}: TextInputProps & { label?: string; hint?: string }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, style]}
        {...props}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: { ...typography.subhead, fontWeight: '600', color: colors.navy },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 50,
  },
  hint: { ...typography.footnote, color: colors.textSecondary },
});

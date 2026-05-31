import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}) {
  const isDisabled = disabled || loading;
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border },
        v.border ? styles.bordered : null,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.label, { color: v.fg }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.blue, fg: colors.white },
  secondary: { bg: colors.card, fg: colors.navy },
  ghost: { bg: 'transparent', fg: colors.blue },
  destructive: { bg: colors.redSoft, fg: colors.red },
};

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  bordered: { borderWidth: StyleSheet.hairlineWidth },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { ...typography.headline },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
});

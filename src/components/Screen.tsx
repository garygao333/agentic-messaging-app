import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

/** Standard screen container: safe area + white bg + horizontal padding. */
export function Screen({
  children,
  scroll = true,
  footer,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
}) {
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.content, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl, gap: spacing.lg },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
});

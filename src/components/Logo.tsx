import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography } from '@/theme';

type Variant = 'color' | 'mono' | 'white';

/** The two-overlapping-bubbles brand mark, rendered inline from the brand SVG. */
export function LogoMark({ size = 40, variant = 'color' }: { size?: number; variant?: Variant }) {
  const backFill = variant === 'white' ? colors.white : colors.navy;
  const frontFill = variant === 'color' ? colors.blue : variant === 'white' ? colors.blueAccent : 'none';
  const frontStroke = variant === 'mono' ? colors.navy : undefined;
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Path
        d="M14 22h30a7 7 0 0 1 7 7v14a7 7 0 0 1-7 7H28l-7 6v-6a7 7 0 0 1-7-7V22Z"
        fill={backFill}
      />
      <Path
        d="M36 31h30v14a7 7 0 0 1-7 7v6l-7-6H43a7 7 0 0 1-7-7V31Z"
        fill={frontFill}
        stroke={frontStroke}
        strokeWidth={frontStroke ? 3.4 : 0}
      />
    </Svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({
  size = 40,
  variant = 'color',
  showWordmark = true,
  style,
}: {
  size?: number;
  variant?: Variant;
  showWordmark?: boolean;
  style?: ViewStyle;
}) {
  const textColor = variant === 'white' ? colors.white : colors.navy;
  return (
    <View style={[styles.row, style]}>
      <LogoMark size={size} variant={variant} />
      {showWordmark && (
        <Text style={[styles.wordmark, { color: textColor, fontSize: size * 0.5 }]}>
          Agentic Messaging
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wordmark: { ...typography.headline, fontWeight: '700' },
});

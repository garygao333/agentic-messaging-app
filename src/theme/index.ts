/**
 * Agentic Messaging design system.
 *
 * Apple-native: white background, black text, light-gray rounded cards,
 * minimal color. Palette derived from the brand assets in /brand
 * (navy #141a2e, primary blue #2563eb, accent #3b82f6).
 */

export const colors = {
  // Brand
  navy: '#141A2E',
  blue: '#2563EB',
  blueAccent: '#3B82F6',
  blueSoft: '#EAF1FE',

  // Surfaces
  background: '#FFFFFF',
  card: '#F2F2F7', // iOS systemGray6
  cardBorder: '#E5E5EA',
  inputBorder: '#D1D1D6',

  // Text
  text: '#0A0A0A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Functional / status
  green: '#34C759',
  greenSoft: '#E5F8EC',
  amber: '#FF9500',
  amberSoft: '#FFF3E0',
  red: '#FF3B30',
  redSoft: '#FDEBEA',
  graySoft: '#ECECEF',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.2 },
  title: { fontSize: 28, fontWeight: '700' as const },
  title2: { fontSize: 22, fontWeight: '700' as const },
  headline: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 17, fontWeight: '400' as const },
  callout: { fontSize: 16, fontWeight: '400' as const },
  subhead: { fontSize: 15, fontWeight: '400' as const },
  footnote: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
} as const;

export const theme = { colors, spacing, radius, typography, shadow };
export type Theme = typeof theme;

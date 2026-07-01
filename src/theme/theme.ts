/**
 * iOS-flavoured design tokens. Colours mirror Apple's system palette so the
 * app feels native without pulling in a heavy UI library.
 */

export const colors = {
  // Brand / accent
  primary: '#0A84FF', // iOS system blue
  primaryDark: '#0060DF',

  // Backgrounds (grouped list style)
  background: '#F2F2F7', // iOS grouped background
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',

  // Separators & fills
  separator: '#C6C6C8',
  fill: '#E5E5EA',
  fillSecondary: '#EFEFF4',

  // Text
  text: '#1C1C1E',
  textSecondary: '#6E6E73',
  textTertiary: '#8E8E93',
  textInverse: '#FFFFFF',

  // Status colours
  statusAssigned: '#8E8E93', // gray
  statusInProgress: '#FF9F0A', // orange
  statusDone: '#34C759', // green

  // Priority
  priorityHigh: '#FF3B30',
  priorityNormal: '#0A84FF',
  priorityLow: '#8E8E93',

  // Misc
  online: '#34C759',
  offline: '#C7C7CC',
  danger: '#FF3B30',
  brief: '#5E5CE6', // indigo for morning-brief messages
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const },
  title: { fontSize: 22, fontWeight: '700' as const },
  headline: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 17, fontWeight: '400' as const },
  callout: { fontSize: 16, fontWeight: '400' as const },
  subhead: { fontSize: 15, fontWeight: '400' as const },
  footnote: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
} as const;

export const avatarPalette = [
  '#FF9F0A',
  '#0A84FF',
  '#34C759',
  '#FF375F',
  '#5E5CE6',
  '#BF5AF2',
  '#64D2FF',
] as const;

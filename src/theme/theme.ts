/**
 * iOS design tokens, matched to Apple's Human Interface Guidelines (light mode).
 * Colours are the real UIKit system colours; typography follows the SF Pro
 * Dynamic Type scale. On iOS the default React Native font already *is* SF Pro,
 * so we only set sizes/weights — never a custom family.
 *
 * Refs: developer.apple.com/design/human-interface-guidelines/color + typography
 */

export const colors = {
  // System accent colours (light mode)
  primary: '#007AFF', // systemBlue
  green: '#34C759', // systemGreen
  orange: '#FF9500', // systemOrange
  red: '#FF3B30', // systemRed
  indigo: '#5856D6', // systemIndigo
  yellow: '#FFCC00', // systemYellow

  // Grouped-list backgrounds (the classic iOS Settings look)
  groupedBackground: '#F2F2F7', // systemGroupedBackground
  groupedCard: '#FFFFFF', // secondarySystemGroupedBackground (cells)
  background: '#FFFFFF', // systemBackground

  // Grays
  gray: '#8E8E93', // systemGray
  gray2: '#AEAEB2',
  gray3: '#C7C7CC',
  gray4: '#D1D1D6',
  gray5: '#E5E5EA',
  gray6: '#F2F2F7',

  // Labels (Apple uses translucent blacks so they sit correctly on any fill)
  label: '#000000',
  secondaryLabel: 'rgba(60,60,67,0.6)',
  tertiaryLabel: 'rgba(60,60,67,0.3)',
  quaternaryLabel: 'rgba(60,60,67,0.18)',
  placeholder: 'rgba(60,60,67,0.3)',

  // Separators
  separator: 'rgba(60,60,67,0.29)',
  opaqueSeparator: '#C6C6C8',

  // Fills (for pressed states, chips)
  fill: 'rgba(120,120,128,0.2)',
  secondaryFill: 'rgba(120,120,128,0.16)',
  tertiaryFill: 'rgba(120,120,128,0.12)',

  // Convenience
  white: '#FFFFFF',
  pressedCell: '#D1D1D6', // systemGray4 — cell highlight on tap

  // Job status (mapped to system colours)
  statusAssigned: '#8E8E93',
  statusInProgress: '#FF9500',
  statusDone: '#34C759',
} as const;

// Avatar tints — drawn from Apple's system palette so they feel native.
export const avatarPalette = [
  '#FF9500', // orange
  '#34C759', // green
  '#5856D6', // indigo
  '#FF2D55', // pink
  '#5AC8FA', // cyan
  '#AF52DE', // purple
  '#FF3B30', // red
] as const;

// 8pt-based spacing; 16 is the standard iOS content margin.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  cell: 10, // grouped-list corner radius
  card: 12,
  button: 12,
  pill: 999,
} as const;

/**
 * SF Pro Dynamic Type scale (default content size). Weights stick to
 * Regular/Medium/Semibold/Bold — Apple discourages lighter weights.
 */
export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' as const, letterSpacing: 0.37 },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, letterSpacing: 0.36 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const, letterSpacing: 0.35 },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' as const, letterSpacing: 0.38 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const, letterSpacing: -0.43 },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' as const, letterSpacing: -0.43 },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' as const, letterSpacing: -0.31 },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const, letterSpacing: -0.23 },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const, letterSpacing: -0.08 },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const, letterSpacing: 0 },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '400' as const, letterSpacing: 0.06 },
} as const;

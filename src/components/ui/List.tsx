import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '@/theme/theme';

/**
 * iOS "inset grouped" list primitives (the Settings-app look): rounded white
 * cards on a grey grouped background, hairline separators between rows inset to
 * align with the text, 44pt-minimum rows, and chevron accessories.
 */

interface SectionProps {
  header?: string;
  footer?: string;
  children: React.ReactNode;
  separatorInset?: number; // left inset of the hairline (aligns with text)
  style?: ViewStyle;
}

export function ListSection({ header, footer, children, separatorInset = spacing.lg, style }: SectionProps) {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[styles.section, style]}>
      {header ? <Text style={styles.header}>{header.toUpperCase()}</Text> : null}
      <View style={styles.card}>
        {items.map((child, i) => (
          <View key={i}>
            {child}
            {i < items.length - 1 ? (
              <View style={[styles.separator, { marginLeft: separatorInset }]} />
            ) : null}
          </View>
        ))}
      </View>
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );
}

/** Pressable 44pt cell container for custom row layouts. */
export function Cell({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.cell, pressed && onPress ? styles.cellPressed : null, style]}
    >
      {children}
    </Pressable>
  );
}

interface RowProps {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  value?: string;
  accessory?: 'chevron' | 'none';
  rightNode?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  tint?: boolean; // render title in the accent colour (button-like row)
}

export function ListRow({
  title,
  subtitle,
  leading,
  value,
  accessory,
  rightNode,
  onPress,
  destructive,
  tint,
}: RowProps) {
  const showChevron = accessory === 'chevron' || (accessory === undefined && !!onPress && !rightNode);
  const titleColor = destructive ? colors.red : tint ? colors.primary : colors.label;
  return (
    <Cell onPress={onPress}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.rowText}>
        <Text style={[type.body, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[type.footnote, styles.subtitle]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text style={[type.body, styles.value]} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {rightNode}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={17} color={colors.tertiaryLabel} style={styles.chevron} />
      ) : null}
    </Cell>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  header: {
    ...type.footnote,
    color: colors.secondaryLabel,
    marginLeft: spacing.lg + spacing.lg,
    marginBottom: 7,
  },
  footer: {
    ...type.footnote,
    color: colors.secondaryLabel,
    marginHorizontal: spacing.lg + spacing.lg,
    marginTop: 7,
  },
  card: {
    backgroundColor: colors.groupedCard,
    borderRadius: radius.cell,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
  cell: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    backgroundColor: colors.groupedCard,
  },
  cellPressed: { backgroundColor: colors.gray5 },
  leading: { marginRight: spacing.md },
  rowText: { flex: 1, justifyContent: 'center' },
  subtitle: { color: colors.secondaryLabel, marginTop: 1 },
  value: { color: colors.secondaryLabel, marginLeft: spacing.sm },
  chevron: { marginLeft: 6, marginRight: -4 },
});

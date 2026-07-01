import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type } from '@/theme/theme';

interface Props {
  title: string;
  subtitle?: string;
  action?: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; label?: string };
}

/**
 * iOS "large title at rest" header rendered in-content, with an optional
 * trailing bar-button (icon or text) beside the title — the standard layout
 * when a nav-bar action sits next to a large title.
 */
export function LargeTitle({ title, subtitle, action }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[type.largeTitle, styles.title]} numberOfLines={1}>
          {title}
        </Text>
        {action ? (
          <Pressable onPress={action.onPress} hitSlop={12} style={styles.action}>
            {action.label ? (
              <Text style={[type.body, styles.actionLabel]}>{action.label}</Text>
            ) : (
              <Ionicons name={action.icon} size={24} color={colors.primary} />
            )}
          </Pressable>
        ) : null}
      </View>
      {subtitle ? <Text style={[type.subhead, styles.subtitle]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.label, flex: 1 },
  subtitle: { color: colors.secondaryLabel, marginTop: 2 },
  action: { marginLeft: spacing.md },
  actionLabel: { color: colors.primary },
});

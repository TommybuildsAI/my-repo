import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type } from '@/theme/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={52} color={colors.gray3} />
      <Text style={[type.headline, styles.title]}>{title}</Text>
      {subtitle ? <Text style={[type.subhead, styles.subtitle]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, paddingHorizontal: spacing.xxl, gap: spacing.sm },
  title: { color: colors.secondaryLabel, textAlign: 'center' },
  subtitle: { color: colors.tertiaryLabel, textAlign: 'center' },
});

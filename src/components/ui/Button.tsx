import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/theme';

type Variant = 'primary' | 'secondary' | 'success' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const bg: Record<Variant, string> = {
  primary: colors.primary,
  secondary: colors.fill,
  success: colors.statusDone,
  danger: colors.danger,
};

export function Button({ title, onPress, variant = 'primary', icon, disabled, loading, style }: Props) {
  const isSecondary = variant === 'secondary';
  const fg = isSecondary ? colors.primary : colors.textInverse;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg[variant] },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={fg} />}
          <Text style={[styles.title, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.7 },
  title: { fontSize: 17, fontWeight: '600' },
});

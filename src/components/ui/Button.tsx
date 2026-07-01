import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type } from '@/theme/theme';

type Variant = 'filled' | 'tinted' | 'gray' | 'success';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

/** iOS-style buttons: 50pt tall, filled or tinted (translucent accent fill). */
export function Button({ title, onPress, variant = 'filled', icon, disabled, loading, style }: Props) {
  const bg: Record<Variant, string> = {
    filled: colors.primary,
    tinted: 'rgba(0,122,255,0.15)',
    gray: colors.gray6,
    success: colors.green,
  };
  const fg: Record<Variant, string> = {
    filled: colors.white,
    tinted: colors.primary,
    gray: colors.primary,
    success: colors.white,
  };

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
        <ActivityIndicator color={fg[variant]} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={19} color={fg[variant]} /> : null}
          <Text style={[type.headline, { color: fg[variant] }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    borderRadius: radius.button,
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.8 },
});

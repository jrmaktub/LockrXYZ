import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, limeGlow } from '@/theme/tokens';
import { Txt } from './Txt';

type Variant = 'primary' | 'ghost';

type Props = {
  label?: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  /** Left icon element. */
  icon?: React.ReactNode;
  /** Right icon element. */
  iconRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  fontSize?: number;
  children?: React.ReactNode;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  icon,
  iconRight,
  style,
  textColor,
  fontSize = 15,
  children,
}: Props) {
  const primary = variant === 'primary';
  const fg = textColor ?? (primary ? colors.onLime : colors.cream);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      // NOTE: NativeWind v4 (jsxImportSource) drops Pressable's function-style result,
      // which blanks the background. Use a plain style array so fills always render.
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 18,
          backgroundColor: primary ? colors.lime : colors.panel2,
          borderWidth: primary ? 0 : 1,
          borderColor: colors.hairline2,
          opacity: disabled ? 0.45 : 1,
        },
        primary ? limeGlow : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <>
          {icon}
          {label ? (
            <Txt w={700} style={{ color: fg, fontSize }}>
              {label}
            </Txt>
          ) : null}
          {children}
          {iconRight}
        </>
      )}
    </Pressable>
  );
}

/** Bare full-width container helper to align with prototype spacing. */
export function ButtonRow({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ width: '100%' }, style]}>{children}</View>;
}

import { Text as RNText, type TextProps } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

type Weight = 400 | 500 | 600 | 700 | 800;

const familyForWeight: Record<Weight, string> = {
  400: fonts.regular,
  500: fonts.medium,
  600: fonts.semibold,
  700: fonts.bold,
  800: fonts.extrabold,
};

type TxtProps = TextProps & {
  /** Montserrat weight. Defaults to 500 (medium). */
  w?: Weight;
  /** Render with the JetBrains Mono family (for tracking codes / numbers). */
  mono?: boolean;
};

/**
 * App text primitive. RN registers each Google-font weight as its own family,
 * so we map a `w` prop to the correct family rather than relying on fontWeight.
 * Default color is cream; override via `style` or NativeWind `className`.
 */
export function Txt({ w = 500, mono, style, ...rest }: TxtProps) {
  return (
    <RNText
      {...rest}
      style={[
        { color: colors.text, fontFamily: mono ? (w >= 700 ? fonts.monoBold : fonts.mono) : familyForWeight[w] },
        style,
      ]}
    />
  );
}

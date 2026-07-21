import { Image, type ImageStyle, type StyleProp } from 'react-native';

const wordmark = require('../../assets/images/brand/lockr-wordmark.png');
const iconCream = require('../../assets/images/brand/lockr-icon-cream.png');
const iconColor = require('../../assets/images/brand/lockr-icon-color.png');

const WORDMARK_RATIO = 1149 / 360; // official asset aspect
const MARK_RATIO = 491 / 460;

/** Official LOCKR wordmark (white letters + lime padlock-O) — for dark bg. */
export function Logo({ height = 30, style }: { height?: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={wordmark}
      style={[{ height, width: height * WORDMARK_RATIO }, style]}
      resizeMode="contain"
    />
  );
}

/**
 * Official isotype (padlock mark).
 * - `cream`: mono cream mark for dark surfaces
 * - `color`: lime + dark details for light surfaces
 */
export function LogoMark({
  size = 40,
  variant = 'cream',
  tint,
  style,
}: {
  size?: number;
  variant?: 'cream' | 'color';
  /** Recolor the mono `cream` mark (e.g. dark padlock on a lime tile). */
  tint?: string;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={variant === 'color' ? iconColor : iconCream}
      style={[{ height: size, width: size * MARK_RATIO }, tint ? { tintColor: tint } : null, style]}
      resizeMode="contain"
    />
  );
}

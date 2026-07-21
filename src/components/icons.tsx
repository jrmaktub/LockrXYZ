/* ============================================================
   LOCKR — Line-icon set (ported to react-native-svg)
   ============================================================ */
import Svg, { Circle, Path, Rect, type SvgProps } from 'react-native-svg';

import { colors } from '@/theme/tokens';

export type IconProps = {
  size?: number;
  /** stroke width */
  sw?: number;
  color?: string;
};

type IcProps = IconProps & {
  vb?: number;
  children: React.ReactNode;
};

function Ic({ size = 22, sw = 1.9, color = 'currentColor', vb = 24, children }: IcProps) {
  const props: SvgProps = {
    width: size,
    height: size,
    viewBox: `0 0 ${vb} ${vb}`,
    fill: 'none',
    stroke: color === 'currentColor' ? colors.text : color,
    strokeWidth: sw,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  return <Svg {...props}>{children}</Svg>;
}

export const Icons = {
  home: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </Ic>
  ),
  box: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <Path d="M3 8l9 5 9-5M12 13v8" />
    </Ic>
  ),
  boxes: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M3 8 12 3l9 5v8l-9 5-9-5V8Z" />
      <Path d="m3 8 9 5 9-5M12 13v8" />
    </Ic>
  ),
  qr: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="3" y="3" width="7" height="7" rx="1.5" />
      <Rect x="14" y="3" width="7" height="7" rx="1.5" />
      <Rect x="3" y="14" width="7" height="7" rx="1.5" />
      <Path d="M14 14h3v3M21 14v.01M14 21h.01M17 21h4v-4M21 17v.01" />
    </Ic>
  ),
  support: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <Rect x="2.5" y="13" width="4" height="6" rx="2" />
      <Rect x="17.5" y="13" width="4" height="6" rx="2" />
      <Path d="M20 19v.5a3 3 0 0 1-3 3h-3" />
    </Ic>
  ),
  user: (p: IconProps) => (
    <Ic {...p}>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21a8 8 0 0 1 16 0" />
    </Ic>
  ),
  bell: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M10.5 21a2 2 0 0 0 3 0" />
    </Ic>
  ),
  back: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M15 5l-7 7 7 7" />
    </Ic>
  ),
  chev: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M9 5l7 7-7 7" />
    </Ic>
  ),
  search: (p: IconProps) => (
    <Ic {...p}>
      <Circle cx="11" cy="11" r="7" />
      <Path d="m21 21-4.3-4.3" />
    </Ic>
  ),
  planeUp: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M10.5 2.5 12 2l1.5.5.7 7.3 6.3 3.7-.2 1.6-6.4-1.8.2 4.4 1.7 1.3-.2 1.2-2.8-.8-.6 1.9h-1l-.6-1.9-2.8.8-.2-1.2 1.7-1.3.2-4.4L3 14.6l-.2-1.6 6.3-3.7Z" />
    </Ic>
  ),
  ship: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M3 14h18l-2 6H5l-2-6Z" />
      <Path d="M5 14V9h14v5M9 9V5h6v4M12 5V3" />
    </Ic>
  ),
  truck: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <Circle cx="7" cy="18" r="1.8" />
      <Circle cx="17.5" cy="18" r="1.8" />
    </Ic>
  ),
  calc: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="5" y="2" width="14" height="20" rx="3" />
      <Path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4" />
    </Ic>
  ),
  wallet: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="3" y="5" width="18" height="14" rx="3" />
      <Path d="M3 9h18M17 14h.5" />
    </Ic>
  ),
  alert: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M12 3 2 20h20L12 3Z" />
      <Path d="M12 10v4M12 17h.01" />
    </Ic>
  ),
  pin: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <Circle cx="12" cy="10" r="2.5" />
    </Ic>
  ),
  invoice: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M6 2h9l4 4v16l-2.5-1.5L14 22l-2.5-1.5L9 22l-2.5-1.5L4 22V4a2 2 0 0 1 2-2Z" />
      <Path d="M8 8h7M8 12h7M8 16h4" />
    </Ic>
  ),
  bug: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="7" y="8" width="10" height="11" rx="5" />
      <Path d="M12 8V5m-3.5 0 1.5 2m6.5-2-1.5 2M7 12H3m18 0h-4M7 16H4m17 0h-3M9 5a3 3 0 0 1 6 0" />
    </Ic>
  ),
  fingerprint: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M12 4a8 8 0 0 0-8 8v3M20 12a8 8 0 0 0-4-6.9M8 20a14 14 0 0 1-.5-8 4.5 4.5 0 0 1 9 0v2M12 12v2a8 8 0 0 0 1.5 5M16.5 17a12 12 0 0 1-.5-5" />
    </Ic>
  ),
  copy: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="9" y="9" width="11" height="11" rx="2.5" />
      <Path d="M5 15V5a2 2 0 0 1 2-2h8" />
    </Ic>
  ),
  check: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M4 12.5 9.5 18 20 6.5" />
    </Ic>
  ),
  checkCircle: (p: IconProps) => (
    <Ic {...p}>
      <Circle cx="12" cy="12" r="9" />
      <Path d="m8.5 12.2 2.4 2.4 4.6-4.8" />
    </Ic>
  ),
  clock: (p: IconProps) => (
    <Ic {...p}>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3.5 2" />
    </Ic>
  ),
  weight: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M7 8h10l2.5 12h-15z" />
      <Circle cx="12" cy="6" r="2.5" />
    </Ic>
  ),
  cal: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="3" y="5" width="18" height="16" rx="3" />
      <Path d="M3 9h18M8 3v4m8-4v4" />
    </Ic>
  ),
  calCheck: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="3" y="5" width="18" height="16" rx="3" />
      <Path d="M3 9h18M8 3v4m8-4v4M9 15l2 2 4-4" />
    </Ic>
  ),
  edit: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M16 4 20 8 9 19l-4.5 1L6 15.5 16 4Z" />
    </Ic>
  ),
  plus: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M12 5v14M5 12h14" />
    </Ic>
  ),
  spark: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <Path d="M5 17l.6 1.8L7.5 19l-1.9.6L5 21l-.6-1.4L2.5 19l2-.2L5 17Z" />
    </Ic>
  ),
  logout: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 12h10M17 9l3 3-3 3M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
    </Ic>
  ),
  bolt: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M13 2 4 14h6l-1 8 9-12h-6l1-6Z" />
    </Ic>
  ),
  sun: (p: IconProps) => (
    <Ic {...p}>
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2v2M12 20v2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4" />
    </Ic>
  ),
  moon: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z" />
    </Ic>
  ),
  warehouse: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M3 21V8l9-4 9 4v13" />
      <Path d="M7 21v-7h10v7M7 17h10" />
    </Ic>
  ),
  doc: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M6 2h8l4 4v16H6z" />
      <Path d="M14 2v4h4M9 13h6M9 17h6" />
    </Ic>
  ),
  globe: (p: IconProps) => (
    <Ic {...p}>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Ic>
  ),
  gift: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="3" y="8" width="18" height="5" rx="1" />
      <Path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3 8 4.5 9 8 12 8Zm0 0s1.5-5 4-3.5S15 8 12 8Z" />
    </Ic>
  ),
  card: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="3" y="5" width="18" height="14" rx="3" />
      <Path d="M3 10h18" />
    </Ic>
  ),
  shield: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <Path d="m9 12 2 2 4-4" />
    </Ic>
  ),
  phone: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L19 13l2 4v3a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
    </Ic>
  ),
  whatsapp: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M3 21l1.6-4.5A8 8 0 1 1 8 19.5L3 21Z" />
      <Path d="M9 9c0 4 2.5 6 5.5 6.3.6-.8 1-1.2 1.5-1l-1.8-1.2c-.4.6-1 .5-1.6.1-.9-.6-1.7-1.8-1.7-2.6 0-.5.4-.7.6-1L10 8c-.4-.4-.8-.3-1 0Z" />
    </Ic>
  ),
  mail: (p: IconProps) => (
    <Ic {...p}>
      <Rect x="3" y="5" width="18" height="14" rx="2.5" />
      <Path d="m4 7 8 6 8-6" />
    </Ic>
  ),
  refresh: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M4 4v5h5M20 20v-5h-5" />
      <Path d="M19 9a8 8 0 0 0-14-2L4 9m1 6a8 8 0 0 0 14 2l1-2" />
    </Ic>
  ),
  users: (p: IconProps) => (
    <Ic {...p}>
      <Circle cx="9" cy="8" r="3.5" />
      <Path d="M3 20a6 6 0 0 1 12 0M16 5a3.5 3.5 0 0 1 0 7M21 20a6 6 0 0 0-5-5.9" />
    </Ic>
  ),
  arrowR: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M5 12h14M13 6l6 6-6 6" />
    </Ic>
  ),
  download: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M12 3v12m-4-4 4 4 4-4M5 21h14" />
    </Ic>
  ),
  scan: (p: IconProps) => (
    <Ic {...p}>
      <Path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M3 12h18" />
    </Ic>
  ),
};

export type IconName = keyof typeof Icons;

/** Render an icon by name (for data-driven icon fields). */
export function Icon({ name, ...rest }: IconProps & { name: IconName }) {
  const C = Icons[name];
  return <C {...rest} />;
}

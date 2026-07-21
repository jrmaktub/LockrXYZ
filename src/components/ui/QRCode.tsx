import Svg, { G, Rect } from 'react-native-svg';

import { colors } from '@/theme/tokens';

/** Decorative, scannable-looking QR (seeded). Not a real encoder. */
export function QRCode({
  size = 200,
  seed = 40240,
  fg = colors.ink,
  accent = colors.olive,
}: {
  size?: number;
  seed?: number;
  fg?: string;
  accent?: string;
}) {
  const N = 29;
  const q = 1;
  let s = (seed * 2654435761) % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  const cells: [number, number][] = [];
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (isFinder(r, c)) continue;
      if (rnd() > 0.52) cells.push([r, c]);
    }
  const u = size / (N + q * 2);
  const finder = (br: number, bc: number) => (
    <G key={`${br}-${bc}`}>
      <Rect
        x={(bc + q) * u}
        y={(br + q) * u}
        width={7 * u}
        height={7 * u}
        rx={2 * u}
        fill="none"
        stroke={accent}
        strokeWidth={u * 1.05}
      />
      <Rect x={(bc + q + 2) * u} y={(br + q + 2) * u} width={3 * u} height={3 * u} rx={u} fill={accent} />
    </G>
  );

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells.map(([r, c], i) => (
        <Rect
          key={i}
          x={(c + q) * u}
          y={(r + q) * u}
          width={u * 0.92}
          height={u * 0.92}
          rx={u * 0.28}
          fill={fg}
        />
      ))}
      {finder(0, 0)}
      {finder(0, N - 7)}
      {finder(N - 7, 0)}
    </Svg>
  );
}

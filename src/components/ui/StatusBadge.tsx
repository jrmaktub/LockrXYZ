import { View } from 'react-native';

import { Icon } from '@/components/icons';
import { statusMeta } from '@/data/mock';
import { colors } from '@/theme/tokens';
import { Txt } from './Txt';

/** hex (#RRGGBB) -> rgba with the given alpha. */
function tint(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StatusBadge({ stage, size = 'md' }: { stage: string; size?: 'sm' | 'md' }) {
  const m = statusMeta(stage);
  const sm = size === 'sm';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: sm ? 4 : 6,
        paddingHorizontal: sm ? 9 : 11,
        borderRadius: 9999,
        backgroundColor: tint(m.color, 0.13),
        borderWidth: 1,
        borderColor: tint(m.color, 0.3),
        alignSelf: 'flex-start',
      }}
    >
      <Icon name={m.icon} size={sm ? 12 : 13} sw={2.2} color={m.color} />
      <Txt w={700} style={{ color: m.color, fontSize: sm ? 11 : 12 }}>
        {m.label}
      </Txt>
    </View>
  );
}

export function TypePill({ type }: { type: 'aereo' | 'maritimo' }) {
  const air = type === 'aereo';
  const c = air ? colors.air : colors.gray;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Icon name={air ? 'planeUp' : 'ship'} size={13} sw={2} color={c} />
      <Txt w={600} style={{ fontSize: 11.5, color: c }}>
        {air ? 'Aéreo' : 'Marítimo'}
      </Txt>
    </View>
  );
}

export { tint };

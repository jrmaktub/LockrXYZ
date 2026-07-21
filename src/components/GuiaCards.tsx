import { Pressable, View } from 'react-native';

import { Icon, Icons, type IconName } from '@/components/icons';
import { Card, ProgressBar, StatusBadge, Txt } from '@/components/ui';
import { statusMeta, type Guia } from '@/data/mock';
import { colors } from '@/theme/tokens';

/** Compact package row (Home "Mis Paquetes"). */
export function MiniGuia({ g, onPress }: { g: Guia; onPress: () => void }) {
  const m = statusMeta(g.current);
  return (
    <Pressable onPress={onPress}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 }}>
        <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={m.icon} size={21} color={colors.cream} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt w={700} numberOfLines={1} style={{ fontSize: 14 }}>
            {g.desc}
          </Txt>
          <Txt mono style={{ fontSize: 11.5, color: colors.gray, marginTop: 2 }}>
            #{g.id}
          </Txt>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 5 }}>
          <StatusBadge stage={g.current} size="sm" />
          <Icons.chev size={15} color={colors.gray} />
        </View>
      </Card>
    </Pressable>
  );
}

function Info({ icon, label, value, accent }: { icon: IconName; label: string; value: string; accent?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 9, alignItems: 'flex-start', width: '47%' }}>
      <Icon name={icon} size={16} color={colors.gray} />
      <View style={{ minWidth: 0 }}>
        <Txt w={600} style={{ fontSize: 12, color: colors.gray, marginBottom: 1 }}>
          {label}
        </Txt>
        <Txt w={700} style={{ fontSize: 13, color: accent ? colors.lime : colors.text }}>
          {value}
        </Txt>
      </View>
    </View>
  );
}

/** Full package card (Guías list + Buscar result). */
export function GuiaCard({ g, onPress }: { g: Guia; onPress: () => void }) {
  const m = statusMeta(g.current);
  return (
    <Card style={{ overflow: 'hidden' }}>
      <Pressable onPress={onPress}>
        {/* header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 15, paddingBottom: 13 }}>
          <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={m.icon} size={22} color={colors.cream} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt w={700} numberOfLines={1} style={{ fontSize: 15 }}>
              {g.desc}
            </Txt>
            <Txt mono numberOfLines={1} style={{ fontSize: 11, color: colors.gray, marginTop: 2 }}>
              Guía #{g.id} · {g.tracking}
            </Txt>
          </View>
          <StatusBadge stage={g.current} size="sm" />
        </View>

        {g.tab === 'transito' && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 4 }}>
            <ProgressBar current={g.current} />
          </View>
        )}

        {/* info grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 12, columnGap: 14, padding: 16 }}>
          <Info icon="cal" label="Recibido" value={g.received} />
          <Info icon="calCheck" label={g.delivered ? 'Entregado' : 'Entrega est.'} value={g.delivered || g.eta} accent={!g.delivered} />
          <Info icon="weight" label="Peso" value={`${g.weight} lb · ${g.items} item${g.items > 1 ? 's' : ''}`} />
          <Info icon={g.type === 'aereo' ? 'planeUp' : 'ship'} label="Flete" value={g.type === 'aereo' ? 'Aéreo' : 'Marítimo'} accent={g.type === 'aereo'} />
        </View>

        {/* footer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: colors.hairline, backgroundColor: colors.bg0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icons.pin size={14} color={colors.gray} />
            <Txt w={600} style={{ fontSize: 12, color: colors.gray }}>
              {g.current === 'bodega' ? 'Bodega SPS Los Andes' : g.current === 'entregado' ? 'Entregado' : 'En camino a Honduras'}
            </Txt>
          </View>
          <Txt w={800} style={{ fontSize: 15, color: colors.lime }}>
            L {g.price}
          </Txt>
        </View>
      </Pressable>
    </Card>
  );
}

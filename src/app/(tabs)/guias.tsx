import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GuiaCard } from '@/components/GuiaCards';
import { Icons } from '@/components/icons';
import { Input, ScreenContainer, Txt } from '@/components/ui';
import { useGuias } from '@/hooks/useFirestoreData';
import type { Guia } from '@/types';
import { colors } from '@/theme/tokens';

const FILTERS: { key: string; label: string; match: (g: Guia) => boolean }[] = [
  { key: 'camino', label: 'En camino', match: (g) => g.current !== 'entregado' },
  { key: 'entregado', label: 'Entregados', match: (g) => g.current === 'entregado' },
];

export default function GuiasScreen() {
  const insets = useSafeAreaInsets();
  const { guias } = useGuias();
  const [filter, setFilter] = useState('camino');
  const [q, setQ] = useState('');

  const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];
  const query = q.trim().toLowerCase();
  const list = useMemo(
    () =>
      guias.filter(
        (g) => active.match(g) && (query === '' || g.tracking.toLowerCase().includes(query) || g.desc.toLowerCase().includes(query)),
      ),
    [guias, active, query],
  );

  return (
    <ScreenContainer>
      <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 20 }}>
        <Txt w={800} style={{ fontSize: 24, letterSpacing: -0.7, marginBottom: 16 }}>
          Mis paquetes
        </Txt>
        {/* search */}
        <Input
          adorn={<Icons.search size={18} color={colors.gray} />}
          value={q}
          onChangeText={setQ}
          placeholder="Buscar por guía o descripción"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* state filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, flexShrink: 0 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingTop: 14, paddingBottom: 4, alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        {FILTERS.map((f) => {
          const on = f.key === filter;
          const count = guias.filter(f.match).length;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                paddingVertical: 9,
                paddingHorizontal: 14,
                borderRadius: 9999,
                backgroundColor: on ? colors.lime : colors.panel3,
                borderWidth: 1,
                borderColor: on ? colors.lime : 'rgba(245,246,237,0.16)',
              }}
            >
              <Txt w={700} style={{ fontSize: 13, color: on ? colors.onLime : colors.text }}>
                {f.label}
              </Txt>
              <View
                style={{
                  minWidth: 19,
                  alignItems: 'center',
                  paddingVertical: 1.5,
                  paddingHorizontal: 6,
                  borderRadius: 9999,
                  backgroundColor: on ? 'rgba(26,27,16,0.20)' : 'rgba(222,241,107,0.16)',
                }}
              >
                <Txt w={800} style={{ fontSize: 10.5, color: on ? colors.onLime : colors.lime }}>
                  {count}
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={list}
        keyExtractor={(g) => g.id}
        renderItem={({ item: g }) => <GuiaCard g={g} onPress={() => router.push(`/tracking/${g.id}`)} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, gap: 14 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 48, gap: 10 }}>
            <Icons.box size={34} color={colors.gray} />
            <Txt w={600} style={{ fontSize: 14, color: colors.gray, textAlign: 'center' }}>
              {query ? 'Sin resultados para tu búsqueda' : 'No hay paquetes en este estado'}
            </Txt>
          </View>
        }
      />
    </ScreenContainer>
  );
}

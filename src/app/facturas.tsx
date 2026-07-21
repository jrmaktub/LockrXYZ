import { Pressable, View } from 'react-native';

import { Icons } from '@/components/icons';
import { AppBar, Card, ScreenBody, ScreenContainer, Txt, useToast } from '@/components/ui';
import { useGuias } from '@/hooks/useFirestoreData';
import { colors } from '@/theme/tokens';

export default function FacturasScreen() {
  const toast = useToast();
  const { guias } = useGuias();
  const entregadas = guias.filter((g) => g.tab === 'entregado');

  return (
    <ScreenContainer>
      <AppBar title="Facturas" sub="Guías entregadas" />
      <ScreenBody>
        <View style={{ gap: 12 }}>
          {entregadas.map((g) => (
            <Card key={g.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15 }}>
              <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' }}>
                <Icons.doc size={20} color={colors.cream} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt w={700} numberOfLines={1} style={{ fontSize: 14 }}>
                  {g.desc}
                </Txt>
                <Txt mono style={{ fontSize: 11, color: colors.gray, marginTop: 2 }}>
                  FAC-{g.id} · {g.delivered}
                </Txt>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Txt w={800} style={{ fontSize: 15, color: colors.lime }}>
                  L {g.price}
                </Txt>
                <Pressable onPress={() => toast('Descargando PDF')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Icons.download size={13} color={colors.lime} />
                  <Txt w={700} style={{ fontSize: 11.5, color: colors.lime }}>
                    PDF
                  </Txt>
                </Pressable>
              </View>
            </Card>
          ))}
        </View>
      </ScreenBody>
    </ScreenContainer>
  );
}

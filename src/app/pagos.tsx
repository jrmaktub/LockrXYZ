import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Icons } from '@/components/icons';
import { LogoMark } from '@/components/Logo';
import { AppBar, Button, ScreenBody, ScreenContainer, Txt, useToast } from '@/components/ui';
import { usePayments } from '@/hooks/useFirestoreData';
import type { Payment } from '@/types';
import { colors } from '@/theme/tokens';

function PayCard({ p }: { p: Payment }) {
  const visa = p.brand === 'Visa';
  return (
    <LinearGradient
      colors={visa ? ['#2C2D1A', '#15160d'] : ['#24251A', '#181910']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 20, padding: 18, minHeight: 120, borderWidth: 1, borderColor: colors.hairline2, overflow: 'hidden' }}
    >
      <View style={{ position: 'absolute', right: -16, top: -14, opacity: 0.1 }}>
        <LogoMark size={120} variant="cream" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <Icons.card size={28} color={colors.lime} />
        {p.primary && (
          <View style={{ backgroundColor: colors.limeSoft, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 8 }}>
            <Txt w={800} style={{ fontSize: 10, color: colors.lime }}>
              PRINCIPAL
            </Txt>
          </View>
        )}
      </View>
      <Txt mono w={700} style={{ fontSize: 18, letterSpacing: 2, marginBottom: 12 }}>
        •••• •••• •••• {p.last}
      </Txt>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <Txt w={700} style={{ fontSize: 9.5, color: colors.gray, letterSpacing: 0.8 }}>
            VENCE
          </Txt>
          <Txt mono w={700} style={{ fontSize: 13 }}>
            {p.exp}
          </Txt>
        </View>
        <Txt w={800} style={{ fontSize: 15, color: colors.cream, fontStyle: 'italic' }}>
          {p.brand}
        </Txt>
      </View>
    </LinearGradient>
  );
}

export default function PagosScreen() {
  const toast = useToast();
  const { payments } = usePayments();
  return (
    <ScreenContainer>
      <AppBar title="Métodos de pago" sub="Tarjetas y facturación" />
      <ScreenBody>
        <View style={{ gap: 14, marginBottom: 16 }}>
          {payments.map((p) => (
            <PayCard key={p.id} p={p} />
          ))}
        </View>
        <Button variant="ghost" onPress={() => toast('Agregar tarjeta')} icon={<Icons.plus size={18} sw={2.4} color={colors.lime} />} label="Agregar tarjeta" textColor={colors.lime} style={{ paddingVertical: 15, borderColor: colors.limeLine, borderStyle: 'dashed' }} />
      </ScreenBody>
    </ScreenContainer>
  );
}

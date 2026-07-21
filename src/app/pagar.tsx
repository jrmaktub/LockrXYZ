import * as Clipboard from 'expo-clipboard';
import { useRef, useState } from 'react';
import { Animated, Easing, Linking, Pressable, View } from 'react-native';

import { WhatsAppMark } from '@/components/auth-bits';
import { Icons } from '@/components/icons';
import { AppBar, Card, ScreenBody, ScreenContainer, Txt, useToast } from '@/components/ui';
import { colors } from '@/theme/tokens';

// Customer service WhatsApp — send the transfer voucher here.
const WA_VOUCHER = `https://wa.me/50498640439?text=${encodeURIComponent('Hola, adjunto el voucher de mi transferencia Lockr.')}`;

type Account = { bank: string; holder: string; account: string; sub: string };

const ACCOUNTS: Account[] = [
  { bank: 'BAC Credomatic', holder: 'Lockr Honduras S. de R.L.', account: '7409158236', sub: 'Cuenta de ahorro · Lempiras' },
  { bank: 'Ficohsa', holder: 'Lockr Honduras S. de R.L.', account: '9999999999', sub: 'Cuenta de ahorro · Lempiras' },
  { bank: 'Banco Atlántida', holder: 'Lockr Honduras S. de R.L.', account: '01015551234', sub: 'Cuenta de ahorro · Lempiras' },
];

function AccountCard({ a }: { a: Account }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const pop = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    await Clipboard.setStringAsync(a.account);
    setCopied(true);
    toast(`Cuenta ${a.bank} copiada`);
    pop.setValue(0);
    Animated.sequence([
      Animated.timing(pop, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(2.5)), useNativeDriver: true }),
      Animated.timing(pop, { toValue: 0, duration: 220, delay: 1000, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

  return (
    <Card style={{ padding: 16 }}>
      <Txt w={800} style={{ fontSize: 15.5, color: colors.cream }}>
        {a.bank}
      </Txt>
      <Txt w={500} style={{ fontSize: 11.5, color: colors.gray, marginTop: 1 }}>
        {a.sub}
      </Txt>

      <View style={{ height: 1, backgroundColor: colors.hairline, marginVertical: 13 }} />

      {/* tap the number to copy — single clean level, no nested boxes */}
      <Pressable
        onPress={copy}
        accessibilityRole="button"
        accessibilityLabel={`Copiar cuenta ${a.bank}`}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <Txt mono w={700} style={{ flex: 1, fontSize: 21, letterSpacing: 1.5, color: colors.cream }}>
          {a.account}
        </Txt>
        <Animated.View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, transform: [{ scale: popScale }] }}>
          {copied ? <Icons.check size={16} sw={2.8} color={colors.lime} /> : <Icons.copy size={16} color={colors.lime} />}
          <Txt w={700} style={{ fontSize: 13, color: colors.lime }}>
            {copied ? 'Copiado' : 'Copiar'}
          </Txt>
        </Animated.View>
      </Pressable>

      <Txt w={500} style={{ fontSize: 11, color: colors.textDim, marginTop: 8 }}>
        {a.holder}
      </Txt>
    </Card>
  );
}

export default function PagarScreen() {
  const toast = useToast();
  const openWhatsApp = () => {
    Linking.openURL(WA_VOUCHER).catch(() => toast('No se pudo abrir WhatsApp'));
  };

  return (
    <ScreenContainer>
      <AppBar title="Pagar" sub="Transferencia bancaria" />
      <ScreenBody>
        <Txt w={500} style={{ fontSize: 13.5, color: colors.gray, lineHeight: 20, marginBottom: 18 }}>
          Para pagar tu envío, transfiere a cualquiera de nuestras cuentas. Toca el número para copiarlo.
        </Txt>

        <View style={{ gap: 12, marginBottom: 22 }}>
          {ACCOUNTS.map((a) => (
            <AccountCard key={a.bank} a={a} />
          ))}
        </View>

        {/* voucher step */}
        <View style={{ flexDirection: 'row', gap: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.hairline, borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <Icons.alert size={18} color={colors.lime} />
          <Txt w={500} style={{ flex: 1, fontSize: 12.5, color: colors.gray, lineHeight: 19 }}>
            Después de transferir, contáctanos por WhatsApp y envíanos el <Txt w={700} style={{ color: colors.cream }}>voucher de la transferencia</Txt> para confirmar tu pago.
          </Txt>
        </View>

        <Pressable onPress={openWhatsApp} accessibilityRole="button" accessibilityLabel="Enviar voucher por WhatsApp">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.waGreen, borderRadius: 16, paddingVertical: 16 }}>
            <WhatsAppMark size={21} color="#FFFFFF" />
            <Txt w={700} style={{ fontSize: 15, color: '#FFFFFF' }}>
              Enviar voucher por WhatsApp
            </Txt>
          </View>
        </Pressable>
      </ScreenBody>
    </ScreenContainer>
  );
}

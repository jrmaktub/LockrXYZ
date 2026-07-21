import { Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Icons, type IconName } from '@/components/icons';
import { Card, ScreenContainer, Txt, useToast } from '@/components/ui';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme/tokens';

// WhatsApp Business — customer service. wa.me links use the number in full
// international format with NO "+" or spaces, and an optional prefilled message.
const WA_NUMBER = '50498640439';
const WA_MESSAGE = 'Hola, necesito ayuda con mi casillero Lockr.';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

const FAQS = [
  '¿Cómo registro una prealerta?',
  '¿Cuánto tarda mi envío aéreo?',
  '¿Qué hago si mi paquete está en aduana?',
  '¿Cómo retiro con código QR?',
];

const TILES: { icon: IconName; label: string; sub: string; brand?: boolean }[] = [
  { icon: 'whatsapp', label: 'WhatsApp', sub: '+504 9864-0439', brand: true },
  { icon: 'phone', label: 'Llamar', sub: '+504 2540-0000' },
  { icon: 'mail', label: 'Correo', sub: 'info@lockr.hn' },
  { icon: 'alert', label: 'Reclamo', sub: 'Reportar incidencia' },
];

export default function SoporteScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const profile = useAuthStore((s) => s.profile);
  const firstName = (profile?.name || '').trim().split(/\s+/)[0] || '';

  const openWhatsApp = () => {
    Linking.openURL(WA_LINK).catch(() => toast('No se pudo abrir WhatsApp'));
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 20 }}>
          <Txt w={800} style={{ fontSize: 24, letterSpacing: -0.7, marginBottom: 6 }}>
            Soporte
          </Txt>
          <Txt w={500} style={{ fontSize: 13.5, color: colors.gray, marginBottom: 22 }}>
            Estamos para ayudarte{firstName ? `, ${firstName}` : ''}.
          </Txt>

          {/* contact tiles */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
            {TILES.map((t) => (
              <Pressable key={t.label} onPress={() => (t.brand ? openWhatsApp() : toast(`Abriendo ${t.label}`))} style={{ width: '47.5%' }}>
                <Card style={{ padding: 16 }}>
                  <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
                    <Icon name={t.icon} size={21} color={colors.cream} />
                  </View>
                  <Txt w={700} style={{ fontSize: 14.5, color: colors.cream }}>
                    {t.label}
                  </Txt>
                  <Txt w={500} style={{ fontSize: 11.5, color: colors.gray, marginTop: 1 }}>
                    {t.sub}
                  </Txt>
                </Card>
              </Pressable>
            ))}
          </View>

          {/* horarios de atención */}
          <Card style={{ padding: 16, marginBottom: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <Icons.clock size={17} color={colors.lime} />
              <Txt w={700} style={{ fontSize: 14.5, color: colors.cream }}>
                Horarios de atención
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
              <Txt w={500} style={{ fontSize: 13, color: colors.gray }}>
                Lunes a Viernes
              </Txt>
              <Txt w={600} style={{ fontSize: 13, color: colors.cream }}>
                8:00 a.m. – 5:00 p.m.
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Txt w={500} style={{ fontSize: 13, color: colors.gray }}>
                Sábado
              </Txt>
              <Txt w={600} style={{ fontSize: 13, color: colors.cream }}>
                8:00 a.m. – 12:00 p.m.
              </Txt>
            </View>
          </Card>

          <Txt w={700} style={{ fontSize: 13, color: colors.gray, marginBottom: 12, marginLeft: 2 }}>
            Preguntas frecuentes
          </Txt>
          <Card style={{ overflow: 'hidden' }}>
            {FAQS.map((q, i) => (
              <Pressable
                key={q}
                onPress={() => toast('Abriendo respuesta')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 15, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: colors.hairline }}
              >
                <Txt w={600} style={{ flex: 1, fontSize: 13.5, color: colors.cream }}>
                  {q}
                </Txt>
                <Icons.chev size={16} color={colors.gray} />
              </Pressable>
            ))}
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

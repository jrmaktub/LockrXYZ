import * as Clipboard from 'expo-clipboard';
import { useRef, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { Icon, Icons } from '@/components/icons';
import { AppBar, Button, Card, ScreenBody, ScreenContainer, Txt, useToast } from '@/components/ui';
import { ADDR_TO_SHIPPING, SHIPPING } from '@/data/mock';
import { useAddresses } from '@/hooks/useFirestoreData';
import { useAuthStore } from '@/store/auth-store';
import type { Address } from '@/types';
import { colors } from '@/theme/tokens';

const PICKUPS = [
  {
    city: 'San Pedro Sula',
    address: 'Barrio Los Andes, 4 calle entre 14 y 15 avenida, casa #95',
    query: 'Barrio Los Andes, 4 calle entre 14 y 15 avenida, casa #95, San Pedro Sula, Honduras',
  },
];

const WAZE_BLUE = '#33CCFF';
const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const wazeUrl = (q: string) => `https://waze.com/ul?q=${encodeURIComponent(q)}&navigate=yes`;

function openUrl(url: string, onError: () => void) {
  Linking.openURL(url).catch(onError);
}

/** One field with a subtle inline copy button (EconoCargo-style). */
function CopyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    toast(`${label} copiado`);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1300);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Txt style={{ flex: 1, fontSize: 12.5 }}>
        <Txt w={700} style={{ color: colors.gray }}>{label}: </Txt>
        <Txt w={600} mono={mono} style={{ color: colors.text }}>{value}</Txt>
      </Txt>
      <Pressable onPress={copy} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Copiar ${label}`} style={{ padding: 3 }}>
        {copied ? <Icons.check size={15} sw={2.6} color={colors.lime} /> : <Icons.copy size={15} color={colors.gray} />}
      </Pressable>
    </View>
  );
}

function AddressCard({ a, name, casillero }: { a: Address; name: string; casillero: string }) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const fullName = `${parts[0] || ''}${parts.length > 1 ? ' ' + parts[parts.length - 1] : ''}`;
  const recipient = `${fullName} ${casillero} - ${a.type}`;
  const svc = SHIPPING[ADDR_TO_SHIPPING[a.type]];

  return (
    <Card style={{ overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.hairline }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1, minWidth: 0 }}>
          <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: colors.limeSoft, borderWidth: 1, borderColor: colors.limeLine, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={a.icon} size={19} color={colors.lime} />
          </View>
          <View style={{ minWidth: 0 }}>
            <Txt w={800} style={{ fontSize: 15 }}>
              {a.type}
            </Txt>
            <Txt w={600} style={{ fontSize: 11, color: colors.gray }}>
              {a.name}
            </Txt>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ backgroundColor: colors.limeSoft, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 8 }}>
            <Txt mono w={700} style={{ fontSize: 11, color: colors.lime }}>
              {svc.tiered ? 'desde ' : ''}US${svc.rate}/lb
            </Txt>
          </View>
          <Txt w={600} style={{ fontSize: 10.5, color: colors.gray, marginTop: 4 }}>
            {svc.eta}
          </Txt>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}>
        <CopyRow label="País o región" value="Estados Unidos" />
        <CopyRow label="Nombre completo" value={recipient} />
        <CopyRow label="Teléfono" value={a.phone} mono />
        <CopyRow label="Dirección" value={a.line1} mono />
        <CopyRow label="Ciudad" value={a.city} />
        <CopyRow label="Estado" value={a.state} />
        <CopyRow label="Código postal" value={a.zip} mono />
      </View>
    </Card>
  );
}

export default function DireccionesScreen() {
  const toast = useToast();
  const { addresses } = useAddresses();
  const profile = useAuthStore((s) => s.profile);
  return (
    <ScreenContainer>
      <AppBar title="Direcciones" sub="Tu casillero y entrega" />
      <ScreenBody>
        <Txt w={700} style={{ fontSize: 13, color: colors.gray, marginBottom: 12, marginLeft: 2 }}>
          Direcciones de tu casillero en Miami
        </Txt>
        <View style={{ gap: 14, marginBottom: 26 }}>
          {addresses.map((a) => (
            <AddressCard key={a.type} a={a} name={profile?.name || ''} casillero={profile?.casillero || ''} />
          ))}
        </View>

        <Txt w={700} style={{ fontSize: 13, color: colors.gray, marginBottom: 12, marginLeft: 2 }}>
          Puntos de retiro en Honduras
        </Txt>
        <View style={{ gap: 12, marginBottom: 12 }}>
          {PICKUPS.map((p) => (
            <Card key={p.city} style={{ padding: 16 }}>
              <View>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.limeSoft, borderWidth: 1, borderColor: colors.limeLine, alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.pin size={20} color={colors.lime} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt w={700} style={{ fontSize: 14.5 }}>
                      {p.city}
                    </Txt>
                    <Txt w={500} style={{ fontSize: 12.5, color: colors.gray, marginTop: 2, lineHeight: 18 }}>
                      {p.address}
                    </Txt>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Button
                    variant="ghost"
                    onPress={() => openUrl(mapsUrl(p.query), () => toast('No se pudo abrir el mapa'))}
                    icon={<Icons.pin size={16} sw={2.2} color={colors.lime} />}
                    label="Google Maps"
                    textColor={colors.lime}
                    fontSize={13.5}
                    style={{ flex: 1, paddingVertical: 12, borderColor: colors.limeLine }}
                  />
                  <Button
                    variant="ghost"
                    onPress={() => openUrl(wazeUrl(p.query), () => toast('No se pudo abrir Waze'))}
                    icon={<Icons.arrowR size={16} sw={2.2} color={WAZE_BLUE} />}
                    label="Waze"
                    textColor={WAZE_BLUE}
                    fontSize={13.5}
                    style={{ flex: 1, paddingVertical: 12, borderColor: 'rgba(51,204,255,0.4)' }}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScreenBody>
    </ScreenContainer>
  );
}

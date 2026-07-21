import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, View } from 'react-native';

import { GuiaCard } from '@/components/GuiaCards';
import { Icon, Icons, type IconName } from '@/components/icons';
import { AppBar, Button, Card, Input, ScreenBody, ScreenContainer, Txt, useToast } from '@/components/ui';
import { useGuias } from '@/hooks/useFirestoreData';
import { buildTrackingUrl, CARRIERS, type Carrier, detectCarrier, normalizeTracking } from '@/lib/carriers';
import type { Guia } from '@/types';
import { fetchTrackingStatus, type StatusTone, type TrackStatus } from '@/lib/tracking';
import { colors } from '@/theme/tokens';

type Result =
  | { kind: 'idle' }
  | { kind: 'internal'; guia: Guia }
  | { kind: 'carrier'; carrier: Carrier }
  | { kind: 'manual' };

type Live = { state: 'idle' | 'loading' | 'ok' | 'fetching' | 'error'; data?: TrackStatus };

const STATUS_GREEN = '#3FC380';
const STATUS_AMBER = '#E6B450';
const toneFg = (t: StatusTone) =>
  t === 'ok' ? STATUS_GREEN : t === 'danger' ? colors.danger : t === 'muted' ? STATUS_AMBER : colors.lime;
const toneBg = (t: StatusTone) =>
  t === 'ok' ? 'rgba(63,195,128,0.15)' : t === 'danger' ? colors.dangerSoft : t === 'muted' ? 'rgba(230,180,80,0.14)' : colors.limeSoft;
const toneIcon = (s: TrackStatus): IconName =>
  s.milestone === 'delivered' ? 'checkCircle' : s.tone === 'danger' ? 'alert' : s.milestone === 'in_transit' ? 'truck' : 'clock';

const fmtDate = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('es-HN', { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
};

const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

export default function BuscarScreen() {
  const toast = useToast();
  const { guias } = useGuias();
  const [num, setNum] = useState('');
  const [result, setResult] = useState<Result>({ kind: 'idle' });
  const [live, setLive] = useState<Live>({ state: 'idle' });
  const reqId = useRef(0);

  const runLive = (n: string, carrierName?: string) => {
    const id = ++reqId.current;
    setLive({ state: 'loading' });
    withTimeout(fetchTrackingStatus(n, carrierName), 25000)
      .then((s) => {
        if (id !== reqId.current) return;
        if (s === 'fetching') setLive({ state: 'fetching' });
        else setLive(s ? { state: 'ok', data: s } : { state: 'error' });
      })
      .catch(() => id === reqId.current && setLive({ state: 'error' }));
  };

  const buscar = () => {
    const n = normalizeTracking(num);
    if (!n) return;
    reqId.current++; // cancel any in-flight
    const g = guias.find((x) => normalizeTracking(x.tracking) === n);
    if (g) {
      setResult({ kind: 'internal', guia: g });
      setLive({ state: 'idle' });
      return;
    }
    const c = detectCarrier(num);
    setResult(c ? { kind: 'carrier', carrier: c } : { kind: 'manual' });
    runLive(n, c?.carrier);
  };

  const openCarrier = (c: Carrier) => {
    Linking.openURL(buildTrackingUrl(c, num)).catch(() => toast('No se pudo abrir el enlace'));
  };

  const copyNum = async () => {
    await Clipboard.setStringAsync(normalizeTracking(num));
    toast('Número copiado');
  };

  const activeCarrier = result.kind === 'carrier' ? result.carrier.carrier : null;

  const chipRow = (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
      {CARRIERS.map((c) => {
        const on = activeCarrier === c.carrier;
        return (
          <Pressable
            key={c.carrier}
            onPress={() => {
              setResult({ kind: 'carrier', carrier: c });
              runLive(normalizeTracking(num), c.carrier);
            }}
            style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: 9999, backgroundColor: on ? colors.limeSoft : colors.panel2, borderWidth: 1, borderColor: on ? colors.limeLine : colors.hairline2 }}
          >
            <Txt w={700} style={{ fontSize: 12.5, color: on ? colors.lime : colors.gray }}>
              {c.carrier}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <ScreenContainer>
      <AppBar title="Buscar tracking" sub="Rastrea un paquete por su número" />
      <ScreenBody>
        <Card style={{ padding: 18, marginBottom: 22 }}>
          <Input
            label="Número de seguimiento"
            mono
            adorn={<Icons.scan size={18} color={colors.gray} />}
            value={num}
            onChangeText={(t) => {
              setNum(t.toUpperCase());
              setResult({ kind: 'idle' });
              setLive({ state: 'idle' });
            }}
            placeholder="1Z… · TBA… · 9400…"
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={buscar}
            containerStyle={{ marginBottom: 12 }}
          />
          <Txt w={500} style={{ fontSize: 12, color: colors.gray, lineHeight: 18, marginBottom: 16 }}>
            Pega el número que te dio la tienda o transportista. Detectamos quién lo envía y revisamos si ya llegó a nuestra bodega de Miami.
          </Txt>
          <Button variant="primary" onPress={buscar} disabled={!num.trim()} icon={<Icons.search size={18} sw={2.3} color={colors.onLime} />} label="Rastrear" style={{ paddingVertical: 15 }} />
        </Card>

        {result.kind === 'idle' && (
          <View style={{ alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 }}>
            <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Icons.box size={34} sw={1.6} color={colors.cream} />
            </View>
            <Txt w={700} style={{ fontSize: 16, marginBottom: 5 }}>
              Aún no hay paquete
            </Txt>
            <Txt w={500} style={{ fontSize: 13, color: colors.gray, textAlign: 'center', maxWidth: 240, lineHeight: 19 }}>
              Cuando rastrees un número, su información aparecerá aquí.
            </Txt>
          </View>
        )}

        {result.kind === 'internal' && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12, marginLeft: 2 }}>
              <Icons.checkCircle size={16} color={colors.ok} />
              <Txt w={700} style={{ fontSize: 12.5, color: colors.ok }}>
                Paquete encontrado en bodega Miami
              </Txt>
            </View>
            <GuiaCard g={result.guia} onPress={() => router.push(`/tracking/${result.guia.id}`)} />
          </View>
        )}

        {(result.kind === 'carrier' || result.kind === 'manual') && (
          <Card style={{ padding: 18, borderWidth: 1, borderColor: result.kind === 'carrier' ? colors.limeLine : colors.hairline }}>
            {/* live status */}
            {live.state === 'loading' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <ActivityIndicator color={colors.lime} />
                <Txt w={600} style={{ fontSize: 13, color: colors.gray }}>
                  Consultando estado en vivo…
                </Txt>
              </View>
            )}
            {live.state === 'fetching' && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(230,180,80,0.14)', borderRadius: 13, padding: 13, marginBottom: 16 }}>
                <Icons.clock size={20} color={STATUS_AMBER} />
                <Txt w={500} style={{ flex: 1, fontSize: 12.5, color: colors.gray, lineHeight: 18 }}>
                  Estamos obteniendo el estado con el transportista. Vuelve a tocar <Txt w={700} style={{ color: colors.cream }}>Rastrear</Txt> en unos segundos.
                </Txt>
              </View>
            )}
            {live.state === 'ok' && live.data && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: toneBg(live.data.tone), borderRadius: 13, padding: 13, marginBottom: 16 }}>
                <Icon name={toneIcon(live.data)} size={22} color={toneFg(live.data.tone)} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt w={800} style={{ fontSize: 15.5, color: toneFg(live.data.tone) }}>
                    {live.data.label}
                  </Txt>
                  {live.data.lastEvent ? (
                    <Txt w={500} style={{ fontSize: 12, color: colors.gray, marginTop: 2 }} numberOfLines={2}>
                      {live.data.lastEvent}
                    </Txt>
                  ) : null}
                  {live.data.location || live.data.datetime ? (
                    <Txt w={500} style={{ fontSize: 11.5, color: colors.textMut, marginTop: 2 }}>
                      {[live.data.location, fmtDate(live.data.datetime)].filter(Boolean).join(' · ')}
                    </Txt>
                  ) : null}
                </View>
              </View>
            )}

            {/* carrier header */}
            {result.kind === 'carrier' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.limeSoft, borderWidth: 1, borderColor: colors.limeLine, alignItems: 'center', justifyContent: 'center' }}>
                  <Txt mono w={800} style={{ fontSize: 13, color: colors.lime }}>
                    {result.carrier.carrier.slice(0, 3).toUpperCase()}
                  </Txt>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt w={800} style={{ fontSize: 16 }}>
                    {result.carrier.carrier}
                  </Txt>
                  <Txt w={500} style={{ fontSize: 12, color: colors.textMut, marginTop: 1 }}>
                    Transportista detectado
                  </Txt>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <Icons.alert size={16} color={colors.textMut} />
                <Txt w={600} style={{ flex: 1, fontSize: 13, color: colors.cream, lineHeight: 19 }}>
                  No reconocimos el transportista por el formato. Elige cuál es:
                </Txt>
              </View>
            )}

            {/* tracking number + copy */}
            <Pressable onPress={copyNum} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
              <Txt mono w={600} style={{ flex: 1, fontSize: 13.5, color: colors.cream, letterSpacing: 0.4 }}>
                {normalizeTracking(num)}
              </Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icons.copy size={15} color={colors.gray} />
                <Txt w={700} style={{ fontSize: 12, color: colors.gray }}>
                  Copiar
                </Txt>
              </View>
            </Pressable>

            {result.kind === 'carrier' && (
              <Button variant="primary" onPress={() => openCarrier(result.carrier)} label={`Ver detalle en ${result.carrier.carrier}`} iconRight={<Icons.arrowR size={18} sw={2.4} color={colors.onLime} />} style={{ paddingVertical: 15 }} />
            )}

            {live.state === 'error' && (
              <Txt w={500} style={{ fontSize: 11.5, color: colors.textMut, marginTop: 12 }}>
                No pudimos obtener el estado en vivo ahora. Ábrelo en el transportista.
              </Txt>
            )}

            <Txt w={500} style={{ fontSize: 11.5, color: colors.textDim, marginTop: 14 }}>
              {result.kind === 'carrier' ? `¿No es ${result.carrier.carrier}? Elige manualmente:` : 'Transportistas:'}
            </Txt>
            {chipRow}
          </Card>
        )}
      </ScreenBody>
    </ScreenContainer>
  );
}

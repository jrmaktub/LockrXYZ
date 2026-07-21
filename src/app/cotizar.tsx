import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';

import { Icon, Icons, type IconName } from '@/components/icons';
import { AppBar, Input, ScreenBody, ScreenContainer, Txt } from '@/components/ui';
import { HANDLING_USD, ISV, maritimoRate, SHIPPING, type ShippingKey } from '@/data/mock';
import { useReduceMotion } from '@/utils/useReduceMotion';
import { colors } from '@/theme/tokens';

const TIPOS: ShippingKey[] = ['aereo', 'maritimo', 'express'];
const LPS = 24.7; // Lempiras por USD (aprox)
const toLps = (usd: number) => Math.round(usd * LPS);

// fire-and-forget haptics (no-op where unsupported)
const tapLight = () => Haptics.selectionAsync().catch(() => {});
const tapWin = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

// per-service reward line — gives every choice a little dopamine hit
function reward(tipo: ShippingKey, billable: number): { icon: IconName; text: string } | null {
  if (tipo === 'maritimo') {
    const save = (SHIPPING.aereo.rate - maritimoRate(billable)) * billable;
    return { icon: 'gift', text: `Ahorras US$ ${save.toFixed(2)} vs aéreo` };
  }
  if (tipo === 'express') return { icon: 'bolt', text: 'Servicio prioritario con manejo preferente' };
  return null;
}
const SEG_W = 52; // unit-toggle segment width

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Txt w={700} style={{ fontSize: 13, marginBottom: 10 }}>
      {children}
    </Txt>
  );
}

function Row({ k, v, dim }: { k: string; v: string; dim?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Txt w={500} style={{ color: dim ? colors.gray : colors.cream }}>
        {k}
      </Txt>
      <Txt mono w={700} style={{ color: dim ? colors.gray : colors.cream }}>
        {v}
      </Txt>
    </View>
  );
}

/** Gamified reward line — pops in (and re-pops on every service change). */
function Reward({ tipo, billable, reduce }: { tipo: ShippingKey; billable: number; reduce: boolean }) {
  const p = useRef(new Animated.Value(reduce ? 1 : 0)).current;
  useEffect(() => {
    if (reduce) {
      p.setValue(1);
      return;
    }
    p.setValue(0);
    Animated.spring(p, { toValue: 1, stiffness: 220, damping: 15, useNativeDriver: true }).start();
  }, [tipo, reduce, p]);
  const r = reward(tipo, billable);
  if (!r) return null;
  const { icon, text } = r;
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
        backgroundColor: colors.limeSoft,
        borderWidth: 1,
        borderColor: colors.limeLine,
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 12,
        opacity: p,
        transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
      }}
    >
      <Icon name={icon} size={15} color={colors.lime} />
      <Txt w={700} style={{ flex: 1, fontSize: 12, color: colors.lime }}>
        {text}
      </Txt>
    </Animated.View>
  );
}

/** Service card with a tactile press-scale + a check that springs in on select. */
function ServiceChip({ k, on, reduce, onPress }: { k: ShippingKey; on: boolean; reduce: boolean; onPress: () => void }) {
  const svc = SHIPPING[k];
  const scale = useRef(new Animated.Value(1)).current;
  const check = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    if (reduce) {
      check.setValue(on ? 1 : 0);
      return;
    }
    Animated.spring(check, { toValue: on ? 1 : 0, stiffness: 260, damping: 16, useNativeDriver: true }).start();
  }, [on, reduce, check]);

  const press = (to: number) => !reduce && Animated.spring(scale, { toValue: to, stiffness: 300, damping: 18, useNativeDriver: true }).start();

  return (
    <Pressable onPress={onPress} onPressIn={() => press(0.97)} onPressOut={() => press(1)} style={{ flex: 1 }}>
      <Animated.View
        style={{
          transform: [{ scale }],
          padding: 13,
          borderRadius: 16,
          backgroundColor: on ? colors.limeSoft : colors.panel2,
          borderWidth: on ? 1.5 : 1,
          borderColor: on ? colors.lime : colors.hairline2,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, minHeight: 22 }}>
          <Icon name={svc.icon} size={22} color={on ? colors.lime : colors.gray} />
          <Animated.View style={{ opacity: check, transform: [{ scale: check.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }] }}>
            <Icons.check size={16} sw={3} color={colors.lime} />
          </Animated.View>
        </View>
        <Txt w={800} style={{ fontSize: 14 }} numberOfLines={1}>
          {svc.label}
        </Txt>
        <Txt w={700} style={{ fontSize: 8.5, lineHeight: 12, height: 12, letterSpacing: 0.7, color: colors.gray, marginTop: 3 }}>
          {svc.tiered ? 'DESDE' : ''}
        </Txt>
        <Txt mono w={700} style={{ fontSize: 11.5, color: on ? colors.lime : colors.cream }} numberOfLines={1}>
          US${svc.rate}/lb
        </Txt>
        <Txt mono w={600} style={{ fontSize: 10, color: colors.gray, marginTop: 1 }} numberOfLines={1}>
          L{toLps(svc.rate)}/lb
        </Txt>
        <Txt w={600} style={{ fontSize: 9.5, color: colors.gray, marginTop: 2 }} numberOfLines={1}>
          {svc.eta}
        </Txt>
      </Animated.View>
    </Pressable>
  );
}

export default function CotizarScreen() {
  const reduce = useReduceMotion();
  const [tipo, setTipo] = useState<ShippingKey>('aereo');
  const [desc, setDesc] = useState('');
  const [peso, setPeso] = useState('');
  const [dims, setDims] = useState({ ancho: '', alto: '', largo: '' });
  const [unidad, setUnidad] = useState<'in' | 'ft'>('in');

  const w = parseFloat(peso) || 0;
  const vol = (parseFloat(dims.ancho) || 0) * (parseFloat(dims.alto) || 0) * (parseFloat(dims.largo) || 0);
  const volFactor = unidad === 'in' ? 166 : 0.096;
  const volWeight = vol > 0 ? vol / volFactor : 0;
  const billable = Math.max(w, volWeight);
  const rate = tipo === 'maritimo' ? maritimoRate(billable) : SHIPPING[tipo].rate;
  const base = billable * rate; // flete
  const handling = billable > 0 ? HANDLING_USD : 0;
  const tax = (base + handling) * ISV; // impuestos (ISV 15%)
  const total = base + handling + tax;
  const has = billable > 0;

  const num = (t: string) => t.replace(/[^0-9.]/g, '');

  // --- micro-interactions ---
  // 1) hero total count-up roll
  const totalAnim = useRef(new Animated.Value(total)).current;
  const [display, setDisplay] = useState(total);
  useEffect(() => {
    const id = totalAnim.addListener(({ value }) => setDisplay(value));
    return () => totalAnim.removeListener(id);
  }, [totalAnim]);
  useEffect(() => {
    if (reduce) {
      totalAnim.setValue(total);
      setDisplay(total);
      return;
    }
    Animated.timing(totalAnim, { toValue: total, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [total, reduce, totalAnim]);

  // 2) estimate card reveal (border -> lime + breakdown fade/slide)
  const reveal = useRef(new Animated.Value(has ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(has ? 1 : 0)).current;
  useEffect(() => {
    if (reduce) {
      reveal.setValue(has ? 1 : 0);
      borderAnim.setValue(has ? 1 : 0);
      return;
    }
    Animated.spring(reveal, { toValue: has ? 1 : 0, stiffness: 180, damping: 20, mass: 0.8, useNativeDriver: true }).start();
    Animated.timing(borderAnim, { toValue: has ? 1 : 0, duration: 220, useNativeDriver: false }).start();
  }, [has, reduce, reveal, borderAnim]);
  const cardBorder = borderAnim.interpolate({ inputRange: [0, 1], outputRange: [colors.hairline2, colors.limeLine] });

  // 3) unit-toggle sliding pill
  const pill = useRef(new Animated.Value(unidad === 'in' ? 0 : 1)).current;
  useEffect(() => {
    if (reduce) {
      pill.setValue(unidad === 'in' ? 0 : 1);
      return;
    }
    Animated.spring(pill, { toValue: unidad === 'in' ? 0 : 1, stiffness: 260, damping: 22, useNativeDriver: true }).start();
  }, [unidad, reduce, pill]);
  const pillX = pill.interpolate({ inputRange: [0, 1], outputRange: [0, SEG_W] });

  // 4) hero total "punch" when the amount changes + win-haptic when the estimate first appears
  const punch = useRef(new Animated.Value(0)).current;
  const wasHas = useRef(has);
  useEffect(() => {
    if (has && !wasHas.current) tapWin();
    wasHas.current = has;
    if (reduce || !has) return;
    punch.setValue(0);
    Animated.sequence([
      Animated.timing(punch, { toValue: 1, duration: 110, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(punch, { toValue: 0, stiffness: 220, damping: 12, useNativeDriver: true }),
    ]).start();
  }, [total, has, reduce, punch]);
  const punchScale = punch.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <ScreenContainer>
      <AppBar title="Cotizar envío" sub="Estima el costo de tu paquete" />
      <ScreenBody>
        <Label>Tipo de servicio</Label>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {TIPOS.map((k) => (
            <ServiceChip
              key={k}
              k={k}
              on={tipo === k}
              reduce={reduce}
              onPress={() => {
                if (tipo !== k) tapLight();
                setTipo(k);
              }}
            />
          ))}
        </View>

        <Input label="Descripción del contenido" adorn={<Icons.box size={18} color={colors.gray} />} value={desc} onChangeText={setDesc} placeholder="Ej. Sony PlayStation 5" containerStyle={{ marginBottom: 20 }} style={{ backgroundColor: colors.panel3 }} />

        <Input
          label="Peso"
          adorn={<Icons.weight size={18} color={colors.gray} />}
          rightAdorn={
            <Txt w={700} style={{ fontSize: 13, color: colors.gray, paddingRight: 6 }}>
              lb
            </Txt>
          }
          value={peso}
          onChangeText={(t) => setPeso(num(t))}
          placeholder="0.0"
          keyboardType="decimal-pad"
          containerStyle={{ marginBottom: 20 }}
          style={{ backgroundColor: colors.panel3 }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Txt w={700} style={{ fontSize: 13 }}>
            Dimensiones
          </Txt>
          <View style={{ flexDirection: 'row', backgroundColor: colors.panel2, borderRadius: 10, padding: 3, borderWidth: 1, borderColor: colors.hairline2 }}>
            <Animated.View
              pointerEvents="none"
              style={{ position: 'absolute', top: 3, bottom: 3, left: 3, width: SEG_W, borderRadius: 7, backgroundColor: colors.lime, transform: [{ translateX: pillX }] }}
            />
            {(['in', 'ft'] as const).map((u) => (
              <Pressable
                key={u}
                onPress={() => {
                  if (unidad !== u) tapLight();
                  setUnidad(u);
                }}
                style={{ width: SEG_W, paddingVertical: 5, alignItems: 'center', borderRadius: 7 }}
              >
                <Txt w={700} style={{ fontSize: 11.5, color: unidad === u ? colors.onLime : colors.gray }}>
                  {u === 'in' ? 'Pulg' : 'Pies'}
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 22 }}>
          {([['ancho', 'Ancho'], ['alto', 'Alto'], ['largo', 'Largo']] as const).map(([k, l]) => (
            <View key={k} style={{ flex: 1 }}>
              <Input value={dims[k]} onChangeText={(t) => setDims((d) => ({ ...d, [k]: num(t) }))} placeholder="0" keyboardType="decimal-pad" style={{ textAlign: 'center', paddingHorizontal: 6, backgroundColor: colors.panel3 }} />
              <Txt w={600} style={{ textAlign: 'center', fontSize: 10.5, color: colors.gray, marginTop: 6 }}>
                {l}
              </Txt>
            </View>
          ))}
        </View>

        {/* live estimate */}
        <Animated.View style={{ borderRadius: 20, padding: 18, marginBottom: 16, backgroundColor: has ? colors.panel3 : colors.panel2, borderWidth: 1, borderColor: cardBorder }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: has ? 14 : 0 }}>
            <Txt w={700} style={{ fontSize: 12.5, color: colors.gray }}>
              Estimado de envío
            </Txt>
            <Animated.View style={{ transform: [{ scale: punchScale }] }}>
              <Txt mono w={700} style={{ fontSize: 32, color: has ? colors.lime : colors.textDim, letterSpacing: -0.6 }}>
                US$ {display.toFixed(2)}
              </Txt>
            </Animated.View>
          </View>
          {has ? (
            <Animated.View style={{ gap: 7, borderTopWidth: 1, borderTopColor: colors.hairline, paddingTop: 13, opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }}>
              <Row k="Total en Lempiras" v={`L ${toLps(display)}`} />
              {w > 0 && <Row k="Peso real" v={`${w.toFixed(1)} lb`} dim={volWeight > w} />}
              {vol > 0 && <Row k="Peso volumétrico" v={`${volWeight.toFixed(1)} lb`} dim={volWeight <= w} />}
              <Row k={`Flete (${billable.toFixed(1)} lb × US$${rate})`} v={`US$ ${base.toFixed(2)}`} />
              <Row k="Manejo y procesamiento" v={`US$ ${handling.toFixed(2)}`} />
              <Row k="Impuestos (ISV 15%)" v={`US$ ${tax.toFixed(2)}`} />
              <Reward tipo={tipo} billable={billable} reduce={reduce} />
            </Animated.View>
          ) : (
            <Txt w={500} style={{ fontSize: 12, color: colors.gray, marginTop: 6 }}>
              Ingresa peso o dimensiones para ver tu estimado.
            </Txt>
          )}
        </Animated.View>
      </ScreenBody>
    </ScreenContainer>
  );
}

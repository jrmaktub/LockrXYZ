import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';

import { Icons } from '@/components/icons';
import { AppBar, Button, Card, ScreenBody, ScreenContainer, StatusBadge, Timeline, Txt } from '@/components/ui';
import { buildTimeline, STAGE_INDEX, STAGES } from '@/data/mock';
import { useGuias } from '@/hooks/useFirestoreData';
import { colors, limeGlow, limeGlowSm } from '@/theme/tokens';
import { useToast } from '@/components/ui';
import { useReduceMotion } from '@/utils/useReduceMotion';

function Chip({ label, value, accent, border }: { label: string; value: string | number; accent?: boolean; border?: boolean }) {
  return (
    <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', borderLeftWidth: border ? 1 : 0, borderRightWidth: border ? 1 : 0, borderColor: colors.hairline }}>
      <Txt w={600} style={{ fontSize: 10.5, color: colors.textMut, marginBottom: 3 }}>
        {label}
      </Txt>
      <Txt mono w={800} style={{ fontSize: 15, color: accent ? colors.lime : colors.text }}>
        {value}
      </Txt>
    </View>
  );
}

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const { guias, loading } = useGuias();
  const g = guias.find((x) => x.id === id);
  const pct = g ? (STAGE_INDEX[g.current] / (STAGES.length - 1)) * 100 : 0;

  // signature moment: the plane travels the route on open.
  // Hooks must run unconditionally, so this stays above the not-found guard below.
  const reduce = useReduceMotion();
  const progress = useRef(new Animated.Value(reduce ? pct : 0)).current;
  useEffect(() => {
    if (!g) return;
    if (reduce) {
      progress.setValue(pct);
      return;
    }
    const anim = Animated.timing(progress, { toValue: pct, duration: 600, delay: 120, easing: Easing.out(Easing.cubic), useNativeDriver: false });
    anim.start();
    return () => anim.stop();
  }, [progress, pct, reduce, g]);
  const widthPct = progress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  if (!g) {
    return (
      <ScreenContainer>
        <AppBar title="Guía" />
        <ScreenBody>
          <Txt w={600} style={{ textAlign: 'center', marginTop: 40, color: colors.textMut }}>
            {loading ? 'Cargando...' : 'No se encontró esta guía.'}
          </Txt>
        </ScreenBody>
      </ScreenContainer>
    );
  }

  const timeline = buildTimeline(g.current, g.times);
  const available = g.current === 'bodega';

  return (
    <ScreenContainer>
      <AppBar
        title={`Guía #${g.id}`}
        sub={g.tracking}
        right={
          <Pressable
            onPress={() => toast(`Tracking #${g.tracking}`)}
            style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icons.copy size={18} color={colors.text} />
          </Pressable>
        }
      />
      <ScreenBody>
        {/* hero */}
        <LinearGradient colors={['#24251A', '#181910']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, borderRadius: 18, borderWidth: 1, borderColor: colors.limeLine, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt w={600} style={{ fontSize: 11, color: colors.gray, marginBottom: 3 }}>
                {g.store} · {g.note}
              </Txt>
              <Txt w={800} style={{ fontSize: 19, letterSpacing: -0.4 }}>
                {g.desc}
              </Txt>
            </View>
            <StatusBadge stage={g.current} />
          </View>

          {/* route */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Icons.warehouse size={14} color={colors.gray} />
              <Txt w={700} style={{ fontSize: 11, color: colors.gray }}>
                Miami
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Txt w={700} style={{ fontSize: 11, color: colors.gray }}>
                Honduras
              </Txt>
              <Icons.pin size={14} color={colors.lime} />
            </View>
          </View>
          <View style={{ height: 6, borderRadius: 9999, backgroundColor: colors.bg0, justifyContent: 'center' }}>
            <Animated.View style={[{ position: 'absolute', left: 0, top: 0, bottom: 0, width: widthPct, borderRadius: 9999, overflow: 'hidden' }, limeGlowSm]}>
              <LinearGradient colors={[colors.limeDeep, colors.lime]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 9999 }} />
            </Animated.View>
            <Animated.View style={[{ position: 'absolute', left: widthPct, marginLeft: -13, top: -10, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.lime, borderWidth: 3, borderColor: colors.bg1, alignItems: 'center', justifyContent: 'center' }, limeGlow]}>
              <Icons.planeUp size={14} sw={2.4} color={colors.onLime} />
            </Animated.View>
          </View>
          {available ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 }}>
              <Icons.qr size={15} color={colors.lime} />
              <Txt w={800} style={{ fontSize: 13.5, color: colors.lime }}>
                Listo para retiro
              </Txt>
            </View>
          ) : (
            <Txt w={600} style={{ textAlign: 'center', marginTop: 14, fontSize: 12.5, color: colors.textMut }}>
              Entrega estimada ·{' '}
              <Txt w={800} style={{ color: colors.lime }}>
                {g.eta}
              </Txt>
            </Txt>
          )}
        </LinearGradient>

        {available && (
          <Button variant="primary" onPress={() => router.push('/(tabs)/codigo')} icon={<Icons.qr size={19} color={colors.onLime} />} label="Retirar con código QR" style={{ paddingVertical: 16, marginBottom: 16 }} />
        )}

        {/* info chips */}
        <Card style={{ flexDirection: 'row', paddingVertical: 4, marginBottom: 20 }}>
          <Chip label="Peso" value={`${g.weight} lb`} />
          <Chip label="Items" value={g.items} border />
          <Chip label="Valor" value={`L ${g.price}`} accent />
        </Card>

        {/* timeline */}
        <Txt w={700} style={{ fontSize: 15, letterSpacing: -0.3, marginBottom: 4 }}>
          Seguimiento
        </Txt>
        <Txt w={500} style={{ fontSize: 12, color: colors.textMut, marginBottom: 18 }}>
          Estado en tiempo real de tu paquete
        </Txt>
        <Timeline timeline={timeline} />
      </ScreenBody>
    </ScreenContainer>
  );
}

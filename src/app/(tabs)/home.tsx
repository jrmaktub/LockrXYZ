import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MiniGuia } from '@/components/GuiaCards';
import { Icon, Icons, type IconName } from '@/components/icons';
import { Logo, LogoMark } from '@/components/Logo';
import { TransitFooter } from '@/components/TransitFooter';
import { Card, Input, ScreenContainer, Txt } from '@/components/ui';
import { BANNERS, type Banner as BannerT } from '@/data/mock';
import { useGuias, useNotifs } from '@/hooks/useFirestoreData';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme/tokens';

const ACTIONS: { route: string; label: string; icon: IconName }[] = [
  { route: '/cotizar', label: 'Cotizar', icon: 'calc' },
  { route: '/buscar', label: 'Rastrear', icon: 'search' },
  { route: '/direcciones', label: 'Mis direcciones', icon: 'pin' },
  { route: '/pagar', label: 'Pagar', icon: 'card' },
];

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setReduce(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return reduce;
}

/** A small "live" lime dot with a softly expanding ring — signals something is ready. */
function PulseDot({ reduce }: { reduce: boolean }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(p, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(p, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [p, reduce]);
  return (
    <View style={{ width: 8, height: 8, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.lime,
          opacity: p.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
          transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] }) }],
        }}
      />
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.lime }} />
    </View>
  );
}

/** One-time staggered fade + rise as the screen mounts. */
function SectionIn({ index, reduce, children }: { index: number; reduce: boolean; children: React.ReactNode }) {
  const p = useRef(new Animated.Value(reduce ? 1 : 0)).current;
  useEffect(() => {
    if (reduce) return;
    const anim = Animated.timing(p, { toValue: 1, duration: 420, delay: index * 80, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    anim.start();
    return () => anim.stop();
  }, [p, index, reduce]);
  const translateY = p.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  return <Animated.View style={{ opacity: p, transform: [{ translateY }] }}>{children}</Animated.View>;
}

const BANNER_TONES = {
  lime: { colors: ['#DEF16B', '#c4d94e'] as const, fg: '#20240B', kick: 'rgba(32,36,11,0.6)' },
  dark: { colors: ['#24251A', '#15160d'] as const, fg: colors.cream, kick: colors.lime },
  olive: { colors: ['#2C2D1A', '#3a3c22'] as const, fg: colors.cream, kick: colors.lime },
};

function Banner({ b }: { b: BannerT }) {
  const t = BANNER_TONES[b.tone];
  return (
    <Pressable onPress={() => router.push('/cotizar')}>
      <LinearGradient
        colors={t.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 270, minHeight: 116, borderRadius: 20, padding: 18, justifyContent: 'space-between', overflow: 'hidden' }}
      >
        {b.tone === 'lime' && (
          <View style={{ position: 'absolute', right: -16, bottom: -16, opacity: 0.2 }}>
            <Icons.truck size={92} sw={1.4} color="#20240B" />
          </View>
        )}
        <Txt w={700} style={{ fontSize: 12, letterSpacing: 0.6, color: t.kick }}>
          {b.kicker}
        </Txt>
        <View>
          <Txt w={800} style={{ fontSize: 20, color: t.fg, letterSpacing: -0.4, lineHeight: 22, marginBottom: 3 }}>
            {b.title}
          </Txt>
          <Txt w={500} style={{ fontSize: 12, color: t.fg, opacity: 0.85 }}>
            {b.sub}
          </Txt>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function StatCard({ label, value, icon, accent, onPress, reduce }: { label: string; value: number; icon: IconName; accent?: boolean; onPress: () => void; reduce: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const counter = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(reduce ? value : 0);
  const press = (to: number, duration: number) =>
    Animated.timing(scale, { toValue: to, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();

  // one-shot count-up from 0 -> value on mount
  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const id = counter.addListener(({ value: v }) => setDisplay(Math.round(v)));
    const anim = Animated.timing(counter, { toValue: value, duration: 700, delay: 120, easing: Easing.out(Easing.cubic), useNativeDriver: false });
    anim.start();
    return () => {
      counter.removeListener(id);
      anim.stop();
    };
  }, [counter, value, reduce]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => press(0.97, 120)}
      onPressOut={() => press(1, 160)}
      style={{ flex: 1 }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Card style={{ padding: 16, borderRadius: 18 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Txt w={600} style={{ fontSize: 12.5, color: colors.gray }}>
              {label}
            </Txt>
            <Icon name={icon} size={18} color={colors.lime} />
          </View>
          <Txt mono w={700} style={{ fontSize: 34, marginTop: 8, color: accent ? colors.lime : colors.text }}>
            {display}
          </Txt>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const profile = useAuthStore((s) => s.profile);
  const { guias } = useGuias();
  const { notifs } = useNotifs();
  const [q, setQ] = useState('');
  const unread = notifs.filter((n) => n.unread).length;
  const enTransito = guias.filter((g) => g.tab === 'transito' && g.current !== 'bodega').length;
  const disponible = guias.filter((g) => g.current === 'bodega').length;
  const query = q.trim().toLowerCase();
  const recientes = query
    ? guias.filter((g) => g.tracking.toLowerCase().includes(query) || g.desc.toLowerCase().includes(query))
    : guias.slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  const GreetIcon = hour >= 19 ? Icons.moon : Icons.sun;
  const nameParts = (profile?.name || '').trim().split(/\s+/).filter(Boolean);
  const displayName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` : nameParts[0] || '';

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* header */}
        <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 20, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo height={30} />
          <Pressable
            onPress={() => router.push('/notifs')}
            accessibilityRole="button"
            accessibilityLabel={unread > 0 ? `Notificaciones, ${unread} sin leer` : 'Notificaciones'}
            style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icons.bell size={20} color={colors.text} />
            {unread > 0 && <View style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lime }} />}
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
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

        <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
          <SectionIn index={0} reduce={reduce}>
          {/* greeting */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <GreetIcon size={15} color={colors.gray} />
            <Txt w={600} style={{ fontSize: 13, color: colors.gray }}>
              {greeting}
            </Txt>
          </View>
          <Txt w={800} style={{ fontSize: 23, letterSpacing: -0.7, marginBottom: 18 }}>
            {displayName}
          </Txt>

          {/* casillero card */}
          <LinearGradient colors={['#2C2D1A', '#20220f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 22, padding: 20, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(222,241,107,0.2)', overflow: 'hidden' }}>
            <View style={{ position: 'absolute', right: 18, top: 0, bottom: 0, justifyContent: 'center', opacity: 0.18 }}>
              <LogoMark size={72} variant="cream" />
            </View>
            <Txt w={700} style={{ fontSize: 12, color: colors.lime, letterSpacing: 0.6, marginBottom: 4 }}>
              MI CASILLERO
            </Txt>
            <View style={{ marginBottom: 4 }}>
              <Txt mono w={700} style={{ fontSize: 38, color: colors.cream, lineHeight: 40 }}>
                {profile?.casillero || '···'}
              </Txt>
            </View>
            <Txt w={500} style={{ fontSize: 13, color: colors.cream }}>
              {profile?.name || ''}
            </Txt>
          </LinearGradient>

          {/* listo para retirar — alerta destacada (pedida en el deck, slide HOME pt 2) */}
          {disponible > 0 && (
            <Pressable onPress={() => router.push('/(tabs)/guias')} style={{ marginBottom: 18 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13,
                  backgroundColor: colors.panel,
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 15,
                  borderWidth: 1,
                  borderColor: colors.limeLine,
                  overflow: 'hidden',
                }}
              >
                {/* thin lime accent on the leading edge */}
                <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3.5, backgroundColor: colors.lime }} />
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.limeSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.warehouse size={20} sw={2.1} color={colors.lime} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <PulseDot reduce={reduce} />
                    <Txt w={800} style={{ fontSize: 14.5, letterSpacing: -0.2, color: colors.cream }}>
                      Listo para retirar
                    </Txt>
                  </View>
                  <Txt w={500} style={{ fontSize: 12, color: colors.gray, marginTop: 3 }}>
                    {disponible === 1 ? '1 paquete te espera en almacén' : `${disponible} paquetes te esperan en almacén`}
                  </Txt>
                </View>
                <Icons.chev size={18} sw={2.2} color={colors.gray} />
              </View>
            </Pressable>
          )}
          </SectionIn>
        </View>

        {/* banners */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, marginBottom: 18 }}>
          {BANNERS.map((b) => (
            <Banner key={b.id} b={b} />
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: 20 }}>
          {/* stats */}
          <SectionIn index={1} reduce={reduce}>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 22 }}>
              <StatCard label="En camino" value={enTransito} icon="planeUp" onPress={() => router.push('/(tabs)/guias')} reduce={reduce} />
              <StatCard label="En almacén" value={disponible} icon="warehouse" onPress={() => router.push('/(tabs)/guias')} reduce={reduce} />
            </View>
          </SectionIn>

          {/* actions */}
          <SectionIn index={2} reduce={reduce}>
          <Txt w={700} style={{ fontSize: 15, letterSpacing: -0.3, marginBottom: 14 }}>
            Acciones rápidas
          </Txt>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
            {ACTIONS.map((a) => (
              <Pressable
                key={a.label}
                onPress={() => router.push(a.route as never)}
                style={{ alignItems: 'center', gap: 7, width: '23%' }}
              >
                <View style={{ width: 50, height: 50, borderRadius: 16, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={a.icon} size={23} sw={2} color={colors.cream} />
                </View>
                <Txt w={700} style={{ fontSize: 12, color: colors.gray, textAlign: 'center' }}>
                  {a.label}
                </Txt>
              </Pressable>
            ))}
          </View>
          </SectionIn>

          <SectionIn index={3} reduce={reduce}>
          {/* recientes */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Txt w={700} style={{ fontSize: 15, letterSpacing: -0.3 }}>
              Mis Paquetes
            </Txt>
            <Pressable onPress={() => router.push('/(tabs)/guias')}>
              <Txt w={700} style={{ fontSize: 12.5, color: colors.lime }}>
                Ver todas
              </Txt>
            </Pressable>
          </View>
          <View style={{ gap: 12 }}>
            {recientes.length === 0 && query ? (
              <Txt w={500} style={{ fontSize: 13, color: colors.gray, textAlign: 'center', paddingVertical: 12 }}>
                Sin resultados para "{q}"
              </Txt>
            ) : (
              recientes.map((g) => <MiniGuia key={g.id} g={g} onPress={() => router.push(`/tracking/${g.id}`)} />)
            )}
          </View>
          </SectionIn>
        </View>

        {/* subtle transit motion — quietly closes the scroll */}
        <TransitFooter />
      </ScrollView>
    </ScreenContainer>
  );
}

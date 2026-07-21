import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, View } from 'react-native';

import { Icons } from '@/components/icons';
import { Txt } from '@/components/ui';
import { colors } from '@/theme/tokens';

/* ------------------------------------------------------------------ *
 * "En movimiento" — three transport icons, each alive in place.
 * NO line, NO travel (net horizontal displacement is always 0 → no
 * motion sickness). The ship sways on a swell, the plane floats a bit
 * higher in the air, and Express stays calm then fires a quick zap
 * with a rare lime spark — the only lime on the strip.
 * ------------------------------------------------------------------ */

const STRIP_H = 54;
const SIZE = 24;
const GAP = 54;
const PLANE_LIFT = 6; // plane sits slightly higher = altitude

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

/** A calm forward-then-back loop (returns to origin → no drift). */
function useSwell(reduce: boolean, duration: number, delay: number) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [v, reduce, duration, delay]);
  return v;
}

export function TransitFooter() {
  const reduce = useReduceMotion();
  const sea = useSwell(reduce, 1700, 0);
  const air = useSwell(reduce, 2400, 220);
  const zap = useRef(new Animated.Value(0)).current;

  // Express: occasional energetic zap (event-driven, not a steady loop).
  useEffect(() => {
    if (reduce) return;
    let t: ReturnType<typeof setTimeout>;
    const fire = () => {
      Animated.sequence([
        Animated.timing(zap, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(zap, { toValue: 0, duration: 320, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start(() => {
        t = setTimeout(fire, 1000 + Math.random() * 1200);
      });
    };
    t = setTimeout(fire, 1000 + Math.random() * 1200);
    return () => {
      clearTimeout(t);
      zap.stopAnimation();
    };
  }, [zap, reduce]);

  const seaY = sea.interpolate({ inputRange: [0, 1], outputRange: [3, -3] });
  const seaRot = sea.interpolate({ inputRange: [0, 1], outputRange: ['1.6deg', '-1.6deg'] });
  const airX = air.interpolate({ inputRange: [0, 1], outputRange: [-2, 2] });
  const airY = air.interpolate({ inputRange: [0, 1], outputRange: [2.5, -2.5] });
  const zapY = zap.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -2, 0] });
  const zapScale = zap.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const zapLime = zap.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] });

  return (
    <View style={{ marginTop: 32, alignItems: 'center' }}>
      <View style={{ height: STRIP_H, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: GAP }} pointerEvents="none">
        {/* Marítimo — sways on the swell */}
        <Animated.View style={{ transform: reduce ? undefined : [{ translateY: seaY }, { rotate: seaRot }] }}>
          <Icons.ship size={SIZE} sw={1.8} color={colors.gray} />
        </Animated.View>

        {/* Aéreo — floats a little higher */}
        <Animated.View style={{ marginBottom: PLANE_LIFT, transform: reduce ? undefined : [{ translateX: airX }, { translateY: airY }] }}>
          <Icons.planeUp size={SIZE} sw={1.8} color={colors.gray} />
        </Animated.View>

        {/* Express — calm, then a quick zap with a rare lime spark */}
        <Animated.View style={{ transform: reduce ? undefined : [{ translateY: zapY }, { scale: zapScale }] }}>
          <Icons.bolt size={SIZE} sw={1.8} color={colors.gray} />
          {!reduce && (
            <Animated.View style={{ position: 'absolute', left: 0, top: 0, opacity: zapLime }}>
              <Icons.bolt size={SIZE} sw={1.8} color={colors.lime} />
            </Animated.View>
          )}
        </Animated.View>
      </View>
      <Txt w={700} style={{ fontSize: 11, letterSpacing: 1.4, color: colors.textDim, marginTop: 14, textAlign: 'center' }}>
        MARÍTIMO · AÉREO · EXPRESS
      </Txt>
    </View>
  );
}

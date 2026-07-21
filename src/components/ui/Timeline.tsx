import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { Icon, Icons } from '@/components/icons';
import { STAGE_INDEX, STAGES, type TimelineStep } from '@/data/mock';
import { colors, limeGlowSm } from '@/theme/tokens';
import { useReduceMotion } from '@/utils/useReduceMotion';
import { Txt } from './Txt';

/** Mini horizontal progress bar (fraction of pipeline completed). */
export function ProgressBar({ current, height = 5 }: { current: string; height?: number }) {
  const ci = STAGE_INDEX[current];
  const pct = (ci / (STAGES.length - 1)) * 100;
  return (
    <View style={{ height, borderRadius: 9999, backgroundColor: colors.panel3, overflow: 'visible' }}>
      <LinearGradient
        colors={[colors.limeDeep, colors.lime]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 9999 }, limeGlowSm]}
      />
      <View
        style={[
          {
            position: 'absolute',
            left: `${pct}%`,
            marginLeft: -6,
            top: height / 2 - 6,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.lime,
            borderWidth: 2,
            borderColor: colors.bg1,
          },
          limeGlowSm,
        ]}
      />
    </View>
  );
}

/** Vertical tracking timeline (the star screen). */
export function Timeline({ timeline }: { timeline: TimelineStep[] }) {
  const reduce = useReduceMotion();
  const pulse = useRef(new Animated.Value(0)).current;
  const hasCurrent = timeline.some((s) => s.state === 'current');
  useEffect(() => {
    if (reduce || !hasCurrent) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduce, hasCurrent]);
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <View style={{ paddingLeft: 4 }}>
      {timeline.map((s, i) => {
        const last = i === timeline.length - 1;
        const done = s.state === 'done';
        const cur = s.state === 'current';
        const nodeBg = cur ? colors.lime : done ? colors.limeDeep : colors.panel2;
        const txt = done || cur ? colors.text : colors.textMut;
        const railDone = done || timeline[i + 1]?.state === 'current';
        return (
          <View key={s.key} style={{ flexDirection: 'row', gap: 15, paddingBottom: last ? 0 : 22 }}>
            {/* connector */}
            {!last && (
              <View
                style={{
                  position: 'absolute',
                  left: 17,
                  top: 36,
                  bottom: 0,
                  width: 2.5,
                  borderRadius: 2,
                  backgroundColor: railDone ? colors.limeDeep : colors.panel3,
                }}
              />
            )}
            {/* node */}
            <Animated.View
              style={[
                {
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: nodeBg,
                  borderWidth: cur ? 2 : done ? 0 : 1.5,
                  borderColor: cur ? colors.lime : colors.hairline2,
                },
                cur ? limeGlowSm : null,
                cur && !reduce ? { transform: [{ scale: pulseScale }] } : null,
              ]}
            >
              {done ? (
                <Icons.check size={18} sw={3} color={colors.onLime} />
              ) : (
                <Icon name={s.icon} size={17} sw={2} color={cur ? colors.onLime : colors.textDim} />
              )}
            </Animated.View>
            {/* content */}
            <View style={{ flex: 1, paddingTop: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <Txt w={cur ? 800 : 700} style={{ fontSize: 14, color: txt, flexShrink: 1 }}>
                  {s.label}
                </Txt>
                {cur && (
                  <View style={{ backgroundColor: colors.limeSoft, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 9999 }}>
                    <Txt w={800} style={{ fontSize: 9.5, color: colors.lime }}>
                      AHORA
                    </Txt>
                  </View>
                )}
              </View>
              <Txt w={500} style={{ fontSize: 12, color: colors.textMut, marginTop: 2 }}>
                {s.loc}
              </Txt>
              {s.time ? (
                <Txt mono style={{ fontSize: 11, color: colors.textDim, marginTop: 3, opacity: s.state === 'future' ? 0.5 : 1 }}>
                  {s.time}
                </Txt>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

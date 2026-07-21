import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import { Icons } from '@/components/icons';
import { colors } from '@/theme/tokens';
import { Txt } from './Txt';

type ToastFn = (msg: string) => void;
const ToastContext = createContext<ToastFn>(() => {});

/** Global toast hook — mirrors the prototype's `toast(msg)` helper. */
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback<ToastFn>((m) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 1900);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: msg ? 1 : 0, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: msg ? 0 : 16, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [msg, opacity, translateY]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: 110,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity,
          transform: [{ translateY }],
          zIndex: 80,
        }}
      >
        {msg ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: colors.cream,
              paddingVertical: 11,
              paddingHorizontal: 18,
              borderRadius: 9999,
              shadowColor: '#000',
              shadowOpacity: 0.4,
              shadowRadius: 15,
              shadowOffset: { width: 0, height: 12 },
              elevation: 8,
            }}
          >
            <Icons.checkCircle size={16} color={colors.olive} />
            <Txt w={700} style={{ color: colors.ink, fontSize: 13 }}>
              {msg}
            </Txt>
          </View>
        ) : null}
      </Animated.View>
    </ToastContext.Provider>
  );
}

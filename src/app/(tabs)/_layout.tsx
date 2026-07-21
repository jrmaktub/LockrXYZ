import { Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icons';
import { Txt } from '@/components/ui';
import { colors, limeGlow, limeGlowSm } from '@/theme/tokens';

const ITEMS: { name: string; label: string; icon: IconName; center?: boolean }[] = [
  { name: 'home', label: 'Inicio', icon: 'home' },
  { name: 'guias', label: 'Mis Paquetes', icon: 'boxes' },
  { name: 'codigo', label: 'Código', icon: 'qr', center: true },
  { name: 'soporte', label: 'Soporte', icon: 'support' },
  { name: 'perfil', label: 'Perfil', icon: 'user' },
];

type TabBarProps = {
  state: { index: number; routes: { name: string }[] };
  navigation: { navigate: (name: string) => void };
};

function LockrTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(17,18,8,0.94)',
        borderTopWidth: 1,
        borderTopColor: colors.hairline,
        paddingTop: 10,
        paddingHorizontal: 14,
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      {ITEMS.map((it) => {
        const on = activeRoute === it.name;
        const go = () => navigation.navigate(it.name);

        if (it.center) {
          return (
            <Pressable key={it.name} onPress={go} style={{ alignItems: 'center', gap: 5, marginTop: -24 }}>
              <View
                style={[
                  {
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    backgroundColor: colors.lime,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 3,
                    borderColor: colors.bg1,
                  },
                  on ? limeGlow : limeGlowSm,
                ]}
              >
                <Icon name={it.icon} size={26} sw={2.1} color={colors.onLime} />
              </View>
              <Txt w={700} style={{ fontSize: 10.5, color: on ? colors.lime : colors.gray }}>
                {it.label}
              </Txt>
            </Pressable>
          );
        }

        return (
          <Pressable key={it.name} onPress={go} style={{ flex: 1, alignItems: 'center', gap: 5 }}>
            <Icon name={it.icon} size={23} sw={on ? 2.2 : 1.9} color={on ? colors.lime : colors.gray} />
            <Txt w={on ? 700 : 600} style={{ fontSize: 10.5, color: on ? colors.lime : colors.gray }}>
              {it.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <LockrTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg1 } }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="guias" />
      <Tabs.Screen name="codigo" />
      <Tabs.Screen name="soporte" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}

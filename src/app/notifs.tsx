import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/icons';
import { AppBar, Card, ScreenBody, ScreenContainer, Txt, useToast } from '@/components/ui';
import { useNotifs } from '@/hooks/useFirestoreData';
import { markNotifRead } from '@/lib/firebase/repo';
import { useAuthStore } from '@/store/auth-store';
import type { Notif } from '@/types';
import { colors, limeGlowSm } from '@/theme/tokens';

const ORDER: Notif['day'][] = ['Hoy', 'Ayer', 'Esta semana'];

function NotifRow({ n, onPress }: { n: Notif; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Card style={{ flexDirection: 'row', gap: 13, padding: 14, backgroundColor: n.unread ? '#1f2113' : colors.panel, borderColor: n.unread ? colors.limeLine : colors.hairline }}>
        <View style={{ width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: n.unread ? colors.limeSoft : colors.panel2, borderWidth: 1, borderColor: n.unread ? colors.limeLine : colors.hairline }}>
          <Icon name={n.icon} size={20} color={n.unread ? colors.lime : colors.cream} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
            <Txt w={700} style={{ fontSize: 13.5, flex: 1 }}>
              {n.title}
            </Txt>
            {n.unread && <View style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lime, marginTop: 4 }, limeGlowSm]} />}
          </View>
          <Txt w={500} style={{ fontSize: 12.5, color: colors.gray, marginTop: 3, lineHeight: 18 }}>
            {n.msg}
          </Txt>
          <Txt w={600} style={{ fontSize: 11, color: colors.gray, marginTop: 5 }}>
            {n.time}
          </Txt>
        </View>
      </Card>
    </Pressable>
  );
}

export default function NotifsScreen() {
  const toast = useToast();
  const uid = useAuthStore((s) => s.user?.uid);
  const { notifs } = useNotifs();
  const groups: Record<string, Notif[]> = {};
  notifs.forEach((n) => {
    (groups[n.day] = groups[n.day] || []).push(n);
  });

  const markRead = async () => {
    if (!uid) return;
    const unread = notifs.filter((n) => n.unread);
    await Promise.all(unread.map((n) => markNotifRead(uid, n.id)));
    toast('Notificaciones marcadas');
  };

  return (
    <ScreenContainer>
      <AppBar
        title="Notificaciones"
        right={
          <Pressable onPress={markRead}>
            <Txt w={700} style={{ fontSize: 12.5, color: colors.lime }}>
              Marcar leídas
            </Txt>
          </Pressable>
        }
      />
      <ScreenBody>
        {ORDER.filter((d) => groups[d]).map((day) => (
          <View key={day} style={{ marginBottom: 20 }}>
            <Txt w={700} style={{ fontSize: 11.5, color: colors.gray, letterSpacing: 0.7, marginBottom: 10, marginLeft: 2 }}>
              {day.toUpperCase()}
            </Txt>
            <View style={{ gap: 10 }}>
              {groups[day].map((n) => (
                <NotifRow key={n.id} n={n} onPress={() => n.guia && router.push(`/tracking/${n.guia}`)} />
              ))}
            </View>
          </View>
        ))}
      </ScreenBody>
    </ScreenContainer>
  );
}

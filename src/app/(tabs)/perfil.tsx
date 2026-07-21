import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useState } from 'react';

import { Icon, Icons, type IconName } from '@/components/icons';
import { Button, Card, ScreenContainer, Txt, useToast } from '@/components/ui';
import { useAuthStore } from '@/store/auth-store';
import { clearBiometricCredentials } from '@/lib/biometrics';
import { seedDemoGuiasForUser } from '@/lib/firebase/seed';
import { colors, limeGlowSm } from '@/theme/tokens';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '·';
}

function RowItem({
  icon,
  title,
  sub,
  onPress,
  right,
  accent,
  topBorder,
}: {
  icon: IconName;
  title: string;
  sub?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  accent?: boolean;
  topBorder?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: topBorder ? 1 : 0, borderTopColor: colors.hairline }}
    >
      <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: colors.panel2, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={19} color={accent ? colors.lime : colors.gray} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt w={700} style={{ fontSize: 14.5 }}>
          {title}
        </Txt>
        {sub ? (
          <Txt w={500} style={{ fontSize: 12, color: colors.gray, marginTop: 1 }}>
            {sub}
          </Txt>
        ) : null}
      </View>
      {right !== undefined ? right : <Icons.chev size={17} color={colors.gray} />}
    </Pressable>
  );
}

function Group({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Txt w={700} style={{ fontSize: 11.5, color: colors.gray, letterSpacing: 0.7, marginBottom: 9, marginLeft: 4 }}>
        {header.toUpperCase()}
      </Txt>
      <Card style={{ overflow: 'hidden' }}>{children}</Card>
    </View>
  );
}

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const uid = useAuthStore((s) => s.user?.uid);
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const [seeding, setSeeding] = useState(false);

  const handleSignOut = async () => {
    await clearBiometricCredentials();
    await signOut();
    router.replace('/(auth)/login');
  };

  const handleSeedDemo = async () => {
    if (!uid || seeding) return;
    setSeeding(true);
    try {
      await seedDemoGuiasForUser(uid);
      toast('Paquetes de muestra cargados');
    } catch {
      toast('No se pudo cargar la muestra, intenta de nuevo');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 20 }}>
          <Txt w={800} style={{ fontSize: 24, letterSpacing: -0.7, marginBottom: 18 }}>
            Mi perfil
          </Txt>

          {/* profile card */}
          <LinearGradient colors={['#24251A', '#181910']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 15, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: colors.limeLine, marginBottom: 22 }}>
            <View style={[{ width: 62, height: 62, borderRadius: 20, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' }, limeGlowSm]}>
              <Txt w={800} style={{ fontSize: 23, color: colors.onLime }}>
                {initials(profile?.name || '')}
              </Txt>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt w={800} numberOfLines={1} style={{ fontSize: 17, letterSpacing: -0.4 }}>
                {profile?.name || ''}
              </Txt>
              <Txt w={500} style={{ fontSize: 12.5, color: colors.gray, marginTop: 1 }}>
                {profile?.email || ''}
              </Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <View style={{ backgroundColor: colors.limeSoft, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 8 }}>
                  <Txt mono w={700} style={{ fontSize: 11.5, color: colors.lime }}>
                    #{profile?.casillero || '···'}
                  </Txt>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Group header="Mi cuenta">
            <RowItem icon="edit" title="Editar mis datos" sub="Nombre, correo, teléfono y nacimiento" onPress={() => router.push('/editar')} />
            <RowItem icon="pin" title="Direcciones" sub="Casillero y entrega a domicilio" onPress={() => router.push('/direcciones')} topBorder />
            <RowItem icon="invoice" title="Facturas" sub="Historial de guías entregadas" onPress={() => router.push('/facturas')} topBorder />
          </Group>

          <Group header="Aplicación">
            <RowItem icon="bell" title="Notificaciones" sub="Avisos de tus paquetes" onPress={() => router.push('/notifs')} />
            <RowItem icon="bug" title="Reportar un problema" sub="Avísanos sobre errores" onPress={() => toast('Reportar problema')} topBorder />
          </Group>

          <Group header="Demo">
            <RowItem
              icon="boxes"
              title="Cargar paquetes de muestra"
              sub="Solo para pruebas — llena esta cuenta con datos de ejemplo"
              onPress={handleSeedDemo}
              right={seeding ? <Txt w={600} style={{ fontSize: 12, color: colors.gray }}>Cargando…</Txt> : undefined}
            />
          </Group>

          <Button
            variant="ghost"
            onPress={handleSignOut}
            icon={<Icons.logout size={18} color={colors.danger} />}
            label="Cerrar sesión"
            textColor={colors.danger}
            fontSize={14.5}
            style={{ backgroundColor: colors.dangerSoft, borderColor: colors.dangerLine, paddingVertical: 16, marginTop: 4, marginBottom: 10 }}
          />
          <Txt w={600} style={{ textAlign: 'center', fontSize: 11, color: colors.gray, paddingTop: 6 }}>
            Lockr · v1.0.0 · Honduras 🇭🇳
          </Txt>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

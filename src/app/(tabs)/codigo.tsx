import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icons } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { Button, Input, QRCode, ScreenContainer, Txt, useToast } from '@/components/ui';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme/tokens';

const WINDOW = 15 * 60; // el código vive 15 minutos y se renueva solo

type Authorized = { name: string; doc: string };

const maskDoc = (d: string) => (d.length <= 4 ? d : '•••• ' + d.slice(-4));

/** Bottom-sheet para autorizar a un tercero a retirar guías (nombre + documento). */
function AuthorizeSheet({ visible, onClose, onConfirm }: { visible: boolean; onClose: () => void; onConfirm: (p: Authorized) => void }) {
  const [name, setName] = useState('');
  const [doc, setDoc] = useState('');

  // limpia los campos cada vez que se cierra
  useEffect(() => {
    if (!visible) {
      setName('');
      setDoc('');
    }
  }, [visible]);

  const valid = name.trim().length >= 2 && doc.trim().length >= 4;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} />
        <View
          style={{
            backgroundColor: colors.bg1,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            borderWidth: 1,
            borderColor: colors.hairline2,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 28,
          }}
        >
          {/* grabber */}
          <View style={{ alignSelf: 'center', width: 38, height: 4, borderRadius: 9999, backgroundColor: colors.hairline2, marginBottom: 18 }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: colors.limeSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icons.users size={19} color={colors.lime} />
            </View>
            <Txt w={800} style={{ flex: 1, fontSize: 18, letterSpacing: -0.4 }}>
              Autorizar a otra persona
            </Txt>
          </View>
          <Txt w={500} style={{ fontSize: 12.5, color: colors.gray, lineHeight: 18, marginBottom: 18 }}>
            Esta persona podrá retirar tus guías mostrando su documento de identidad en bodega.
          </Txt>

          <Input
            label="Nombre completo"
            value={name}
            onChangeText={setName}
            placeholder="Ej. María López"
            autoCapitalize="words"
            autoCorrect={false}
            containerStyle={{ marginBottom: 14 }}
          />
          <Input
            label="Documento de identidad"
            value={doc}
            onChangeText={setDoc}
            placeholder="0801-1990-12345"
            keyboardType="number-pad"
            mono
            containerStyle={{ marginBottom: 22 }}
          />

          <Button
            label="Autorizar"
            disabled={!valid}
            onPress={() => onConfirm({ name: name.trim(), doc: doc.trim() })}
            icon={<Icons.check size={18} color={colors.onLime} />}
          />
          <Button variant="ghost" label="Cancelar" onPress={onClose} textColor={colors.gray} style={{ marginTop: 10, paddingVertical: 14 }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function fmt(d: Date) {
  return (
    d.toLocaleDateString('es-HN', { day: '2-digit', month: 'short' }) +
    ', ' +
    d.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' })
  );
}

/** Small deterministic hash so each casillero's code starts from a different seed. */
function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 90000;
}

export default function CodigoScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const profile = useAuthStore((s) => s.profile);
  const [left, setLeft] = useState(WINDOW);
  const [gen, setGen] = useState(() => new Date());
  const [seed, setSeed] = useState(() => hashSeed(profile?.casillero || 'lockr'));
  const [authOpen, setAuthOpen] = useState(false);
  const [authorized, setAuthorized] = useState<Authorized | null>(null);

  // tick every second
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  // auto-regenerate when the window expires
  useEffect(() => {
    if (left === 0) {
      setGen(new Date());
      setSeed((s) => s + 7);
      setLeft(WINDOW);
    }
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const urgent = left <= 60;

  return (
    <ScreenContainer>
      {/* header band */}
      <LinearGradient colors={['#2C2D1A', '#1a1b10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 6, paddingHorizontal: 20, paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: colors.limeLine, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', right: -10, top: 40, opacity: 0.12 }}>
          <Icons.qr size={130} sw={1.2} color={colors.lime} />
        </View>
        <Txt w={800} style={{ fontSize: 22, letterSpacing: -0.7, marginBottom: 6 }}>
          Mi código
        </Txt>
        <Txt w={500} style={{ fontSize: 13, color: colors.gray, maxWidth: 260, lineHeight: 19 }}>
          Presenta este QR en bodega para retirar tus guías. Se renueva solo cada 15 minutos.
        </Txt>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 28 }}>
        {/* boarding-pass style card */}
        <View style={{ backgroundColor: colors.cream, borderRadius: 26, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.32, shadowRadius: 22, shadowOffset: { width: 0, height: 16 }, elevation: 8 }}>
          {/* brand header — official wordmark for max visibility */}
          <LinearGradient colors={['#2C2D1A', '#1a1b10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 17, alignItems: 'center' }}>
            <Logo height={23} />
          </LinearGradient>

          <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20, alignItems: 'center' }}>
            {/* QR on pure white for the cleanest scan */}
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 20 }}>
              <QRCode size={206} seed={seed} fg="#191919" accent="#2C2D1A" />
            </View>

            {/* identity */}
            <Txt w={800} style={{ fontSize: 17.5, color: colors.ink, letterSpacing: -0.3, textAlign: 'center' }}>
              {profile?.name || ''}
            </Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5, marginBottom: 18 }}>
              <Txt w={600} style={{ fontSize: 12.5, color: colors.olive }}>
                Casillero
              </Txt>
              <Txt mono w={700} style={{ fontSize: 13.5, color: colors.olive, letterSpacing: 0.5 }}>
                #{profile?.casillero || '···'}
              </Txt>
            </View>

            {/* countdown */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.olive, paddingVertical: 9, paddingHorizontal: 17, borderRadius: 9999, marginBottom: 9 }}>
              <Icons.clock size={15} color={urgent ? colors.danger : colors.lime} />
              <Txt mono w={700} style={{ fontSize: 14, color: urgent ? colors.danger : colors.cream }}>
                Expira en {mm}:{ss}
              </Txt>
            </View>
            <Txt w={600} style={{ fontSize: 11.5, color: colors.gray }}>
              Generado {fmt(gen)} · se renueva solo
            </Txt>
          </View>
        </View>

        {/* autorizar a un tercero — debe mostrar ID en bodega */}
        {authorized ? (
          <View
            style={{
              marginTop: 18,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: colors.panel2,
              borderWidth: 1,
              borderColor: colors.hairline2,
              borderRadius: 16,
              padding: 14,
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.limeSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icons.user size={20} color={colors.lime} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt w={700} style={{ fontSize: 10, color: colors.lime, letterSpacing: 0.6, marginBottom: 2 }}>
                PERSONA AUTORIZADA
              </Txt>
              <Txt w={700} style={{ fontSize: 14.5, color: colors.cream }} numberOfLines={1}>
                {authorized.name}
              </Txt>
              <Txt mono w={600} style={{ fontSize: 12, color: colors.gray, marginTop: 1 }}>
                {maskDoc(authorized.doc)}
              </Txt>
            </View>
            <Pressable
              onPress={() => {
                setAuthorized(null);
                toast('Autorización eliminada');
              }}
              hitSlop={8}
              style={{ paddingVertical: 6, paddingHorizontal: 4 }}
            >
              <Txt w={700} style={{ fontSize: 12.5, color: colors.danger }}>
                Quitar
              </Txt>
            </Pressable>
          </View>
        ) : (
          <Button
            variant="ghost"
            onPress={() => setAuthOpen(true)}
            icon={<Icons.users size={18} color={colors.cream} />}
            label="Autorizar a otra persona"
            textColor={colors.cream}
            style={{ marginTop: 18, paddingVertical: 15 }}
          />
        )}
        <Txt w={500} style={{ fontSize: 11.5, color: colors.gray, textAlign: 'center', marginTop: 11, lineHeight: 16 }}>
          Tu código es personal e intransferible. Si autorizas a otra persona, deberá presentar su documento de identidad en bodega para retirar.
        </Txt>
      </ScrollView>

      <AuthorizeSheet
        visible={authOpen}
        onClose={() => setAuthOpen(false)}
        onConfirm={(p) => {
          setAuthorized(p);
          setAuthOpen(false);
          toast('Persona autorizada correctamente');
        }}
      />
    </ScreenContainer>
  );
}

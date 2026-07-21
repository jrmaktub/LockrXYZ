import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthBackground, GoogleG } from '@/components/auth-bits';
import { Icons } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { Button, Input, Txt } from '@/components/ui';
import { colors } from '@/theme/tokens';

export default function LoginEmailScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = () => {
    if (!email.trim()) return setErr('Ingresa tu correo electrónico.');
    if (!pass.trim()) return setErr('Ingresa tu contraseña.');
    setErr('');
    setLoading(true);
    setTimeout(() => router.replace('/(tabs)/home'), 950);
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* back + logo */}
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Pressable
            onPress={() => router.back()}
            style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icons.back size={20} color={colors.text} />
          </Pressable>
          <Logo height={22} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 32, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <Txt w={800} style={{ fontSize: 26, letterSpacing: -0.7, marginBottom: 6 }}>
            Bienvenido de{'\n'}vuelta
          </Txt>
          <Txt w={500} style={{ fontSize: 14, color: colors.gray, marginBottom: 32 }}>
            Inicia sesión con tu correo y contraseña.
          </Txt>

          <Input
            label="Correo electrónico"
            adorn={<Icons.mail size={18} color={colors.gray} />}
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErr('');
            }}
            placeholder="tucorreo@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={{ marginBottom: 16 }}
          />

          <Input
            label="Contraseña"
            adorn={<Icons.shield size={18} color={colors.gray} />}
            rightAdorn={
              <Pressable onPress={() => setShow((s) => !s)} style={{ padding: 6 }}>
                {show ? <Icons.moon size={18} color={colors.gray} /> : <Icons.sun size={18} color={colors.gray} />}
              </Pressable>
            }
            value={pass}
            onChangeText={(t) => {
              setPass(t);
              setErr('');
            }}
            placeholder="••••••••"
            secureTextEntry={!show}
            containerStyle={{ marginBottom: 10 }}
          />

          <View style={{ alignItems: 'flex-end', marginBottom: 28 }}>
            <Pressable style={{ paddingVertical: 4 }}>
              <Txt w={700} style={{ fontSize: 13, color: colors.lime }}>
                ¿Olvidaste tu contraseña?
              </Txt>
            </Pressable>
          </View>

          {err ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: 'rgba(240,121,94,0.12)', borderWidth: 1, borderColor: 'rgba(240,121,94,0.3)', borderRadius: 12, paddingVertical: 11, paddingHorizontal: 14, marginBottom: 20 }}>
              <Icons.alert size={16} color={colors.danger} />
              <Txt w={600} style={{ fontSize: 13, color: colors.danger }}>
                {err}
              </Txt>
            </View>
          ) : null}

          <Button
            variant="primary"
            loading={loading}
            onPress={submit}
            icon={<Icons.arrowR size={18} sw={2.4} color={colors.onLime} />}
            label="Iniciar sesión"
            fontSize={16}
            style={{ paddingVertical: 17, marginBottom: 20 }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
            <Txt w={700} style={{ fontSize: 11.5, color: colors.gray }}>
              o
            </Txt>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
          </View>

          <Button
            onPress={() => router.back()}
            icon={<GoogleG size={20} />}
            label="Continuar con Google"
            textColor={colors.ink}
            style={{ paddingVertical: 16, backgroundColor: colors.cream }}
          />
        </ScrollView>

        <Txt w={600} style={{ paddingBottom: insets.bottom + 16, textAlign: 'center', color: colors.gray, fontSize: 11, letterSpacing: 0.5 }}>
          MOVE SMART · MOVE LOCKR
        </Txt>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

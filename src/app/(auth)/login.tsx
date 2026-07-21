import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  authenticateBiometric,
  getBiometricCredentials,
  isBiometricAvailable,
  saveBiometricCredentials,
} from '@/lib/biometrics';
import { AppleMark, AuthBackground, GoogleG } from '@/components/auth-bits';
import { Icons } from '@/components/icons';
import { Logo, LogoMark } from '@/components/Logo';
import { Input, Txt, useToast } from '@/components/ui';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme/tokens';

const pillShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
};

function AuthButton({
  onPress,
  icon,
  label,
  loading,
  disabled,
}: {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={loading || disabled} accessibilityRole="button" accessibilityLabel={label}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            backgroundColor: colors.cream,
            borderRadius: 16,
            paddingVertical: 15,
            opacity: disabled ? 0.5 : 1,
          },
          pillShadow,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.ink} />
        ) : (
          <>
            {icon}
            <Txt w={700} style={{ fontSize: 15.5, color: colors.ink }}>
              {label}
            </Txt>
          </>
        )}
      </View>
    </Pressable>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const signInWithCasillero = useAuthStore((s) => s.signInWithCasillero);
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const [casillero, setCasillero] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricReady, setBiometricReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [available, saved] = await Promise.all([isBiometricAvailable(), getBiometricCredentials()]);
      setBiometricReady(available && !!saved);
    })();
  }, []);

  const goHome = () => router.replace('/(tabs)/home');

  const handleLogin = async () => {
    if (!casillero.trim()) return toast('Ingresa tu numero de casillero');
    if (!password) return toast('Ingresa tu contraseña');
    setLoading(true);
    try {
      await signInWithCasillero(casillero.trim(), password);
      await saveBiometricCredentials(casillero.trim(), password);
      goHome();
    } catch {
      toast('Casillero o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    const ok = await authenticateBiometric();
    if (!ok) return;
    const creds = await getBiometricCredentials();
    if (!creds) return;
    setLoading(true);
    try {
      await signInWithCasillero(creds.casillero, creds.password);
      goHome();
    } catch {
      toast('No se pudo iniciar sesion, ingresa tu contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!/\S+@\S+\.\S+/.test(casillero.trim())) {
      toast('Escribe tu correo en el campo de arriba para recuperar tu contraseña');
      return;
    }
    try {
      await resetPassword(casillero.trim());
      toast('Te enviamos un correo para restablecer tu contraseña');
    } catch {
      toast('No pudimos enviar el correo, verifica que sea el correo registrado');
    }
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}>
          <View style={{ alignItems: 'center', marginBottom: 26 }}>
            <View
              style={[
                { width: 74, height: 74, borderRadius: 22, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
                pillShadow,
              ]}
            >
              <LogoMark size={50} variant="cream" tint={colors.olive} />
            </View>
            <Logo height={38} style={{ marginBottom: 10 }} />
            <Txt w={800} style={{ fontSize: 21, color: colors.cream, textAlign: 'center', lineHeight: 25, letterSpacing: -0.6 }}>
              Move Smart.{'\n'}Move Lockr.
            </Txt>
          </View>

          {/* casillero + password — the real, contracted login path */}
          <View style={{ gap: 12, marginBottom: 10 }}>
            <Input
              adorn={<Icons.user size={18} color={colors.gray} />}
              value={casillero}
              onChangeText={setCasillero}
              placeholder="Numero de casillero o correo"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ paddingVertical: 15 }}
            />
            <Input
              adorn={<Icons.shield size={18} color={colors.gray} />}
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              style={{ paddingVertical: 15 }}
            />
          </View>

          <Pressable onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 14 }}>
            <Txt w={600} style={{ fontSize: 12.5, color: colors.lime }}>
              Olvidaste tu contraseña?
            </Txt>
          </Pressable>

          <AuthButton onPress={handleLogin} loading={loading} icon={<Icons.arrowR size={18} color={colors.ink} />} label="Entrar" />

          {biometricReady && (
            <Pressable
              onPress={handleBiometric}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingVertical: 12, marginTop: 6 }}
            >
              <Icons.fingerprint size={18} color={colors.lime} />
              <Txt w={700} style={{ fontSize: 14, color: colors.lime }}>
                Entrar con Face ID / huella
              </Txt>
            </Pressable>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, marginBottom: 14 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
            <Txt w={700} style={{ fontSize: 11.5, color: colors.gray, letterSpacing: 0.5 }}>
              o
            </Txt>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
          </View>

          {/* Google/Apple: fuera del alcance de la cotizacion original — requieren
              cuentas de desarrollador y configuracion OAuth que provee el Cliente. */}
          <View style={{ gap: 10 }}>
            <AuthButton
              onPress={() => toast('Disponible cuando se configure la cuenta de Google Cloud del Cliente')}
              icon={<GoogleG size={20} />}
              label="Continuar con Google"
              disabled
            />
            <AuthButton
              onPress={() => toast('Disponible cuando se configure la cuenta Apple Developer del Cliente')}
              icon={<AppleMark size={20} color={colors.ink} />}
              label="Continuar con Apple"
              disabled
            />
          </View>

          <Pressable
            onPress={() => router.push('/(auth)/apertura')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingVertical: 14, marginTop: 18, borderRadius: 16, borderWidth: 1.5, borderColor: colors.limeLine, backgroundColor: colors.limeSoft }}
          >
            <Icons.plus size={17} sw={2.6} color={colors.lime} />
            <Txt w={800} style={{ fontSize: 15, color: colors.lime }}>
              Aperturar nuevo casillero
            </Txt>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 32, paddingBottom: insets.bottom + 18 }}>
          <Txt w={500} style={{ textAlign: 'center', color: colors.gray, fontSize: 11, lineHeight: 18 }}>
            Al continuar aceptas los{' '}
            <Txt w={500} style={{ color: colors.cream, textDecorationLine: 'underline' }}>
              Términos de uso
            </Txt>{' '}
            y la{' '}
            <Txt w={500} style={{ color: colors.cream, textDecorationLine: 'underline' }}>
              Política de privacidad
            </Txt>
            .
          </Txt>
        </View>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

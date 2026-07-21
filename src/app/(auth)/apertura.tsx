import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthBackground } from '@/components/auth-bits';
import { Icon, Icons, type IconName } from '@/components/icons';
import { Logo, LogoMark } from '@/components/Logo';
import { Button, Input, Txt } from '@/components/ui';
import { useAuthStore } from '@/store/auth-store';
import { colors, limeGlow, limeGlowSm } from '@/theme/tokens';

const BENEFITS: [IconName, string][] = [
  ['planeUp', 'Aéreo y marítimo'],
  ['pin', 'Entrega HN'],
  ['shield', '100% seguro'],
];

export default function AperturaScreen() {
  const insets = useSafeAreaInsets();
  const signUpNewCasillero = useAuthStore((s) => s.signUpNewCasillero);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nacimiento, setNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [err, setErr] = useState('');
  const [casillero, setCasillero] = useState('');

  const fmtFecha = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 8);
    return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('/');
  };

  const submit = async () => {
    if (!nombre.trim()) return setErr('Ingresa tu nombre completo.');
    if (!/\S+@\S+\.\S+/.test(email.trim())) return setErr('Ingresa un correo electronico valido.');
    if (!telefono.trim()) return setErr('Ingresa tu número de teléfono.');
    if (nacimiento.length < 10) return setErr('Ingresa tu fecha de nacimiento (DD/MM/AAAA).');
    if (password.length < 6) return setErr('La contraseña debe tener al menos 6 caracteres.');
    setErr('');
    setStep('loading');
    try {
      const newCasillero = await signUpNewCasillero({
        name: nombre.trim(),
        email: email.trim(),
        phone: telefono.trim(),
        birthday: nacimiento,
        password,
      });
      setCasillero(newCasillero);
      setStep('success');
    } catch {
      setErr('No se pudo crear el casillero. Intenta de nuevo.');
      setStep('form');
    }
  };

  if (step === 'success') {
    return (
      <AuthBackground>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <View style={[{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.limeSoft, borderWidth: 2, borderColor: colors.lime, alignItems: 'center', justifyContent: 'center', marginBottom: 26 }, limeGlow]}>
            <Icons.checkCircle size={44} sw={1.6} color={colors.lime} />
          </View>
          <Txt w={800} style={{ fontSize: 26, letterSpacing: -0.7, marginBottom: 10 }}>
            ¡Casillero listo!
          </Txt>
          <Txt w={500} style={{ fontSize: 15, color: colors.gray, textAlign: 'center', lineHeight: 24, marginBottom: 10 }}>
            Hola{' '}
            <Txt w={700} style={{ color: colors.cream }}>
              {nombre.split(' ')[0] || 'amigo'}
            </Txt>
            , tu casillero Lockr fue creado.
          </Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.limeLine, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 22, marginBottom: 36 }}>
            <LogoMark size={22} variant="cream" />
            <View>
              <Txt w={700} style={{ fontSize: 10.5, color: colors.lime, letterSpacing: 0.8 }}>
                TU CASILLERO
              </Txt>
              <Txt mono w={700} style={{ fontSize: 26 }}>
                {casillero}
              </Txt>
            </View>
          </View>
          <Txt w={500} style={{ fontSize: 13, color: colors.gray, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
            Recibirás un correo en <Txt style={{ color: colors.cream }}>{email}</Txt> con todos los detalles.
          </Txt>
          <Button
            variant="primary"
            onPress={() => router.replace('/(tabs)/home')}
            label="Entrar a mi cuenta"
            iconRight={<Icons.arrowR size={18} sw={2.4} color={colors.onLime} />}
            fontSize={16}
            style={{ width: '100%', paddingVertical: 17 }}
          />
        </View>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Pressable
            onPress={() => router.back()}
            style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icons.back size={20} color={colors.text} />
          </Pressable>
          <Logo height={22} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 32, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <View style={[{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' }, limeGlowSm]}>
              <LogoMark size={34} variant="color" />
            </View>
            <View>
              <Txt w={800} style={{ fontSize: 22, letterSpacing: -0.7, lineHeight: 24 }}>
                Abre tu{'\n'}casillero
              </Txt>
              <Txt w={500} style={{ fontSize: 13, color: colors.gray, marginTop: 3 }}>
                Es gratis y tarda 2 minutos.
              </Txt>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 30 }}>
            {BENEFITS.map(([icon, label]) => (
              <View key={icon} style={{ flex: 1, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.hairline, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center' }}>
                <Icon name={icon} size={18} color={colors.lime} />
                <Txt w={700} style={{ fontSize: 10, color: colors.gray, marginTop: 5, textAlign: 'center' }}>
                  {label}
                </Txt>
              </View>
            ))}
          </View>

          <View style={{ gap: 16, marginBottom: 24 }}>
            <Input label="Nombre completo" adorn={<Icons.user size={18} color={colors.gray} />} value={nombre} onChangeText={(t) => { setNombre(t); setErr(''); }} placeholder="María Fernanda Discua" />
            <Input label="Correo electrónico" adorn={<Icons.mail size={18} color={colors.gray} />} value={email} onChangeText={(t) => { setEmail(t); setErr(''); }} placeholder="tucorreo@gmail.com" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Teléfono" adorn={<Icons.phone size={18} color={colors.gray} />} value={telefono} onChangeText={(t) => { setTelefono(t); setErr(''); }} placeholder="+504 9999-0000" keyboardType="phone-pad" />
            <Input label="Fecha de nacimiento" adorn={<Icons.cal size={18} color={colors.gray} />} value={nacimiento} onChangeText={(t) => { setNacimiento(fmtFecha(t)); setErr(''); }} placeholder="DD/MM/AAAA" keyboardType="number-pad" maxLength={10} />
            <Input label="Contraseña" adorn={<Icons.shield size={18} color={colors.gray} />} value={password} onChangeText={(t) => { setPassword(t); setErr(''); }} placeholder="Minimo 6 caracteres" secureTextEntry autoCapitalize="none" />
          </View>

          {err ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: 'rgba(240,121,94,0.12)', borderWidth: 1, borderColor: 'rgba(240,121,94,0.3)', borderRadius: 12, paddingVertical: 11, paddingHorizontal: 14, marginBottom: 18 }}>
              <Icons.alert size={16} color={colors.danger} />
              <Txt w={600} style={{ fontSize: 13, color: colors.danger }}>
                {err}
              </Txt>
            </View>
          ) : null}

          <Button
            variant="primary"
            loading={step === 'loading'}
            onPress={submit}
            label="Crear mi casillero"
            iconRight={<Icons.arrowR size={18} sw={2.4} color={colors.onLime} />}
            fontSize={16}
            style={{ paddingVertical: 18, marginBottom: 18 }}
          />

          <Txt w={500} style={{ textAlign: 'center', color: colors.gray, fontSize: 11.5, lineHeight: 18 }}>
            Al continuar aceptas los{' '}
            <Txt w={500} style={{ color: colors.cream, textDecorationLine: 'underline' }}>
              Términos de uso
            </Txt>{' '}
            y la{' '}
            <Txt w={500} style={{ color: colors.cream, textDecorationLine: 'underline' }}>
              Política de privacidad
            </Txt>{' '}
            de Lockr.
          </Txt>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

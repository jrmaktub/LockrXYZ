import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icons } from '@/components/icons';
import { AppBar, Button, Input, ScreenBody, ScreenContainer, useToast } from '@/components/ui';
import { updateUserProfile } from '@/lib/firebase/repo';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme/tokens';

export default function EditarScreen() {
  const toast = useToast();
  const uid = useAuthStore((s) => s.user?.uid);
  const profile = useAuthStore((s) => s.profile);
  const [nombre, setNombre] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [telefono, setTelefono] = useState(profile?.phone || '');
  const [nacimiento, setNacimiento] = useState(profile?.birthday || '');
  const [saving, setSaving] = useState(false);

  // auto-formatea a DD/MM/AAAA mientras se escribe
  const fmtFecha = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 8);
    return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('/');
  };

  const guardar = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      await updateUserProfile(uid, { name: nombre.trim(), email: email.trim(), phone: telefono.trim(), birthday: nacimiento });
      toast('Datos guardados');
      router.back();
    } catch {
      toast('No se pudo guardar, intenta de nuevo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <AppBar title="Editar mis datos" sub="Actualiza tu información" />
      <ScreenBody>
        <View style={{ gap: 16, marginBottom: 24 }}>
          <Input
            label="Nombre completo"
            adorn={<Icons.user size={18} color={colors.gray} />}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre completo"
          />
          <Input
            label="Correo electrónico"
            adorn={<Icons.mail size={18} color={colors.gray} />}
            value={email}
            onChangeText={setEmail}
            placeholder="tucorreo@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            label="Teléfono"
            adorn={<Icons.phone size={18} color={colors.gray} />}
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+504 0000-0000"
            keyboardType="phone-pad"
          />
          <Input
            label="Fecha de nacimiento"
            adorn={<Icons.cal size={18} color={colors.gray} />}
            value={nacimiento}
            onChangeText={(t) => setNacimiento(fmtFecha(t))}
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
        <Button variant="primary" loading={saving} onPress={guardar} icon={<Icons.check size={18} sw={2.6} color={colors.onLime} />} label="Guardar cambios" style={{ paddingVertical: 16 }} />
      </ScreenBody>
    </ScreenContainer>
  );
}

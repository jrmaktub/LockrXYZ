import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppBar, Button, Card, Input, ScreenBody, ScreenContainer, StatusBadge, Txt, useToast } from '@/components/ui';
import { STAGES } from '@/data/mock';
import { createGuia, getGuias, getUserProfile, updateGuia } from '@/lib/firebase/repo';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme/tokens';
import type { Guia, StageKey, UserProfile } from '@/types';

/**
 * Panel de Administracion (Web) — cotizacion #11.
 *
 * Vista de muestra: entra directo con la cuenta de demostracion (sin pedir
 * credenciales) para ensenar como se ve y opera el panel — buscar/ver un
 * cliente, registrar un paquete y actualizar su estado por etapa. Reusa el
 * mismo Firebase Auth + Firestore de la app movil, sin backend aparte.
 */
const DEMO_CASILLERO = 'LK50001';
const DEMO_PASSWORD = 'LockrDemo2026!';

function emptyForm() {
  return { tracking: '', desc: '', store: '', weight: '', price: '', note: '' };
}

function ClientDetail({ client }: { client: UserProfile }) {
  const toast = useToast();
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'aereo' | 'maritimo'>('aereo');
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const reload = () => getGuias(client.id).then(setGuias);

  useEffect(() => {
    reload().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id]);

  const handleCreate = async () => {
    if (!form.tracking.trim() || !form.desc.trim()) return toast('Tracking y descripcion son obligatorios');
    setSaving(true);
    try {
      await createGuia(client.id, {
        tracking: form.tracking.trim(),
        desc: form.desc.trim(),
        current: 'prealerta',
        tab: 'transito',
        received: new Date().toLocaleDateString('es-HN'),
        eta: '',
        weight: form.weight.trim() || '0',
        items: 1,
        type,
        note: form.note.trim(),
        price: form.price.trim() || '0',
        store: form.store.trim(),
        times: { prealerta: new Date().toLocaleString('es-HN') },
        createdAt: Date.now(),
      });
      setForm(emptyForm());
      toast('Paquete registrado');
      reload();
    } catch {
      toast('No se pudo registrar el paquete');
    } finally {
      setSaving(false);
    }
  };

  const handleStage = async (guia: Guia, stage: StageKey) => {
    try {
      await updateGuia(client.id, guia.id, {
        current: stage,
        tab: stage === 'entregado' ? 'entregado' : 'transito',
        times: { ...guia.times, [stage]: new Date().toLocaleString('es-HN') },
      });
      reload();
    } catch {
      toast('No se pudo actualizar el estado');
    }
  };

  return (
    <View>
      <Card style={{ padding: 16, marginBottom: 20 }}>
        <Txt w={800} style={{ fontSize: 17 }}>
          {client.name}
        </Txt>
        <Txt mono style={{ fontSize: 12.5, color: colors.lime, marginTop: 2 }}>
          #{client.casillero}
        </Txt>
        <Txt style={{ fontSize: 12.5, color: colors.gray, marginTop: 4 }}>
          {client.email} · {client.phone}
        </Txt>
      </Card>

      <Txt w={700} style={{ fontSize: 14, marginBottom: 10 }}>
        Registrar paquete nuevo
      </Txt>
      <Card style={{ padding: 16, marginBottom: 24, gap: 12 }}>
        <Input value={form.tracking} onChangeText={(t) => setForm((f) => ({ ...f, tracking: t }))} placeholder="Numero de tracking" />
        <Input value={form.desc} onChangeText={(t) => setForm((f) => ({ ...f, desc: t }))} placeholder="Descripcion (ej. Zapatos Nike)" />
        <Input value={form.store} onChangeText={(t) => setForm((f) => ({ ...f, store: t }))} placeholder="Tienda (ej. Amazon)" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Input value={form.weight} onChangeText={(t) => setForm((f) => ({ ...f, weight: t }))} placeholder="Peso (lb)" keyboardType="numeric" style={{ flex: 1 }} />
          <Input value={form.price} onChangeText={(t) => setForm((f) => ({ ...f, price: t }))} placeholder="Valor (L)" keyboardType="numeric" style={{ flex: 1 }} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['aereo', 'maritimo'] as const).map((t) => (
            <Pressable key={t} onPress={() => setType(t)} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: type === t ? colors.lime : colors.panel2 }}>
              <Txt w={700} style={{ fontSize: 13, color: type === t ? colors.onLime : colors.text }}>
                {t === 'aereo' ? 'Aereo' : 'Maritimo'}
              </Txt>
            </Pressable>
          ))}
        </View>
        <Button label="Registrar paquete" loading={saving} onPress={handleCreate} />
      </Card>

      <Txt w={700} style={{ fontSize: 14, marginBottom: 10 }}>
        Paquetes de este cliente {loading ? '' : `(${guias.length})`}
      </Txt>
      {loading ? (
        <Txt style={{ color: colors.gray }}>Cargando…</Txt>
      ) : guias.length === 0 ? (
        <Txt style={{ color: colors.gray }}>Sin paquetes registrados.</Txt>
      ) : (
        <View style={{ gap: 12 }}>
          {guias.map((g) => (
            <Card key={g.id} style={{ padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt w={700} style={{ fontSize: 14 }}>
                    {g.desc}
                  </Txt>
                  <Txt mono style={{ fontSize: 11, color: colors.gray, marginTop: 2 }}>
                    {g.tracking}
                  </Txt>
                </View>
                <StatusBadge stage={g.current} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {STAGES.map((s) => (
                  <Pressable
                    key={s.key}
                    onPress={() => handleStage(g, s.key)}
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 9,
                      borderRadius: 8,
                      backgroundColor: g.current === s.key ? colors.lime : colors.panel2,
                    }}
                  >
                    <Txt w={600} style={{ fontSize: 10.5, color: g.current === s.key ? colors.onLime : colors.gray }}>
                      {s.label}
                    </Txt>
                  </Pressable>
                ))}
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}

export default function AdminScreen() {
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);
  const signInWithCasillero = useAuthStore((s) => s.signInWithCasillero);
  const [client, setClient] = useState<UserProfile | null>(null);

  // Vista de muestra: entra sola con la cuenta de demostracion, sin pedir nada.
  useEffect(() => {
    if (initializing || user) return;
    signInWithCasillero(DEMO_CASILLERO, DEMO_PASSWORD).catch(() => {});
  }, [initializing, user, signInWithCasillero]);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(setClient);
  }, [user]);

  if (initializing || !user || !client) return <ScreenContainer>{null}</ScreenContainer>;

  return (
    <ScreenContainer>
      <AppBar title="Panel de administracion" sub="Lockr — vista de muestra" hideBack />
      <ScreenBody>
        <ClientDetail client={client} />
      </ScreenBody>
    </ScreenContainer>
  );
}

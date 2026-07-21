/**
 * Shared application types. Add domain models here as the app grows.
 */
import type { IconName } from '@/components/icons';

export type ID = string;

/* ============================================================
   Firestore domain models
   Collections are per-user: users/{uid}/{collection}/{docId}
   ============================================================ */

export type StageKey =
  | 'prealerta'
  | 'miami'
  | 'procesado'
  | 'transito'
  | 'aduana'
  | 'bodega'
  | 'ruta'
  | 'entregado';

/** users/{uid} — profile document, created at sign-up. */
export type UserProfile = {
  id: ID;
  casillero: string;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  createdAt: number;
  /** Expo/FCM device push token, saved after the OS grants permission. */
  pushToken?: string;
};

/** users/{uid}/guias/{guiaId} — one package/shipment. */
export type Guia = {
  id: ID;
  tracking: string;
  desc: string;
  current: StageKey;
  tab: 'transito' | 'entregado';
  received: string;
  eta: string;
  delivered?: string;
  weight: string;
  items: number;
  type: 'aereo' | 'maritimo';
  note: string;
  price: string;
  store: string;
  times: Partial<Record<StageKey, string>>;
  createdAt: number;
};

/** users/{uid}/notifs/{notifId} */
export type Notif = {
  id: ID;
  guia: string | null;
  icon: IconName;
  title: string;
  msg: string;
  time: string;
  day: 'Hoy' | 'Ayer' | 'Esta semana';
  unread: boolean;
  createdAt: number;
};

/** users/{uid}/addresses/{addressId} */
export type Address = {
  id: ID;
  type: 'Aérea' | 'Marítima' | 'Express';
  icon: IconName;
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

/** users/{uid}/payments/{paymentId} — saved card metadata only, never full PAN. */
export type Payment = {
  id: ID;
  brand: string;
  last: string;
  exp: string;
  primary: boolean;
};

/** users/{uid}/invoices/{invoiceId} */
export type Invoice = {
  id: ID;
  guiaId: string;
  amount: string;
  status: 'pagada' | 'pendiente';
  date: string;
  method: 'transferencia' | 'tarjeta';
};

/* ============================================================
   LOCKR — Mock data (ported from the design prototype)
   ============================================================ */
import type { IconName } from '@/components/icons';

export const USER = {
  casillero: 'LK40240',
  name: 'María Fernanda Discua',
  initials: 'MF',
  email: 'mf.discua@gmail.com',
  phone: '+504 9876-5432',
  birthday: '15/03/1995',
};

export type StageKey =
  | 'prealerta'
  | 'miami'
  | 'procesado'
  | 'transito'
  | 'aduana'
  | 'bodega'
  | 'ruta'
  | 'entregado';

export type Stage = { key: StageKey; label: string; loc: string; icon: IconName };

// Tracking pipeline stages (Miami -> Honduras casillero flow)
export const STAGES: Stage[] = [
  { key: 'prealerta', label: 'Prealerta registrada', loc: 'En línea', icon: 'bell' },
  { key: 'miami', label: 'Recibido en bodega Miami', loc: 'Doral, FL · USA', icon: 'warehouse' },
  { key: 'procesado', label: 'Procesado y empacado', loc: 'Doral, FL · USA', icon: 'box' },
  { key: 'transito', label: 'En tránsito', loc: 'Vuelo MIA → SAP', icon: 'planeUp' },
  { key: 'aduana', label: 'Proceso de liberación en aduana', loc: 'Aduana · Honduras', icon: 'shield' },
  { key: 'bodega', label: 'Disponible para retiro', loc: 'Bodega SPS Los Andes', icon: 'warehouse' },
  { key: 'ruta', label: 'En ruta de entrega', loc: 'San Pedro Sula', icon: 'truck' },
  { key: 'entregado', label: 'Entregado', loc: 'Tu domicilio', icon: 'checkCircle' },
];

export const STAGE_INDEX: Record<string, number> = Object.fromEntries(
  STAGES.map((s, i) => [s.key, i]),
);

export type TimelineStep = Stage & {
  state: 'done' | 'current' | 'future';
  time: string | null;
};

export function buildTimeline(
  currentKey: StageKey,
  times: Partial<Record<StageKey, string>> = {},
): TimelineStep[] {
  const ci = STAGE_INDEX[currentKey];
  return STAGES.map((s, i) => ({
    ...s,
    state: i < ci ? 'done' : i === ci ? 'current' : 'future',
    time: times[s.key] || null,
  }));
}

export type Guia = {
  id: string;
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
};

export const GUIAS: Guia[] = [
  {
    id: '2846981',
    tracking: 'TBADD0040157271',
    desc: 'Sony PlayStation 5 Slim',
    current: 'aduana',
    tab: 'transito',
    received: '14 May 2026',
    eta: '02 Jun 2026',
    weight: '5.2',
    items: 1,
    type: 'aereo',
    note: 'Consola + 2 controles',
    price: '480.00',
    store: 'Amazon',
    times: {
      prealerta: '12 May · 9:14 AM',
      miami: '14 May · 3:40 PM',
      procesado: '15 May · 11:02 AM',
      transito: '28 May · 6:20 AM',
      aduana: '29 May · 8:15 AM',
    },
  },
  {
    id: '2846910',
    tracking: 'TBADD0040149883',
    desc: 'Nike Air Max + ropa',
    current: 'transito',
    tab: 'transito',
    received: '22 May 2026',
    eta: '05 Jun 2026',
    weight: '3.0',
    items: 4,
    type: 'aereo',
    note: 'Frágil — no aplastar',
    price: '215.00',
    store: 'SHEIN',
    times: {
      prealerta: '20 May · 7:48 PM',
      miami: '22 May · 1:10 PM',
      procesado: '23 May · 9:30 AM',
      transito: '31 May · 5:55 AM',
    },
  },
  {
    id: '2844201',
    tracking: '1Z2Y0E050360173478',
    desc: 'iPhone 16 Pro Max',
    current: 'bodega',
    tab: 'transito',
    received: '18 May 2026',
    eta: '31 May 2026',
    weight: '1.4',
    items: 1,
    type: 'aereo',
    note: 'Retiro con QR',
    price: '320.00',
    store: 'Apple',
    times: {
      prealerta: '15 May · 10:00 AM',
      miami: '18 May · 2:22 PM',
      procesado: '19 May · 8:45 AM',
      transito: '27 May · 6:05 AM',
      aduana: '28 May · 9:00 AM',
      bodega: '30 May · 4:30 PM',
    },
  },
  {
    id: '2840117',
    tracking: 'TBADD0040120044',
    desc: 'Repuestos automotriz',
    current: 'entregado',
    tab: 'entregado',
    received: '02 May 2026',
    eta: '13 May 2026',
    delivered: '13 May 2026',
    weight: '12.8',
    items: 3,
    type: 'maritimo',
    note: 'Contenido general',
    price: '640.00',
    store: 'eBay',
    times: {
      prealerta: '28 Abr · 3:00 PM',
      miami: '02 May · 11:00 AM',
      procesado: '03 May · 10:00 AM',
      transito: '06 May · 7:00 AM',
      aduana: '09 May · 8:30 AM',
      bodega: '11 May · 2:00 PM',
      ruta: '13 May · 9:10 AM',
      entregado: '13 May · 1:45 PM',
    },
  },
  {
    id: '2838440',
    tracking: 'TBADD0040118870',
    desc: 'Libros y papelería',
    current: 'entregado',
    tab: 'entregado',
    received: '20 Abr 2026',
    eta: '02 May 2026',
    delivered: '01 May 2026',
    weight: '4.5',
    items: 6,
    type: 'aereo',
    note: '—',
    price: '95.00',
    store: 'Amazon',
    times: { entregado: '01 May · 11:20 AM' },
  },
];

export type Notif = {
  id: string;
  guia: string | null;
  icon: IconName;
  title: string;
  msg: string;
  time: string;
  day: 'Hoy' | 'Ayer' | 'Esta semana';
  unread: boolean;
};

export const NOTIFS: Notif[] = [
  {
    id: 'n1',
    guia: '2846981',
    icon: 'shield',
    title: 'En proceso de liberación en aduana',
    msg: 'Tu guía 2846981 (PlayStation 5) está siendo liberada en aduana de Honduras.',
    time: 'Hace 35 min',
    day: 'Hoy',
    unread: true,
  },
  {
    id: 'n2',
    guia: '2846910',
    icon: 'planeUp',
    title: 'Tu paquete despegó ✈',
    msg: 'La guía 2846910 va en camino. Vuelo MIA → San Pedro Sula.',
    time: 'Hace 3 h',
    day: 'Hoy',
    unread: true,
  },
  {
    id: 'n3',
    guia: '2844201',
    icon: 'warehouse',
    title: 'Disponible para retiro',
    msg: 'iPhone 16 Pro Max listo en Bodega SPS Los Andes. Retira con tu código QR.',
    time: 'Ayer · 4:30 PM',
    day: 'Ayer',
    unread: false,
  },
  {
    id: 'n4',
    guia: '2844201',
    icon: 'shield',
    title: 'Liberado de aduana',
    msg: 'La guía 2844201 completó el proceso aduanero.',
    time: 'Ayer · 9:00 AM',
    day: 'Ayer',
    unread: false,
  },
  {
    id: 'n5',
    guia: null,
    icon: 'gift',
    title: 'Miércoles de 55% en flete marítimo',
    msg: 'Aprovecha el descuento de hoy en todos tus envíos marítimos.',
    time: 'Mié · 8:00 AM',
    day: 'Esta semana',
    unread: false,
  },
  {
    id: 'n6',
    guia: '2840117',
    icon: 'checkCircle',
    title: 'Entregado en tu domicilio',
    msg: 'La guía 2840117 fue entregada. ¡Gracias por usar Lockr!',
    time: '13 May · 1:45 PM',
    day: 'Esta semana',
    unread: false,
  },
];

export type Address = {
  type: 'Aérea' | 'Marítima' | 'Express';
  icon: IconName;
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

// Las 3 modalidades comparten la MISMA dirección de Miami (modelo EconoCargo);
// solo cambia la etiqueta del servicio en el nombre. Teléfono Miami pendiente de confirmar.
const MIAMI = {
  name: 'Lockr · LK40240',
  line1: '23 NE 16th St, Apt #1',
  city: 'Fort Lauderdale',
  state: 'FL',
  zip: '33304-1042',
  phone: '+1 (305) 477-9020',
} as const;

export const ADDRESSES: Address[] = [
  { type: 'Aérea', icon: 'planeUp', ...MIAMI },
  { type: 'Marítima', icon: 'ship', ...MIAMI },
  { type: 'Express', icon: 'bolt', ...MIAMI },
];

// Shipping tiers — rate is USD per lb. Single source of truth for Cotizar + Direcciones.
// Tarifas según Lockr Design M1 (slide Cotizar). Aéreo/Express pendientes de confirmar con el cliente.
// Marítimo es por tramos de peso (ver maritimoRate); `rate` aquí es la tarifa mínima ("desde").
export const SHIPPING = {
  aereo: { label: 'Aéreo', rate: 8.5, eta: '8-10 días hábiles', icon: 'planeUp', tiered: false },
  maritimo: { label: 'Marítimo', rate: 2.5, eta: '10-15 días', icon: 'ship', tiered: true },
  express: { label: 'Express', rate: 10, eta: '5-7 días hábiles', icon: 'bolt', tiered: false },
} as const;

export type ShippingKey = keyof typeof SHIPPING;
export const HANDLING_USD = 4.5; // manejo y procesamiento por guía (≈ L110)
export const ISV = 0.15; // impuesto sobre ventas Honduras (15%)

// Marítimo: tarifa US$/lb por tramo de peso facturable (Lockr Design M1).
export function maritimoRate(lb: number): number {
  if (lb <= 25) return 3.5;
  if (lb <= 50) return 3.2;
  if (lb < 100) return 3.0;
  return 2.5;
}

// Address.type ('Aérea' | 'Marítima' | 'Express') -> SHIPPING key
export const ADDR_TO_SHIPPING: Record<Address['type'], ShippingKey> = {
  Aérea: 'aereo',
  Marítima: 'maritimo',
  Express: 'express',
};

export type Banner = { id: string; kicker: string; title: string; sub: string; tone: 'lime' | 'dark' | 'olive' };

export const BANNERS: Banner[] = [
  { id: 'b1', kicker: 'SIN MENSUALIDAD', title: 'Casillero en Miami GRATIS', sub: 'Tu dirección en USA en 2 min', tone: 'lime' },
  { id: 'b2', kicker: 'TODOS LOS MIÉRCOLES', title: '55% en flete marítimo', sub: 'Aplica en compras del día', tone: 'dark' },
  { id: 'b3', kicker: 'AL INSTANTE', title: 'Cotiza tu envío', sub: 'Estima el costo en segundos', tone: 'olive' },
];

export type Payment = { id: string; brand: string; last: string; exp: string; primary: boolean };

export const PAYMENTS: Payment[] = [
  { id: 'p1', brand: 'Visa', last: '4821', exp: '08/27', primary: true },
  { id: 'p2', brand: 'Mastercard', last: '9930', exp: '11/26', primary: false },
];

// Stage -> badge label/color/icon (brand palette only)
export type StatusMeta = { label: string; color: string; icon: IconName };

import { colors } from '@/theme/tokens';

export function statusMeta(key: string): StatusMeta {
  const map: Record<string, StatusMeta> = {
    prealerta: { label: 'Prealerta', color: colors.gray, icon: 'bell' },
    miami: { label: 'En bodega Miami', color: colors.gray, icon: 'warehouse' },
    procesado: { label: 'Procesado', color: colors.gray, icon: 'box' },
    transito: { label: 'En tránsito', color: colors.air, icon: 'planeUp' },
    aduana: { label: 'En aduana', color: colors.air, icon: 'shield' },
    bodega: { label: 'Disponible', color: colors.lime, icon: 'warehouse' },
    ruta: { label: 'En ruta', color: colors.lime, icon: 'truck' },
    entregado: { label: 'Entregado', color: colors.ok, icon: 'checkCircle' },
  };
  return map[key] || map.miami;
}

/**
 * Live tracking status — SECURE setup.
 *
 * The Ship24 API key NEVER ships in the app. The client calls our own
 * Expo Router API route (src/app/track+api.ts), which holds the key
 * server-side (process.env.SHIP24_API_KEY) and proxies Ship24.
 *
 * In development the route runs on the `expo start` dev server; in production
 * it deploys with the app (EAS Hosting). `normalizeShip24` is shared by both
 * sides so the contract stays in one place.
 */
export type StatusTone = 'ok' | 'live' | 'muted' | 'danger';
export type TrackStatus = {
  milestone: string;
  label: string;
  tone: StatusTone;
  lastEvent?: string;
  location?: string;
  datetime?: string;
  eta?: string;
};

// Ship24 statusMilestone -> Spanish label + tone
const MILESTONES: Record<string, { label: string; tone: StatusTone }> = {
  delivered: { label: 'Entregado', tone: 'ok' },
  out_for_delivery: { label: 'En reparto', tone: 'live' },
  in_transit: { label: 'En tránsito', tone: 'live' },
  available_for_pickup: { label: 'Listo para retiro', tone: 'live' },
  info_received: { label: 'Información recibida', tone: 'muted' },
  pending: { label: 'Pendiente', tone: 'muted' },
  failed_attempt: { label: 'Intento fallido', tone: 'danger' },
  exception: { label: 'Incidencia', tone: 'danger' },
};

/** Pure: Ship24 JSON -> normalized status. Used by the server API route. */
export function normalizeShip24(json: unknown): TrackStatus | null {
  const data = json as { data?: { trackings?: any[] } };
  const t = data?.data?.trackings?.[0];
  if (!t) return null;
  const milestone: string = t.shipment?.statusMilestone ?? 'pending';
  const ev = Array.isArray(t.events) ? t.events[0] : undefined;
  const m = MILESTONES[milestone] ?? { label: 'En proceso', tone: 'muted' as StatusTone };
  return {
    milestone,
    label: m.label,
    tone: m.tone,
    lastEvent: ev?.status,
    location: ev?.location,
    datetime: ev?.occurrenceDatetime,
    eta: t.shipment?.delivery?.estimatedDeliveryDate,
  };
}

// 17TRACK status string -> our milestone key
const MS17: Record<string, string> = {
  InfoReceived: 'info_received',
  InTransit: 'in_transit',
  PickedUp: 'in_transit',
  OutForDelivery: 'out_for_delivery',
  AvailableForPickup: 'available_for_pickup',
  Delivered: 'delivered',
  Exception: 'exception',
  FailedAttempt: 'failed_attempt',
  NotFound: 'pending',
  Pending: 'pending',
};

/** Pure: 17TRACK gettrackinfo JSON -> normalized status. Used by the server API route. */
export function normalize17track(json: unknown): TrackStatus | null {
  const ti = (json as any)?.data?.accepted?.[0]?.track_info;
  if (!ti) return null;
  const raw: string = ti.latest_status?.status ?? 'Pending';
  const sub: string = ti.latest_status?.sub_status ?? '';
  let milestone = MS17[raw] ?? 'pending';
  if (sub.startsWith('InTransit_OutForDelivery')) milestone = 'out_for_delivery';
  if (sub.startsWith('Exception_Delivery_Failed') || sub.includes('FailedAttempt')) milestone = 'failed_attempt';
  const m = MILESTONES[milestone] ?? { label: 'En proceso', tone: 'muted' as StatusTone };
  const eta = ti.time_metrics?.estimated_delivery_date?.from ?? ti.time_metrics?.estimated_delivery_date?.to ?? undefined;
  return {
    milestone,
    label: m.label,
    tone: m.tone,
    lastEvent: ti.latest_event?.description,
    location: ti.latest_event?.location,
    datetime: ti.latest_event?.time_iso,
    eta,
  };
}

/** Client: ask our own server proxy for the live status. */
export async function fetchTrackingStatus(trackingNumber: string, carrier?: string): Promise<TrackStatus | 'fetching' | null> {
  const res = await fetch('/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trackingNumber, carrier }),
  });
  if (res.status === 202) return 'fetching'; // registered, courier data still loading
  if (res.status === 204 || res.status === 503) return null; // no result / not configured
  if (!res.ok) throw new Error(`track ${res.status}`);
  return (await res.json()) as TrackStatus;
}

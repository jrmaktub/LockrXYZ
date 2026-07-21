/**
 * Carrier detection + official tracking links.
 *
 * Client-only MVP: detect the carrier from the tracking-number format and
 * deep-link to the carrier's authoritative status page (works in Expo Go,
 * no backend, no API keys).
 *
 * SWAP SEAM: to show in-app status later, replace the `buildTrackingUrl` +
 * Linking.openURL call in buscar.tsx with a fetch to an Expo Router API route
 * that proxies an aggregator (TrackingMore / Ship24). The detection map and UI
 * stay identical.
 */
// code17 = 17TRACK carrier code (needed because auto-detection fails on ambiguous numbers)
export type Carrier = { carrier: string; regex: RegExp; trackingUrl: string; code17?: number };

// ORDER MATTERS: specific prefixed/long patterns before the bare-numeric fallbacks.
export const CARRIERS: Carrier[] = [
  { carrier: 'UPS', code17: 100002, regex: /^1Z[0-9A-Z]{16}$/i, trackingUrl: 'https://www.ups.com/track?loc=en_US&tracknum={TRACKING}&requester=ST/trackdetails' },
  { carrier: 'USPS', code17: 21051, regex: /^(\d{20}|\d{26}|(91|92|93|94|95|96)\d{18,20}|[A-Z]{2}\d{9}US)$/i, trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1={TRACKING}' },
  { carrier: 'Amazon', regex: /^TB[A-Z]\d{12,15}$/i, trackingUrl: 'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?trackingId={TRACKING}' },
  { carrier: 'DHL', code17: 7041, regex: /^(\d{10,11}|JD\d{18}|JJD\d{16,18}|(GM|LX|RX|UV|CN|SG|TH|IN|HK|MY)\d{6,}\w*)$/i, trackingUrl: 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id={TRACKING}' },
  { carrier: 'FedEx', code17: 100003, regex: /^(\d{12}|\d{15}|\d{20}|\d{22})$/, trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr={TRACKING}' },
];

export const carrier17Code = (name?: string): number | undefined =>
  name ? CARRIERS.find((c) => c.carrier === name)?.code17 : undefined;

export const normalizeTracking = (s: string) => s.replace(/\s+/g, '').toUpperCase();

export function detectCarrier(raw: string): Carrier | null {
  const n = normalizeTracking(raw);
  return CARRIERS.find((c) => c.regex.test(n)) ?? null;
}

export function buildTrackingUrl(c: Carrier, raw: string): string {
  return c.trackingUrl.replace('{TRACKING}', encodeURIComponent(normalizeTracking(raw)));
}

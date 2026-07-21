import { carrier17Code } from '@/lib/carriers';
import { normalize17track } from '@/lib/tracking';

/**
 * Server-side tracking proxy → 17TRACK (free: 100 shipments/month, no card).
 * The API key lives here only (process.env.SEVENTEENTRACK_API_KEY) and never
 * reaches the client bundle.
 *
 * 17TRACK needs the carrier (auto-detection fails on ambiguous numbers) and
 * fetches asynchronously — the first lookup for a new number can take a minute,
 * then it's cached. So: register with the detected carrier, poll briefly, and
 * if the courier data hasn't landed yet, tell the client it's still loading.
 */
const BASE = 'https://api.17track.net/track/v2.2';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function t17(path: string, key: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', '17token': key },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`17track ${res.status}`);
  return res.json();
}

const hasEvent = (json: any) => !!json?.data?.accepted?.[0]?.track_info?.latest_event;
// -18019909 = "No tracking information at this time" → registered, still fetching
const stillFetching = (json: any) => json?.data?.rejected?.[0]?.error?.code === -18019909;

export async function POST(request: Request): Promise<Response> {
  const key = process.env.SEVENTEENTRACK_API_KEY;
  if (!key) return Response.json({ error: 'not_configured' }, { status: 503 });

  let trackingNumber = '';
  let carrier: string | undefined;
  try {
    const body = (await request.json()) as { trackingNumber?: string; carrier?: string };
    trackingNumber = (body.trackingNumber ?? '').trim();
    carrier = body.carrier;
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!trackingNumber) return Response.json({ error: 'bad_request' }, { status: 400 });

  try {
    // 1) register with the carrier code when known, else let 17track auto-detect
    const code = carrier17Code(carrier);
    const reg = code ? { number: trackingNumber, carrier: code } : { number: trackingNumber, auto_detection: true, lang: 'en' };
    await t17('/register', key, [reg]);

    // 2) poll briefly — already-fetched numbers return instantly; new ones need a minute
    let json = await t17('/gettrackinfo', key, [{ number: trackingNumber }]);
    for (let i = 0; !hasEvent(json) && i < 4; i++) {
      await sleep(3000);
      json = await t17('/gettrackinfo', key, [{ number: trackingNumber }]);
    }

    const status = normalize17track(json);
    if (status) return Response.json(status);
    if (stillFetching(json)) return Response.json({ fetching: true }, { status: 202 });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: 'upstream' }, { status: 502 });
  }
}

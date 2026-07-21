/**
 * Per-user data seeding.
 *
 * A brand-new casillero legitimately has zero packages until the bodega
 * registers one — that's real backend behavior, not a placeholder. The
 * only thing every account genuinely shares on day one is the physical
 * Miami/Honduras address block, so that's what sign-up seeds for real.
 *
 * `seedDemoGuiasForUser` is a separate, explicitly-invoked helper (never
 * called from the sign-up flow) for populating sample packages/notifs
 * when demoing or QA-ing the app against a live Firebase project.
 */
import { ADDRESSES, GUIAS, NOTIFS, PAYMENTS } from '@/data/mock';
import type { Address, Guia, Notif, Payment } from '@/types';

import { createDocument, setDocument } from './firestore';

const sub = (uid: string, name: string) => `users/${uid}/${name}`;

/** Called once at sign-up: writes the standard Miami/Honduras address block. */
export async function seedAddressesForUser(uid: string) {
  await Promise.all(
    ADDRESSES.map((addr, i) => setDocument(sub(uid, 'addresses'), `addr-${i}`, addr as Address)),
  );
}

/** Dev/demo only — populates sample guias, notifs and a demo card. Never called at sign-up. */
export async function seedDemoGuiasForUser(uid: string) {
  await Promise.all([
    ...GUIAS.map((g) => {
      const { id: _id, ...rest } = g;
      return createDocument(sub(uid, 'guias'), { ...rest, createdAt: Date.now() } satisfies Omit<Guia, 'id'>);
    }),
    ...NOTIFS.map((n) => {
      const { id: _id, ...rest } = n;
      return createDocument(sub(uid, 'notifs'), { ...rest, createdAt: Date.now() } satisfies Omit<Notif, 'id'>);
    }),
    ...PAYMENTS.map((p, i) => setDocument(sub(uid, 'payments'), `pm-${i}`, p as Payment)),
  ]);
}

import type { User } from 'firebase/auth';
import { create } from 'zustand';

import { casilleroToEmail, resetPassword, signIn, signOut, signUp, subscribeToAuth } from '@/lib/firebase/auth';
import { createUserProfile, finalizeCasillero, getUserProfile, reserveNewCasillero } from '@/lib/firebase/repo';
import { seedAddressesForUser } from '@/lib/firebase/seed';
import type { UserProfile } from '@/types';

type SignUpInput = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  password: string;
};

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  initializing: boolean;
  /** Sign in with casillero number + password (e.g. "LK40240"). */
  signInWithCasillero: (casillero: string, password: string) => Promise<void>;
  /** Create a new casillero: reserves a number, creates the auth user, seeds addresses. */
  signUpNewCasillero: (input: SignUpInput) => Promise<string>;
  /** Sends a password-reset email to the account's real email address. */
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Begin listening to Firebase auth state. Returns an unsubscribe function. */
  init: () => () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  initializing: true,

  signInWithCasillero: async (casillero, password) => {
    await signIn(casilleroToEmail(casillero), password);
  },

  signUpNewCasillero: async ({ name, email, phone, birthday, password }) => {
    const casillero = await reserveNewCasillero();
    const cred = await signUp(casilleroToEmail(casillero), password);
    const uid = cred.user.uid;
    const profile: UserProfile = {
      id: uid,
      casillero,
      name,
      email,
      phone,
      birthday,
      createdAt: Date.now(),
    };
    await finalizeCasillero(casillero, uid);
    await createUserProfile(uid, profile);
    await seedAddressesForUser(uid);
    // Firebase's auth-state listener fires the instant signUp() resolves —
    // before this function has written the profile doc — so it would read
    // `null` and never look again. Set it here directly so the UI reflects
    // the account we just created instead of racing that listener.
    set({ profile });
    return casillero;
  },

  resetPassword: async (email) => {
    await resetPassword(email);
  },

  signOut: async () => {
    await signOut();
  },

  init: () =>
    subscribeToAuth(async (user) => {
      if (!user) {
        set({ user: null, profile: null, initializing: false });
        return;
      }
      const profile = await getUserProfile(user.uid);
      set({ user, profile, initializing: false });
    }),
}));

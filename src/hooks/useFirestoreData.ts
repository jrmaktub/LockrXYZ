import { useEffect, useState } from 'react';

import { getAddresses, getInvoices, getPayments, subscribeGuias, subscribeNotifs } from '@/lib/firebase/repo';
import { useAuthStore } from '@/store/auth-store';
import type { Address, Guia, Invoice, Notif, Payment } from '@/types';

/** Realtime list of the current user's guias (packages). */
export function useGuias() {
  const uid = useAuthStore((s) => s.user?.uid);
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    return subscribeGuias(uid, (items) => {
      setGuias(items);
      setLoading(false);
    });
  }, [uid]);

  // Signed out is a pure derivation, not a reset — no setState needed for it.
  return uid ? { guias, loading } : { guias: [], loading: false };
}

/** Realtime list of the current user's notifications. */
export function useNotifs() {
  const uid = useAuthStore((s) => s.user?.uid);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    return subscribeNotifs(uid, (items) => {
      setNotifs(items);
      setLoading(false);
    });
  }, [uid]);

  return uid ? { notifs, loading } : { notifs: [], loading: false };
}

/** One-shot fetch — addresses rarely change within a session. */
export function useAddresses() {
  const uid = useAuthStore((s) => s.user?.uid);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    getAddresses(uid).then((items) => {
      if (alive) {
        setAddresses(items);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [uid]);

  return uid ? { addresses, loading } : { addresses: [], loading: false };
}

export function usePayments() {
  const uid = useAuthStore((s) => s.user?.uid);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    getPayments(uid).then((items) => {
      if (alive) {
        setPayments(items);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [uid]);

  return uid ? { payments, loading } : { payments: [], loading: false };
}

export function useInvoices() {
  const uid = useAuthStore((s) => s.user?.uid);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    getInvoices(uid).then((items) => {
      if (alive) {
        setInvoices(items);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [uid]);

  return uid ? { invoices, loading } : { invoices: [], loading: false };
}

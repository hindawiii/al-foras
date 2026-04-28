import { useEffect, useState } from "react";
import { CURRENCIES, Currency } from "@/lib/mockData";

export interface LiveRates {
  rates: Record<string, number>;
  updatedAt: Date | null;
  loading: boolean;
  error: string | null;
  alert: { code: string; delta: number } | null;
}

const ENDPOINT = "https://open.er-api.com/v6/latest/USD";

export const useLiveRates = (intervalMs = 60_000): LiveRates => {
  const [rates, setRates] = useState<Record<string, number>>(
    Object.fromEntries(CURRENCIES.map(c => [c.code, c.rate]))
  );
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ code: string; delta: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINT);
        if (!res.ok) throw new Error("network");
        const data = await res.json();
        if (cancelled) return;
        const next: Record<string, number> = {};
        let biggest: { code: string; delta: number } | null = null;
        for (const c of CURRENCIES) {
          const apiCode = c.apiCode ?? c.code;
          const v = data?.rates?.[apiCode];
          if (typeof v === "number") {
            next[c.code] = v;
            const prev = rates[c.code] ?? c.rate;
            const delta = ((v - prev) / prev) * 100;
            if (Math.abs(delta) > Math.abs(biggest?.delta ?? 0) && Math.abs(delta) > 0.5) {
              biggest = { code: c.code, delta };
            }
          } else {
            next[c.code] = rates[c.code] ?? c.rate;
          }
        }
        setRates(next);
        setUpdatedAt(new Date());
        setError(null);
        if (biggest) setAlert(biggest);
      } catch (e) {
        if (!cancelled) setError("تعذر تحديث الأسعار — عرض بيانات افتراضية");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const t = window.setInterval(load, intervalMs);
    return () => { cancelled = true; window.clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return { rates, updatedAt, loading, error, alert };
};

export const enrichCurrencies = (rates: Record<string, number>): (Currency & { liveRate: number })[] =>
  CURRENCIES.map(c => ({ ...c, liveRate: rates[c.code] ?? c.rate }));
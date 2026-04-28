import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useLiveRates } from "./useLiveRates";
import { SCHOLARSHIPS } from "@/lib/mockData";

/**
 * Lightweight in-app notifications simulator:
 *  - shows toast on significant currency moves (from useLiveRates.alert)
 *  - periodically surfaces a "new matching scholarship" toast
 *  - periodically surfaces an "urgent news" toast
 * This stands in for native push notifications inside the PWA preview.
 */
export const useLiveNotifications = () => {
  const { alert } = useLiveRates();
  const seenAlert = useRef<string | null>(null);
  const tickRef = useRef(0);

  // Currency alerts
  useEffect(() => {
    if (!alert) return;
    const key = `${alert.code}:${alert.delta.toFixed(2)}`;
    if (seenAlert.current === key) return;
    seenAlert.current = key;
    const up = alert.delta >= 0;
    toast(`تنبيه أسعار: ${alert.code}`, {
      description: `${up ? "ارتفاع" : "انخفاض"} ملحوظ بنسبة ${alert.delta.toFixed(2)}% — راجع مركز العملات.`,
    });
  }, [alert]);

  // Periodic simulated notifications
  useEffect(() => {
    const id = window.setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      if (tick % 2 === 1) {
        const s = SCHOLARSHIPS[Math.floor(Math.random() * SCHOLARSHIPS.length)];
        toast("منحة جديدة تطابق ملفك", {
          description: `${s.title} — ${s.country}`,
        });
      } else {
        toast("خبر عاجل", {
          description: "تحديث مهم في الفرص العالمية — افتح تبويب الأخبار للاطلاع.",
        });
      }
    }, 45_000);
    return () => window.clearInterval(id);
  }, []);
};
import { useEffect, useState } from "react";

export interface GeoInfo {
  city?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
}

const STORAGE_KEY = "foras-geo";

/**
 * Tries to obtain the user's position via the browser Geolocation API,
 * then reverse-geocodes it into a city/country (Open-Meteo, free, no key).
 * Caches the result in localStorage to avoid repeated prompts.
 */
export const useGeolocation = (auto = true) => {
  const [info, setInfo] = useState<GeoInfo | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as GeoInfo : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("الموقع غير مدعوم");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=ar&format=json`
          ).then(r => r.json());
          const place = res?.results?.[0];
          const next: GeoInfo = {
            latitude, longitude,
            city: place?.name,
            country: place?.country,
            countryCode: place?.country_code,
          };
          setInfo(next);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          const next: GeoInfo = { latitude, longitude };
          setInfo(next);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } finally { setLoading(false); }
      },
      (err) => {
        setError(err.message || "تعذر الوصول إلى الموقع");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 1000 * 60 * 30 }
    );
  };

  useEffect(() => {
    if (!auto) return;
    if (info?.city) return; // already cached
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { info, loading, error, request };
};

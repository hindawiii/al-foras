import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SettingsCtx {
  darkMode: boolean;
  toggleDarkMode: () => void;
  textOnly: boolean;
  toggleTextOnly: () => void;
  localCurrency: string;
  setLocalCurrency: (code: string) => void;
  city: string;
  setCity: (city: string) => void;
  countryCode: string | null;
  setCountryCode: (code: string | null) => void;
  /** True if the user has manually picked a currency (don't auto-override). */
  currencyManuallySet: boolean;
  /** Privacy: allow location sharing (GPS + weather). Default true. */
  locationSharingEnabled: boolean;
  setLocationSharingEnabled: (v: boolean) => void;
  /** Privacy: hide profile details from other app users. */
  hideProfile: boolean;
  setHideProfile: (v: boolean) => void;
}

const Ctx = createContext<SettingsCtx>({
  darkMode: true, toggleDarkMode: () => {},
  textOnly: false, toggleTextOnly: () => {},
  localCurrency: "SAR", setLocalCurrency: () => {},
  city: "الرياض", setCity: () => {},
  countryCode: null, setCountryCode: () => {},
  currencyManuallySet: false,
  locationSharingEnabled: true, setLocationSharingEnabled: () => {},
  hideProfile: false, setHideProfile: () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("foras-dark") !== "false");
  const [textOnly, setTextOnly] = useState(() => localStorage.getItem("foras-textonly") === "true");
  const [localCurrency, setLocalCurrencyState] = useState(() => localStorage.getItem("foras-localcurrency") || "SAR");
  const [city, setCityState] = useState(() => localStorage.getItem("foras-city") || "الرياض");
  const [countryCode, setCountryCodeState] = useState<string | null>(
    () => localStorage.getItem("foras-countrycode") || null
  );
  const [currencyManuallySet, setCurrencyManuallySet] = useState(
    () => localStorage.getItem("foras-currency-manual") === "true"
  );
  const [locationSharingEnabled, setLocationSharingEnabledState] = useState<boolean>(
    () => localStorage.getItem("foras-location-sharing") !== "false"
  );
  const [hideProfile, setHideProfileState] = useState<boolean>(
    () => localStorage.getItem("foras-hide-profile") === "true"
  );

  const setLocationSharingEnabled = (v: boolean) => {
    setLocationSharingEnabledState(v);
    localStorage.setItem("foras-location-sharing", String(v));
    window.dispatchEvent(new CustomEvent("foras:location-sharing", { detail: { enabled: v } }));
  };
  const setHideProfile = (v: boolean) => {
    setHideProfileState(v);
    localStorage.setItem("foras-hide-profile", String(v));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
    localStorage.setItem("foras-dark", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("foras-textonly", String(textOnly));
  }, [textOnly]);

  const setLocalCurrency = (code: string) => {
    setLocalCurrencyState(code);
    localStorage.setItem("foras-localcurrency", code);
    setCurrencyManuallySet(true);
    localStorage.setItem("foras-currency-manual", "true");
  };
  const setCity = (c: string) => {
    setCityState(c);
    localStorage.setItem("foras-city", c);
  };
  const setCountryCode = (code: string | null) => {
    setCountryCodeState(code);
    if (code) localStorage.setItem("foras-countrycode", code);
    else localStorage.removeItem("foras-countrycode");
    window.dispatchEvent(new CustomEvent("foras:countrychange", { detail: { code } }));
  };

  return (
    <Ctx.Provider value={{
      darkMode,
      toggleDarkMode: () => setDarkMode(v => !v),
      textOnly,
      toggleTextOnly: () => setTextOnly(v => !v),
      localCurrency, setLocalCurrency,
      city, setCity,
      countryCode, setCountryCode,
      currencyManuallySet,
      locationSharingEnabled, setLocationSharingEnabled,
      hideProfile, setHideProfile,
    }}>{children}</Ctx.Provider>
  );
};

export const useSettings = () => useContext(Ctx);

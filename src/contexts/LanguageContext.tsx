import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { COUNTRIES } from "@/lib/countries";

export type Lang = "ar" | "en";

interface LanguageCtx {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const STRINGS: Record<Lang, Record<string, string>> = {
  ar: {
    settings: "الإعدادات",
    darkMode: "الوضع الليلي",
    accountSettings: "إعدادات الحساب",
    privacy: "الخصوصية والأمان",
    about: "حول التطبيق",
    clearCache: "مسح الملفات المؤقتة",
    shareApp: "مشاركة التطبيق",
    logout: "تسجيل الخروج",
    language: "اللغة",
    arabic: "العربية",
    english: "English",
    notifications: "الإشعارات",
    confirmLogout: "تأكيد تسجيل الخروج",
    confirmLogoutDesc: "هل أنت متأكد أنك تريد الخروج من حسابك؟",
    yesLogout: "نعم، اخرج",
    cancel: "إلغاء",
    privacyTitle: "سياسة الخصوصية والأمان",
    privacyBody:
      "نحن نلتزم بحماية بياناتك الشخصية. لا نشارك معلوماتك مع أطراف ثالثة دون إذنك. تُخزّن البيانات الحساسة بشكل مشفّر، ويُستخدم بريدك الإلكتروني فقط لتسجيل الدخول والإشعارات. يمكنك حذف حسابك وبياناتك في أي وقت من إعدادات الحساب.",
    close: "إغلاق",
  },
  en: {
    settings: "Settings",
    darkMode: "Dark mode",
    accountSettings: "Account settings",
    privacy: "Privacy & Security",
    about: "About",
    clearCache: "Clear cache",
    shareApp: "Share app",
    logout: "Sign out",
    language: "Language",
    arabic: "العربية",
    english: "English",
    notifications: "Notifications",
    confirmLogout: "Confirm sign out",
    confirmLogoutDesc: "Are you sure you want to sign out?",
    yesLogout: "Yes, sign out",
    cancel: "Cancel",
    privacyTitle: "Privacy & Security Policy",
    privacyBody:
      "We are committed to protecting your personal data. We never share your information with third parties without consent. Sensitive data is stored encrypted, and your email is used only for sign-in and notifications. You can delete your account and data at any time from account settings.",
    close: "Close",
  },
};

const ARABIC_COUNTRY_CODES = new Set(
  ["SA","AE","QA","KW","BH","OM","EG","SD","MA","DZ","TN","LY","JO","LB","SY","IQ","YE","PS"]
);

const detectInitialLang = (): Lang => {
  const stored = localStorage.getItem("foras-lang") as Lang | null;
  if (stored === "ar" || stored === "en") return stored;
  // Country code from previous geo-sync
  const cc = localStorage.getItem("foras-countrycode");
  if (cc && ARABIC_COUNTRY_CODES.has(cc.toUpperCase())) return "ar";
  // Browser language
  const browser = (navigator.language || "en").toLowerCase();
  if (browser.startsWith("ar")) return "ar";
  return "en";
};

const Ctx = createContext<LanguageCtx>({
  lang: "ar", dir: "rtl",
  setLang: () => {}, toggleLang: () => {},
  t: (k) => k,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());
  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("foras-lang", lang);
  }, [lang, dir]);

  // If country code becomes known later and user hasn't manually picked, refine.
  useEffect(() => {
    const onCountry = (e: Event) => {
      if (localStorage.getItem("foras-lang-manual")) return;
      const code = (e as CustomEvent).detail?.code as string | undefined;
      if (!code) return;
      setLangState(ARABIC_COUNTRY_CODES.has(code.toUpperCase()) ? "ar" : "en");
    };
    window.addEventListener("foras:countrychange", onCountry as EventListener);
    return () => window.removeEventListener("foras:countrychange", onCountry as EventListener);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("foras-lang-manual", "true");
  }, []);
  const toggleLang = useCallback(() => setLang(lang === "ar" ? "en" : "ar"), [lang, setLang]);
  const t = useCallback((key: string) => STRINGS[lang][key] ?? key, [lang]);

  // touch COUNTRIES so tree-shaker keeps the import side-effect-free
  void COUNTRIES;

  return (
    <Ctx.Provider value={{ lang, dir, setLang, toggleLang, t }}>{children}</Ctx.Provider>
  );
};

export const useLanguage = () => useContext(Ctx);

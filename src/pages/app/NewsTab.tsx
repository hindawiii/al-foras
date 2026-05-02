import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Globe2, MapPin, RefreshCw, FileText, ExternalLink, Sparkles } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Switch } from "@/components/ui/switch";
import { WeatherWidget } from "@/components/foras/WeatherWidget";
import { useNewsFeed, FeedItem } from "@/hooks/useNewsFeed";
import { findCountryByCode } from "@/lib/countries";
import { InAppBrowser } from "@/components/foras/InAppBrowser";
import { useLanguage } from "@/contexts/LanguageContext";

const catsDef = [
  { id: "all"    as const, key: "catAll",    icon: Newspaper },
  { id: "local"  as const, key: "catLocal",  icon: MapPin },
  { id: "arab"   as const, key: "catArab",   icon: Newspaper },
  { id: "global" as const, key: "catGlobal", icon: Globe2 },
];

export const NewsTab = () => {
  const [cat, setCat] = useState<typeof catsDef[number]["id"]>("all");
  const { textOnly, toggleTextOnly, countryCode } = useSettings();
  const { items, loading, error, updatedAt } = useNewsFeed();
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [browserTitle, setBrowserTitle] = useState<string | undefined>();
  const { t, lang, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const alignClass = isRtl ? "text-right" : "text-left";

  const country = findCountryByCode(countryCode);

  const filtered = useMemo(() => {
    if (cat === "all") return items;
    if (cat === "local") {
      // "Local" = items mentioning user's country in title/summary
      const needles = [country?.nameAr, country?.nameEn].filter(Boolean) as string[];
      if (needles.length === 0) return items.filter(i => i.category === "arab");
      return items.filter(i =>
        needles.some(n => i.title.includes(n) || i.summary.includes(n))
      );
    }
    return items.filter(i => i.category === cat);
  }, [items, cat, country]);

  const open = (item: FeedItem) => {
    setBrowserUrl(item.link);
    setBrowserTitle(item.source);
  };

  return (
    <div className="space-y-4 pb-24">
      <WeatherWidget />

      <div className="flex items-center justify-between glass rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm">{t("dataSaver")}</span>
        </div>
        <Switch checked={textOnly} onCheckedChange={toggleTextOnly} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {catsDef.map(c => {
          const Icon = c.icon;
          const active = cat === c.id;
          return (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                active ? "bg-gold-gradient text-primary-foreground shadow-gold" : "bg-card border border-border text-muted-foreground hover:border-primary/40"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {t(c.key)}
              {c.id === "local" && country && (
                <span className="text-[10px] opacity-80">{country.flag}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
        <span className="flex items-center gap-1">
          {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
          {updatedAt ? `${t("lastUpdated")} ${updatedAt.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US")}` : t("loadingShort")}
        </span>
        <span>{filtered.length} {t("newsCount")}</span>
      </div>

      {error && filtered.length === 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-center text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pb-32">
        {filtered.slice(0, 60).map((item, i) => (
          <NewsCard key={item.id} item={item} index={i} textOnly={textOnly} onOpen={() => open(item)} alignClass={alignClass} isRtl={isRtl} openLabel={t("openSource")} />
        ))}
      </div>

      <InAppBrowser url={browserUrl} title={browserTitle} onClose={() => setBrowserUrl(null)} />
    </div>
  );
};

const NewsCard = ({
  item, index, textOnly, onOpen, alignClass, isRtl, openLabel,
}: { item: FeedItem; index: number; textOnly: boolean; onOpen: () => void; alignClass: string; isRtl: boolean; openLabel: string }) => (
  <motion.article
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(index * 0.03, 0.6) }}
    onClick={onOpen}
    className="group bg-card-gradient border border-border hover:border-primary/40 rounded-2xl overflow-hidden transition-all flex flex-col cursor-pointer"
  >
    {!textOnly && item.image && (
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img src={item.image} alt={item.title} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <span className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-background/80 backdrop-blur-sm text-[10px] text-primary font-bold px-2 py-0.5 rounded-full border border-primary/30`}>
          {item.source}
        </span>
      </div>
    )}
    <div className={`p-3 flex flex-col flex-1 ${alignClass}`}>
      <div className={`flex items-center ${isRtl ? "justify-end" : "justify-start"} gap-2 text-[10px] text-muted-foreground mb-1.5`}>
        {(textOnly || !item.image) && <span className="text-primary font-medium">{item.source}</span>}
        <span>{item.time}</span>
      </div>
      <h3 className="font-display text-sm text-foreground mb-1.5 leading-snug line-clamp-3">{item.title}</h3>
      {!textOnly && item.summary && (
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{item.summary}</p>
      )}
      <div className={`mt-2 flex items-center ${isRtl ? "justify-end" : "justify-start"} gap-1 text-[10px] text-primary`}>
        <ExternalLink className="w-3 h-3" />
        <span>{openLabel}</span>
      </div>
    </div>
  </motion.article>
);
